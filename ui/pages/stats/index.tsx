import { Box, Heading, Wrap } from "@chakra-ui/react";
import { useContext } from "react";
import { GlobalContext } from "../../state/GlobalContext";
import { MostRunsTable } from "../../components";
import { CustomBox } from "../../components/HigherOrder/CustomBox";
import { MostWicketsTable } from "../../components";
import { HighestScoreTable } from "../../components";
import { BestBowlingFigureTable } from "../../components";

const Stats = () => {
  const { stats } = useContext(GlobalContext);

  return (
    <Wrap p={["1em", "2em"]} w={"99%"} spacing={10}>
      <CustomBox width={["100%", 400]}>
        <Heading p={2} fontSize={"md"}>
          Top Run Scorers
        </Heading>
        <Box height={450} overflow={"auto"}>
          <MostRunsTable battingStats={stats.batting} />
        </Box>
      </CustomBox>
      <CustomBox width={["100%", 400]}>
        <Heading p={2} fontSize={"md"}>
          Highest Score
        </Heading>
        <Box height={450} overflow={"auto"}>
          <HighestScoreTable battingStats={stats.batting} />
        </Box>
      </CustomBox>
      <CustomBox width={["100%", 400]}>
        <Heading p={2} fontSize={"md"}>
          Top Wicket Takers
        </Heading>
        <Box height={450} overflow={"auto"}>
          <MostWicketsTable bowlingStats={stats.bowling} />
        </Box>
      </CustomBox>
      <CustomBox width={["100%", 400]}>
        <Heading p={2} fontSize={"md"}>
          Best Bowling Figure
        </Heading>
        <Box height={450} overflow={"auto"}>
          <BestBowlingFigureTable bowlingStats={stats.bowling} />
        </Box>
      </CustomBox>
    </Wrap>
  );
};

export default Stats;
