import { Match } from "../types/match";
import { BattingStats, BowlingStats, Partnership } from "../types/stats";
import { getIndexName } from "../utils/utils";
import tag from "@chakra-ui/theme/src/components/tag";

function findBallBetween(lastWicketOver: string, over) {
  const overs = over.split(".")[0] - +lastWicketOver.split(".")[0];
  return overs * 6 + (over.split(".")[1] - +lastWicketOver.split(".")[1]);
}

export function numberOfBalls(over) {
  let overNumber = parseInt(over);
  let ballsNumber = +(over % 1).toPrecision(1) * 10;

  return overNumber * 6 + (ballsNumber > 6 ? 6 : ballsNumber);
}

function addOvers(over: string, over1: string) {
  let overNumber = +over.split(".")[0] + +over1.split(".")[0];
  let ballsNumber = +over.split(".")[1] + +over1.split(".")[1];

  if (ballsNumber >= 6) {
    overNumber += 1;
    ballsNumber %= 6;
  }

  return overNumber + "." + ballsNumber;
}

function addTags(playerStats: {}, indexName: string, tags: String[]) {
  tags.forEach(
    (tag) =>
      (playerStats[indexName].tags[tag] =
        playerStats[indexName].tags[tag] + 1 || 1)
  );
}

export default function getStats(
  matches: Match[],
  fromYear: number,
  tags: string[]
) {
  const batting: BattingStats = {};
  const playerStats = {};
  const bowling: BowlingStats = {};
  let partnerships: Partnership[] = [];
  let runsScored: number = 0;
  let wicketsTaken: number = 0;
  let foursHit: number = 0;
  let sixesHit: number = 0;
  let highestMatchScore: number = 0;

  const addBattingRecords = (
    date,
    matchIndex,
    { runs, name, balls, fours, sixes, notOut }
  ) => {
    const indexName = getIndexName(name, date);
    runsScored += runs;
    foursHit += fours;
    sixesHit += sixes;

    if (!batting[indexName]) {
      batting[indexName] = {
        runs: 0,
        balls: 0,
        battingFigures: [],
        matches: 0,
        notOuts: 0,
      };
    }

    batting[indexName].runs += runs;
    batting[indexName].matches += 1;
    batting[indexName].notOuts += notOut ? 1 : 0;
    batting[indexName].balls += balls;

    batting[indexName].battingFigures.push({ runs, balls, matchIndex, notOut });
  };

  const addBowlingRecords = (
    date,
    matchIndex,
    { wickets, name, runs, overs }
  ) => {
    const indexName = getIndexName(name, date);
    wicketsTaken += wickets;

    if (!bowling[indexName]) {
      bowling[indexName] = {
        wickets: 0,
        matches: 0,
        overs: "0.0",
        bowlingFigures: [],
      };
    }
    bowling[indexName].wickets += wickets;
    bowling[indexName].matches += 1;

    bowling[indexName].overs = addOvers(
      overs.toFixed(1),
      Number.parseFloat(bowling[indexName].overs).toFixed(1)
    );

    bowling[indexName].bowlingFigures.push({
      wickets,
      wicketsWithRuns: runs,
      wicketsInOvers: overs,
      matchIndex,
    });
  };

  function addMatchStats(match: Match) {
    const team1Players = new Set();
    const team2Players = new Set();

    match.team1.batting.forEach(({ name }) => {
      const indexName = getIndexName(name, match.matchFileNameDate);
      team1Players.add(indexName);
    });
    match.team1.bowling.forEach(({ name }) => {
      const indexName = getIndexName(name, match.matchFileNameDate);
      team1Players.add(indexName);
    });
    match.team2.batting.forEach(({ name }) => {
      const indexName = getIndexName(name, match.matchFileNameDate);
      team2Players.add(indexName);
    });
    match.team2.bowling.forEach(({ name }) => {
      const indexName = getIndexName(name, match.matchFileNameDate);
      team2Players.add(indexName);
    });

    const team1PlayersArr = Array.from(team1Players);
    const team2PlayersArr = Array.from(team2Players);
    const allPlayers = team2PlayersArr.concat(team1PlayersArr);

    allPlayers.forEach((name: string) => {
      const tags = match.extraData?.tags;
      const team1Won = match.winner === match.team1Name;

      if (!playerStats[name]) {
        playerStats[name] = {
          tags: {},
          tournamentTags: new Set(),
          wins: 0,
          matches: 0,
        };
      }

      if (tags) {
        addTags(playerStats, name, tags || []);
      }

      if (team1Won && team1Players.has(name)) {
        playerStats[name].wins += 1;
      } else if (!team1Won && team2Players.has(name)) {
        playerStats[name].wins += 1;
      }

      playerStats[name].matches += 1;
    });
  }

  getFilteredMatches(matches, fromYear, tags)
    .map((match, index) => ({ match, index }))
    .forEach(({ match }) => {
      if (highestMatchScore < match.team1.score.runs) {
        highestMatchScore = match.team1.score.runs;
      }
      if (highestMatchScore < match.team2.score.runs) {
        highestMatchScore = match.team2.score.runs;
      }

      match.team1.batting.forEach(
        addBattingRecords.bind(null, match.matchFileNameDate, match.matchIndex)
      );
      match.team2.batting.forEach(
        addBattingRecords.bind(null, match.matchFileNameDate, match.matchIndex)
      );
      match.team1.bowling.forEach(
        addBowlingRecords.bind(null, match.matchFileNameDate, match.matchIndex)
      );
      match.team2.bowling.forEach(
        addBowlingRecords.bind(null, match.matchFileNameDate, match.matchIndex)
      );

      addMatchStats(match);

      const team1Partnerships: Partnership[] = getPartnershipsRecords(
        match.matchFileNameDate,
        match.matchIndex,
        match.team2.fallOfWickets,
        match.team1
      );

      const team2Partnerships: Partnership[] = getPartnershipsRecords(
        match.matchFileNameDate,
        match.matchIndex,
        match.team1.fallOfWickets,
        match.team2
      );

      partnerships.push(...team2Partnerships, ...team1Partnerships);
    });

  return {
    batting,
    bowling,
    partnerships,
    fromYear,
    playerStats,
    total: { runsScored, wicketsTaken, foursHit, sixesHit, highestMatchScore },
  };
}

