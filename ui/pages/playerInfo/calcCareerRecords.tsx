import { getAvg, getBowlingAverage, getEconomy } from "../../components";
import Link from "next/link";
import { Link as ChakraLink } from "@chakra-ui/layout";

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

export function getBattingInfo(batting) {
  if (!batting) return {};

  return {
    runsScored: batting.runs,
    ballsFaced: batting.balls,
    sr: ((batting.runs / batting.balls) * 100).toFixed(0),
    avg: getAvg(batting.runs, batting.matches, batting.notOuts),
    matchesBatted: batting.matches,
    topFigures: top5BattingFigures([...batting.battingFigures]),
    recentFigures: [...batting.battingFigures].slice(-5).reverse(),
  };
}

export function getBowlingInfo(bowling) {
  if (!bowling) return {};

  return {
    wickets: bowling.wickets,
    matchesBowled: bowling.matches,
    oversBowled: bowling.overs,
    economy: getEconomy(bowling.bowlingFigures),
    average: getBowlingAverage(bowling.bowlingFigures),
    topFigures: top5BowlingFigures([...bowling.bowlingFigures]),
    recentFigures: [...bowling.bowlingFigures].slice(-5).reverse(),
  };
}
