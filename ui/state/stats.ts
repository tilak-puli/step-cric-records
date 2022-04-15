import swapNames from "../data/swapNames.json";
import { Match } from "../types/match";
import { BattingStats, BowlingStats } from "../types/stats";

function getIndexName(name, date) {
  return swapNames[name.toLowerCase()] &&
    new Date(date) < new Date(swapNames[name.toLowerCase()].beforeDate)
    ? swapNames[name.toLowerCase()]?.name?.toLowerCase()
    : name.toLowerCase();
}

export default function getStats(matches: Match[]) {
  const batting: BattingStats = {};
  const bowling: BowlingStats = {};

  const addBattingRecords = (date, { runs, name, balls }) => {
    const indexName = getIndexName(name, date);

    if (!batting[indexName]) {
      batting[indexName] = {
        runs: 0,
        battingFigures: [],
        matches: 0,
      };
    }
    batting[indexName].runs += runs;
    batting[indexName].matches += 1;

    batting[indexName].battingFigures.push({ runs, balls });
  };

  const addBowlingRecords = (date, { wickets, name, runs, overs }) => {
    const indexName = getIndexName(name, date);

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
    });
  };

  matches.forEach((match) => {
    match.team1.batting.forEach(
      addBattingRecords.bind(null, match.matchFileNameDate)
    );
    match.team2.batting.forEach(
      addBattingRecords.bind(null, match.matchFileNameDate)
    );
    match.team1.bowling.forEach(
      addBowlingRecords.bind(null, match.matchFileNameDate)
    );
    match.team2.bowling.forEach(
      addBowlingRecords.bind(null, match.matchFileNameDate)
    );
  });

  return { batting, bowling };
}