export const getPartnershipsRecords = (
  date,
  matchIndex,
  fallOfWickets,
  team
): Partnership[] => {
  let runsAtPreviousWicket = 0;
  const partnerships = [];
  let batsman1Index = 0;
  let batsman2Index = 1;
  let nextBatsmanIndex = 2;
  let lastWicketOver = "0.0";

  fallOfWickets.forEach((wicket) => {
    const [runsAtWicket] = wicket.score.split("/");
    const partnershipRuns = +runsAtWicket - runsAtPreviousWicket;
    const batsman1 = getIndexName(
      team.batting[batsman1Index]?.name || "self",
      date
    );
    const batsman2 = getIndexName(
      team.batting[batsman2Index]?.name || "self",
      date
    );

    partnerships.push({
      runs: partnershipRuns,
      batsman1,
      batsman2,
      balls: findBallBetween(lastWicketOver, wicket.over),
      matchIndex,
    });

    if (team.batting[batsman1Index]?.name === wicket.name) {
      batsman1Index = nextBatsmanIndex;
    } else if (team.batting[batsman2Index]?.name === wicket.name) {
      batsman2Index = nextBatsmanIndex;
    }

    nextBatsmanIndex++;
    runsAtPreviousWicket = +runsAtWicket;
    lastWicketOver = wicket.over;
  });

  const batsman1 = getIndexName(
    team.batting[batsman1Index]?.name || "self",
    date
  );
  const batsman2 = getIndexName(
    team.batting[batsman2Index]?.name || "self",
    date
  );

  partnerships.push({
    runs: team.score.runs - runsAtPreviousWicket,
    batsman1,
    batsman2,
    balls: findBallBetween(
      lastWicketOver,
      team.score.overs.toFixed(1).toString()
    ),
    matchIndex,
  });

  return partnerships;
};

export function getFilteredMatches(matches: Match[], fromYear, tags) {
  return matches.filter(
    (match) =>
      new Date(match.matchFileNameDate).getFullYear() >= fromYear &&
      (tags.length === 0 || tags.every((t) => match.extraData.tags.includes(t)))
  );
}
