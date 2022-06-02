import { Match } from "../types/match";
import { BattingStats, BowlingStats, Partnership } from "../types/stats";
import { getIndexName } from "../utils";

function findBallBetween(lastWicketOver: string, over) {
  const overs = over.split(".")[0] - +lastWicketOver.split(".")[0];

  return overs * 6 + (over.split(".")[1] - +lastWicketOver.split(".")[1]);
}

export default function getStats(matches: Match[], fromYear: number) {
  const batting: BattingStats = {};
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
        battingFigures: [],
        matches: 0,
        notOuts: 0,
      };
    }

    batting[indexName].runs += runs;
    batting[indexName].matches += 1;
    batting[indexName].notOuts += notOut ? 1 : 0;

    batting[indexName].battingFigures.push({ runs, balls, matchIndex });
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
        bowlingFigures: [],
      };
    }
    bowling[indexName].wickets += wickets;
    bowling[indexName].matches += 1;

    bowling[indexName].bowlingFigures.push({
      wickets,
      wicketsWithRuns: runs,
      wicketsInOvers: overs,
      matchIndex,
    });
  };

  matches
    .map((match, index) => ({ match, index }))
    .filter(
      ({ match }) => new Date(match.matchFileNameDate).getFullYear() >= fromYear
    )
    .forEach(({ match, index }) => {
      if (highestMatchScore < match.team1.score.runs) {
        highestMatchScore = match.team1.score.runs;
      }
      if (highestMatchScore < match.team2.score.runs) {
        highestMatchScore = match.team2.score.runs;
      }

      match.team1.batting.forEach(
        addBattingRecords.bind(null, match.matchFileNameDate, index)
      );
      match.team2.batting.forEach(
        addBattingRecords.bind(null, match.matchFileNameDate, index)
      );
      match.team1.bowling.forEach(
        addBowlingRecords.bind(null, match.matchFileNameDate, index)
      );
      match.team2.bowling.forEach(
        addBowlingRecords.bind(null, match.matchFileNameDate, index)
      );

      const team1Partnerships: Partnership[] = getPartnerships(
        match.matchFileNameDate,
        index,
        match.team2.fallOfWickets,
        match.team1.batting
      );

      const team2Partnerships: Partnership[] = getPartnerships(
        match.matchFileNameDate,
        index,
        match.team1.fallOfWickets,
        match.team2.batting
      );

      partnerships.push(...team2Partnerships, ...team1Partnerships);
    });

  return {
    batting,
    bowling,
    partnerships,
    fromYear,
    total: { runsScored, wicketsTaken, foursHit, sixesHit, highestMatchScore },
  };
}

export const getPartnerships = (
  date,
  matchIndex,
  fallOfWickets,
  batting
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
    const batsman1 = getIndexName(batting[batsman1Index]?.name || "self", date);
    const batsman2 = getIndexName(batting[batsman2Index]?.name || "self", date);

    partnerships.push({
      runs: partnershipRuns,
      batsman1,
      batsman2,
      balls: findBallBetween(lastWicketOver, wicket.over),
      matchIndex,
    });

    if (batting[batsman1Index]?.name === wicket.name) {
      batsman1Index = nextBatsmanIndex;
    } else if (batting[batsman2Index]?.name === wicket.name) {
      batsman2Index = nextBatsmanIndex;
    }

    nextBatsmanIndex++;
    runsAtPreviousWicket = +runsAtWicket;
    lastWicketOver = wicket.over;
  });

  return partnerships;
};
