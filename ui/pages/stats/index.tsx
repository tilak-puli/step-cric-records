import { Box, Heading, Wrap } from "@chakra-ui/react";
import NavBar from "../../components/Navbar";
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
