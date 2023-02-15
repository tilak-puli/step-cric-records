import {
  getAvg,
  getBowlingAverage,
  getEconomy,
  getSR,
  sortByHighestScore,
  sortByRuns,
  sortByWickets,
  sortedBowlingFigures,
} from "../index";
import Link from "next/link";
import { Link as ChakraLink } from "@chakra-ui/layout";
import { BattingStats, BowlingStats } from "../../types/stats";
import _ from "lodash";
import matches from "../../pages/matches";

function FigureLink({ text, matchIndex }) {
  return (
    <Link href={"/matches/" + matchIndex} passHref>
      <ChakraLink className={"underline"} isExternal>
        <>{text}</>
      </ChakraLink>
    </Link>
  );
}

function top5BattingFigures(battingFigures) {
  return battingFigures
    .sort((f1, f2) => {
      let diff = f2.runs - f1.runs;

      if (diff === 0) {
        diff = f1.balls - f2.balls;
      }

      return diff;
    })
    .map((f, i) => (
      <FigureLink
        key={i}
        text={`${f.runs}(${f.balls})${f.notOut ? "*" : ""}`}
        matchIndex={f.matchIndex}
      />
    ))
    .slice(0, 5);
}

function top5BowlingFigures(battingFigures) {
  return battingFigures
    .sort((f1, f2) => {
      let diff = f2.wickets - f1.wickets;

      if (diff === 0) {
        diff = f1.wicketsInOvers - f2.wicketsInOvers;
      }

      return diff;
    })
    .map((f, i) => (
      <FigureLink
        key={i}
        text={`${f.wickets}/${f.wicketsWithRuns}(${f.wicketsInOvers})`}
        matchIndex={f.matchIndex}
      />
    ))
    .slice(0, 5);
}

export function sortByAvg(battingStats: BattingStats) {
  const avgs = _.map(battingStats, (stat, name) => ({
    name: name,
    avg: +getAvg(stat.runs, stat.matches, stat.notOuts),
    matches: stat.matches,
  }));

  return avgs.sort((s, s1) => {
    let diff = s1.avg - s.avg;

    if (diff === 0) {
      diff = s.matches - s1.matches;
    }

    return diff;
  });
}

export function sortByEconomy(bowlingStats: BowlingStats) {
  return _.map(bowlingStats, (b, name) => ({
    name,
    matches: b.matches,
    economy: +getEconomy(b.bowlingFigures),
  })).sort((s, s1) => {
    let diff = s1.economy - s.economy;
    if (diff === 0) {
      diff = s.matches - s1.matches;
    }
    return diff;
  });
}

export function sortBySR(battingStats: BattingStats) {
  const avgs = _.map(battingStats, (stat, name) => ({
    name: name,
    sr: +getSR(stat.runs, stat.balls),
    matches: stat.matches,
  }));

  return avgs.sort((s, s1) => {
    let diff = s1.sr - s.sr;

    if (diff === 0) {
      diff = s.matches - s1.matches;
    }

    return diff;
  });
}

export function getBattingInfo(battingRecords, playerName: string) {
  const batting = battingRecords[playerName];
  if (!batting) return {};

  const runsRanking =
    sortByRuns(battingRecords).findIndex(([name]) => name === playerName) + 1;

  const highestScoreRanking =
    sortByHighestScore(battingRecords).findIndex(
      ([name]) => name === playerName
    ) + 1;

  const avgRank = sortByAvg(battingRecords)
    .filter(({ matches }) => matches >= 5)
    .findIndex(({ name }) => name === playerName);

  const srRank = sortBySR(battingRecords)
    .filter(({ matches }) => matches >= 5)
    .findIndex(({ name }) => name === playerName);

  return {
    runsScored: batting.runs,
    ballsFaced: batting.balls,
    sr: ((batting.runs / batting.balls) * 100).toFixed(0),
    avg: getAvg(batting.runs, batting.matches, batting.notOuts),
    matchesBatted: batting.matches,
    topFigures: top5BattingFigures([...batting.battingFigures]),
    recentFigures: [...batting.battingFigures].slice(-5).reverse(),
    runsRanking: runsRanking,
    highestScoreRanking: highestScoreRanking,
    avgRank: avgRank ? avgRank : null,
    srRank: srRank ? srRank : null,
  };
}

export function getBowlingInfo(bowlingRecords, playerName) {
  const bowling = bowlingRecords[playerName];
  if (!bowling) return {};

  const wicketsRank =
    sortByWickets(bowlingRecords).findIndex(([name]) => name === playerName) +
    1;

  const bowlingFigureRanking =
    sortedBowlingFigures(bowlingRecords).findIndex(
      ([name]) => name === playerName
    ) + 1;

  const economyRanking = sortByEconomy(bowlingRecords)
    .filter(({ matches }) => matches >= 5)
    .findIndex(({ name }) => name === playerName);

  return {
    wickets: bowling.wickets,
    matchesBowled: bowling.matches,
    oversBowled: bowling.overs,
    economy: getEconomy(bowling.bowlingFigures),
    average: getBowlingAverage(bowling.bowlingFigures)?.toFixed(2),
    topFigures: top5BowlingFigures([...bowling.bowlingFigures]),
    recentFigures: [...bowling.bowlingFigures].slice(-5).reverse(),
    wicketsRanking: wicketsRank,
    bowlingFigureRanking: bowlingFigureRanking,
    economyRanking: economyRanking,
  };
}
