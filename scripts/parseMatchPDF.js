const { PdfReader } = require("pdfreader");
const fs = require("fs");

const getPdfData = (filePath) => {
  return new Promise((res) => {
    const data = [];
    new PdfReader().parseFileItems(filePath, (err, item) => {
      if (err) console.error("error:", err);
      else if (!item) res(data);
      else if (item.text) data.push(item.text);
    });
  });
};

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
    overs: +lines[i + 1].match(/\((.*)\)/)[1],
  };
}

function getBatting(lines, i) {
  const batting = [];

  for (let hasBatsman = true; hasBatsman; ) {
    //log oif something wrong
    if (!lines[i]) {
      console.error("something wrong!!! check temp.json");
      fs.writeFileSync("temp.json", JSON.stringify(lines, null, 4), {
        encoding: "utf8",
      });
      console.error("Stopping parsing");

      process.exit();
    }

    const batsman = { name: lines[i] };

    batsman.outReason = lines[i + 1];
    let rare = false;

    //rare care of new page between reason on player
    if (Number.isInteger(parseInt(lines[i + 1]))) {
      console.log("rare case");
      rare = true;
      batsman.outReason = lines[i + 6];
      i = i - 1;
    }

    batsman.runs = +lines[i + 2];
    batsman.balls = +lines[i + 3];
    batsman.fours = +lines[i + 4];
    batsman.sixes = +lines[i + 5];
    batsman.runRate = +lines[i + 6];

    batsman.notOut = batsman.outReason === "not out";
    //rare care of new page between reason on player
    if (rare) {
      i = i + 1;
    }

    i = i + 7;

    batting.push(batsman);
    if (lines[i] === "Extras") {
      hasBatsman = false;
    }
  }
  return [batting, i];
}

function getFallWickets(lines, i) {
  i = i + 3;
  const fallOfWickets = [];

  while(lines[i+1] && !isSecondTeamStartScore(lines[i+1])){
    fallOfWickets.push({name: lines[i], score: lines[i + 1], over: lines[i + 2]});
    i = i + 3;
  }

  return fallOfWickets;
}

function getBowling(lines, i) {
  const bowling = [];
  let fallOfWickets = [];

  for (let hasBowler = true; hasBowler; ) {
    //to ignore line if pdf has 3 pages
    if (lines[i].match("ER") || lines[i].match("W")) {
      i = i + 1;
      if (lines[i] === "Extras") {
        hasBowler = false;
        break;
      }
    }

    if (!lines[i]) global.exit();
    const bowler = { name: lines[i] };
    bowler.overs = +lines[i + 1];
    bowler.maidens = +lines[i + 2];
    bowler.runs = +lines[i + 3];
    bowler.wickets = +lines[i + 4];
    bowler.economy = +lines[i + 5];

    i = i + 6;

    bowling.push(bowler);
    if (lines[i] === "Fall of wickets") {
      hasBowler = false;
      fallOfWickets = getFallWickets(lines, i)
    }
  }
  return [bowling, i, fallOfWickets];
}

function getExtrasGot(lines, i) {
  return +lines[i + 1].match(/\((.*)\)/)[1];
}

function getBattingRunRate(lines, i) {
  return +lines[i + 3].split(" ")[2];
}

function isSecondTeamStartScore(line) {
  return line.match(/.*-.* \(.*\)/);
}

function findNextTeamStart(lines, i) {
  while (lines[i]) {
    // matches `85-9 (14.0)`
    if (isSecondTeamStartScore(lines[i])) {
      return i - 1;
    }
    i += 1;
  }
}

function getTeamScores(lines) {
  let i = 2;
  let team1 = {};
  let team2 = {};
  team1.name = lines[i];
  team1.score = getScore(lines, i);
  i += 8;

  [team1.batting, i] = getBatting(lines, i);
  team1.extrasGot = getExtrasGot(lines, i);
  team1.battingRunRate = getBattingRunRate(lines, i);
  team2.extrasBowled = team1.extrasGot;
  team2.extrasBowledText = lines[i + 1];

  i += 10;

  [team2.bowling, i, team2.fallOfWickets] = getBowling(lines, i);

  i = findNextTeamStart(lines, i);

  if (i === undefined) {
    //match discontinued after one innings
    team2.batting = [];
    team2.extrasGot = 0;
    team2.battingRunRate = 0;
    team1.extrasBowled = 0;
    team1.extrasBowledText = "";
    team1.bowling = [];
    team1.fallOfWickets = [];
    team2.name = "";
    team2.score = { wickets: 0, runs: 0, overs: 0 };
    return [team1, team2];
  }

  team2.name = lines[i];
  team2.score = getScore(lines, i);

  i += 8;
  [team2.batting, i] = getBatting(lines, i);
  team2.extrasGot = getExtrasGot(lines, i);
  team2.battingRunRate = getBattingRunRate(lines, i);
  team1.extrasBowled = team1.extrasGot;
  team1.extrasBowledText = lines[i + 1];

  i += 10;

  [team1.bowling, _i, team1.fallOfWickets] = getBowling(lines, i);
  return [team1, team2];
}

function removeNoise(lines) {
  return lines.filter(
    (line) =>
      !(
        line.match("1 / 2") ||
        line.match("2 / 2") ||
        line.match("1 / 2") ||
        line.match("2 / 3") ||
        line.match("1 / 3") ||
        line.match("1 / 4") ||
        line.match("2 / 4") ||
        line.match("3 / 4") ||
        line.match("4 / 4")
      )
  );
}

const parseMatchPDF = async (filePath) => {
  console.log("parsing " + filePath);
  const data = {};
  let lines = await getPdfData(filePath);
  lines = removeNoise(lines);

  [data.team1Name, data.team2Name] = getTeamNames(lines);
  [data.team1, data.team2] = getTeamScores(lines);
  data.result = getResult(lines);
  data.winner = lines[1].split(" ")[0];

  if (data.team2.batting.length === 0) {
    //match discontinued after one innings

    data.winner = "Discontinued";
    data.team2.name = data.team2Name;
  }

  data.matchUploadedDate = new Date();

  return data;
};

module.exports = parseMatchPDF;
