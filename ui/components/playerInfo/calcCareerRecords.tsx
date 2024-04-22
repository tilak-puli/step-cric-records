import {
  getAvg,
  getBowlingAverage,
  getEconomy,
  getSR,
  sortByHighestScore,
  sortByRuns,
  sortByWickets,
  sortedBowlingFigures,
  validAvg,
  validEconomy,
} from "../index";
import Link from "next/link";
import { Link as ChakraLink } from "@chakra-ui/layout";
import { BattingFigure, BattingStats, BowlingStats, OutCause } from "../../types/stats";
import _ from "lodash";
import { getIndexName } from "../../utils/utils";

const causesRegex = [
  { regex: /^b (.*?)$/, cause: "Bowled" },
  { regex: /^c .* b (.*?)$/, cause: "Caught" },
  { regex: /.*Run out \((.*?)\)/i, cause: "Run Out" },
  { regex: /.*Run out\((.*?)\)/i, cause: "Run Out" },
  { regex: /^st .* b (.*?)$/i, cause: "Stump Out" },
  { regex: /^lbw b (.*?)$/, cause: "Hit Outside" },
  { regex: /.*Six b (.*?)$/i, cause: "Hit Outside" },
  { regex: /.*Outside b (.*?)$/i, cause: "Hit Outside" },
  { regex: /.*Wall b (.*?)$/i, cause: "Hit Outside" },
  { regex: /.*Wicket.*/i, cause: "Hit Wicket" },
];

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
    runs: stat.runs,
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
    wickets: b.wickets,
    matches: b.matches,
    economy: +getEconomy(b.bowlingFigures),
  })).sort((s, s1) => {
    let diff = s.economy - s1.economy;
    if (diff === 0) {
      diff = s1.matches - s.matches;
    }

    return diff;
  });
}

export function sortBySR(battingStats: BattingStats) {
  const avgs = _.map(battingStats, (stat, name) => ({
    name: name,
    sr: +getSR(stat.runs, stat.balls),
    matches: stat.matches,
    runs: stat.runs,
  }));

  return avgs.sort((s, s1) => {
    let diff = s1.sr - s.sr;

    if (diff === 0) {
      diff = s.matches - s1.matches;
    }

    return diff;
  });
}

function convertToOutCause(outReason, date) {
  const matchedRegex = causesRegex.find(c => c.regex.test(outReason));

  outReason !== "not out" && !matchedRegex && console.log("Failed to find regex for " + outReason);
  const player = matchedRegex?.regex && outReason.match(matchedRegex?.regex)?.[1]

  matchedRegex?.regex && !player && console.log("Failed to find player regex for " + outReason);
  
  return {
    cause: matchedRegex?.cause,
    player: matchedRegex?.cause === 'Hit Wicket' ? 'self' : player ? getIndexName(player, date) : "None"
  } 
}

function getOutCauses(recentFigures: BattingFigure[]) {
  if(!recentFigures) {return []}

  const outCauses = recentFigures?.map(f => convertToOutCause(f.outReason, f.date)).filter(c => c.cause);

  return outCauses;
}


export function getOutCausesCount(causes: OutCause[]) {
  const outCauses = causes?.map(f => f.cause);

  return  _.countBy(outCauses);
}


export function getOutCausePlayerCount(causes: OutCause[]) {
  const outCauses = causes?.map(f => f.player);

  return  _.countBy(outCauses);
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

  const avgRank =
    sortByAvg(battingRecords)
      .filter(validAvg)
      .findIndex(({ name }) => name === playerName) + 1;

  const srRank =
    sortBySR(battingRecords)
      .filter(validAvg)
      .findIndex(({ name }) => name === playerName) + 1;

  const outCauses = getOutCauses(battingRecords[playerName]?.battingFigures);

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
    "50s": batting.noOf50s,
    "30s": batting.noOf30s,
    "20s": batting.noOf20s,
    ducks: batting.noOfDucks,
    outCauses: outCauses || []
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

  const economyRanking =
    sortByEconomy(bowlingRecords)
      .filter(validEconomy)
      .findIndex(({ name }) => name === playerName) + 1;

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
    maidens: bowling.noOfMaidens,
    noOf3Wickets: bowling.noOf3Wickets,
    noOf2Wickets: bowling.noOf2Wickets,
  };
}
