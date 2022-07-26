const fs = require("fs");

const readJSONFile = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, "UTF-8"));
};

function getTeamNames(appData) {
  return [appData.team1.name, appData.team2.name];
}

function getScore(team) {
  return {
    runs: +team.runs,
    wickets: +team.wickets,
    overs: +("" + team.over.over + "." + team.over.balls),
  };
}

function getBatting(players) {
  const batting = [];

  for (let player of players) {
    if (player.batting.balls === 0) {
      continue;
    }
    const batsman = { name: player.name };

    batsman.outReason = !player.batting.isOut
      ? "not out"
      : player.batting.wicketMessage;
    batsman.runs = player.batting.runs;
    batsman.balls = player.batting.balls;
    batsman.fours = player.batting.fours;
    batsman.sixes = player.batting.sixers;
    batsman.runRate = player.batting.strikeRate;

    batsman.notOut = player.batting.isOut;
    batting.push(batsman);
  }

  return batting;
}

function getFallWickets(fallOfWickets) {
  const fallOfWicketsRecords = [];

  for (let fow of fallOfWickets) {
    fallOfWicketsRecords.push({
      name: fow.name,
      score: fow.runs + "/" + fow.wickets,
      over: "" + fow.over,
    });
  }

  return fallOfWicketsRecords;
}

function getBowling(players) {
  const bowlingRecords = [];

  for (let player of players) {
    const bowler = { name: player.name };
    const bowling = player.bowling;
    bowler.overs = +(bowling.over.over + "." + bowling.over.balls);
    bowler.maidens = bowling.maidens;
    bowler.runs = bowling.runs;
    bowler.wickets = bowling.wickets;
    bowler.economy = +bowling.economyRate;

    bowlingRecords.push(bowler);
  }

  return bowlingRecords;
}

function getExtras(team) {
  return team.extras.wide + team.extras.noBall + team.extras.byes;
}

function getTeamScores(appData) {
  let team1 = {};
  let team2 = {};
  team1.name = appData.team1.name;
  team1.score = getScore(appData.team1);

  team1.batting = getBatting(appData.team1.players);
  team1.extrasGot = getExtras(appData.team2);
  team1.battingRunRate = +appData.team1.runRate;
  team1.extrasBowled = getExtras(appData.team1);
  team1.extrasBowledText = JSON.stringify(appData.team1.extras);

  team1.bowling = getBowling(appData.team1.players);
  team1.fallOfWickets = getFallWickets(appData.team1.fallOfWickets);

  team2.name = appData.team2.name;
  team2.score = getScore(appData.team2);

  team2.batting = getBatting(appData.team2.players);
  team2.extrasGot = getExtras(appData.team1);
  team2.battingRunRate = +appData.team2.runRate;
  team2.extrasBowled = getExtras(appData.team2);
  team2.extrasBowledText = JSON.stringify(appData.team2.extras);

  team2.bowling = getBowling(appData.team2.players);
  team2.fallOfWickets = getFallWickets(appData.team2.fallOfWickets);

  return [team1, team2];
}

const parseMatchJSON = async (filePath) => {
  console.log("parsing " + filePath);
  const data = {};
  let appData = await readJSONFile(filePath);
  [data.team1Name, data.team2Name] = getTeamNames(appData);
  [data.team1, data.team2] = getTeamScores(appData);

  data.result = appData.matchOverMessage;
  data.winner = appData.matchWonBy;

  data.matchUploadedDate = new Date();

  return data;
};

module.exports = parseMatchJSON;
