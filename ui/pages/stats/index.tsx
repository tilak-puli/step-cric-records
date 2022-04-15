import { Box, Heading, Wrap } from "@chakra-ui/react";
import NavBar from "../../components/Navbar";
import { useContext, useMemo } from "react";
import { GlobalContext } from "../../state/GlobalContext";
import { Match } from "../../types/match";
import { MostRunsTable } from "../../components/MostRuns";
import { CustomBox } from "../../components/HigherOrder/CustomBox";
import swapNames from "../../data/swapNames.json";
import { MostWicketsTable } from "../../components/MostWickets";
import { BattingStats, BowlingStats } from "../../types/stats";
import { HighestScoreTable } from "../../components/HighestScore";
import { BestBowlingFigureTable } from "../../components/BestBowlingFigure";

function getIndexName(name, date) {
  return swapNames[name.toLowerCase()] &&
    new Date(date) < new Date(swapNames[name.toLowerCase()].beforeDate)
    ? swapNames[name.toLowerCase()]?.name?.toLowerCase()
    : name.toLowerCase();
}

function getStats(matches: Match[]) {
  const batting: BattingStats = {};
  const bowling: BowlingStats = {};

  const addBattingRecords = (date, { runs, name, balls }) => {
    const indexName = getIndexName(name, date);

    if (!batting[indexName]) {
      batting[indexName] = {
        runs: 0,
        highestScore: 0,
        matches: 0,
        highestScoreInBalls: 0,
      };
    }
    batting[indexName].runs += runs;
    batting[indexName].matches += 1;

    if (runs > batting[indexName].highestScore) {
      batting[indexName].highestScore = runs;
      batting[indexName].highestScoreInBalls = balls;
    }
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

const Stats = () => {
  const { matches } = useContext(GlobalContext);
  const stats = useMemo(() => getStats(matches), matches);

  return (
    <Box>
      <NavBar />
      <Wrap p={"2vw"} w={"100%"} spacing={10}>
        <CustomBox>
          <Heading p={2} fontSize={"md"}>
            Top Run Scorers
          </Heading>
          <Box width={400} height={450} overflow={"auto"}>
            <MostRunsTable battingStats={stats.batting} />
          </Box>
        </CustomBox>
        <CustomBox>
          <Heading p={2} fontSize={"md"}>
            Highest Score
          </Heading>
          <Box width={400} height={450} overflow={"auto"}>
            <HighestScoreTable battingStats={stats.batting} />
          </Box>
        </CustomBox>
        <CustomBox>
          <Heading p={2} fontSize={"md"}>
            Top Wicket Takers
          </Heading>
          <Box width={400} height={450} overflow={"auto"}>
            <MostWicketsTable bowlingStats={stats.bowling} />
          </Box>
        </CustomBox>
        <CustomBox>
          <Heading p={2} fontSize={"md"}>
            Best Bowling Figure
          </Heading>
          <Box width={400} height={450} overflow={"auto"}>
            <BestBowlingFigureTable bowlingStats={stats.bowling} />
          </Box>
        </CustomBox>
      </Wrap>
    </Box>
  );
};

export default Stats;
