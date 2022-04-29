import { Match } from "../types/match";
import { BattingStats, BowlingStats } from "../types/stats";
import { getIndexName } from "../utils";

export default function getStats(matches: Match[], fromYear: number) {
  const batting: BattingStats = {};
  const bowling: BowlingStats = {};
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
    });

  return {
    batting,
    bowling,
    fromYear,
    total: { runsScored, wicketsTaken, foursHit, sixesHit, highestMatchScore },
  };
}
