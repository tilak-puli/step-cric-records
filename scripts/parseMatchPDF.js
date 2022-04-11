const { PdfReader } = require("pdfreader");

const getPdfData = (filePath) => {
    return new Promise((res) => {
        const data = [];
        new PdfReader().parseFileItems(filePath, (err, item) => {
            if (err) console.error("error:", err);
            else if (!item) res(data);
            else if (item.text) data.push(item.text);
        });
    });
}

function getTeamNames(lines) {
    return lines[0].split(" v/s ");
}

function getResult(lines) {
    return lines[1];
}

function getScore(lines, i) {
    return {
        runs: +lines[i + 1].split("-")[0],
        wickets: +lines[i + 1].split("-")[1].split(" ")[0],
        overs: lines[i + 1].match(/\((.*)\)/)[1]
    };
}

function getBatting(lines, i) {
    const batting = [];

    for (let hasBatsman = true; hasBatsman;) {
        const batsman = {name: lines[i]};
        batsman.outReason = lines[i + 1];
        batsman.balls = +lines[i + 2];
        batsman.runs = +lines[i + 3];
        batsman.fours = +lines[i + 4];
        batsman.sixes = +lines[i + 5];
        batsman.runRate = lines[i + 6];

        i = i + 7;

        batting.push(batsman);
        if (lines[i] === "Extras") {
            hasBatsman = false;
        }

    }
    return [batting, i];
}

function getBowling(lines, i) {
    const bowling = [];

    for (let hasBowler = true; hasBowler;) {
        const bowler = {name: lines[i]};
        bowler.overs = +lines[i + 1];
        bowler.maidens = +lines[i + 2];
        bowler.runs = +lines[i + 3];
        bowler.wickets = +lines[i + 4];
        bowler.bowlingRunRate = lines[i + 5];

        i = i + 6;

        bowling.push(bowler);
        if (lines[i] === "Fall of wickets") {
            hasBowler = false;
        }

    }
    return [bowling, i];
}

function getExtrasGot(lines, i) {
    return +lines[i + 1].match(/\((.*)\)/)[1];
}

function getBattingRunRate(lines, i) {
    return +lines[i + 3].split(" ")[2];
}

function findNextTeamStart(lines, i) {
    while(lines[i]){
        if(lines[i].match(/.*-.* \(.*\)/)){
            return i-1;
        }
        i+=1;
    }
}

function getTeamScores(lines) {
    let i = 2;
    let  team1 = {};
    let  team2 = {};
    team1.name = lines[i];
    team1.score = getScore(lines, i);

    i += 8;
    [team1.batting, i] = getBatting(lines, i);
    team1.extrasGot = getExtrasGot(lines, i);
    team1.battingRunRate = getBattingRunRate(lines, i);
    team2.extrasBowled = team1.extrasGot;
    team2.extrasBowledText = lines[i+1];

    i += 10;
    [team2.bowling, i] = getBowling(lines, i);

    i = findNextTeamStart(lines, i)

    team2.name = lines[i];
    team2.score = getScore(lines, i);

    i += 8;
    [team2.batting, i] = getBatting(lines, i);
    team2.extrasGot = getExtrasGot(lines, i);
    team2.battingRunRate = getBattingRunRate(lines, i);
    team1.extrasBowled = team1.extrasGot;
    team1.extrasBowledText = lines[i+1];

    i += 10;
    [team1.bowling] = getBowling(lines, i);
    return {team1, team2};
}

const parseMatchPDF = async (filePath) => {
    const data = {}
    const lines = await getPdfData(filePath);
    data.teamNames = getTeamNames(lines);
    data.result = getResult(lines);
    data.teams = getTeamScores(lines);
    data.winner = lines[1].split(' ')[1];

    data.matchUploadedDate = new Date();

    return data;
}

module.exports = parseMatchPDF;
