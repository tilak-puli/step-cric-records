import { Box, Heading, Wrap, Flex } from "@chakra-ui/react";
import { useContext } from "react";
import { GlobalContext, StartYear } from "../../state/GlobalContext";
import { MostRunsTable } from "../../components";
import { CustomBox } from "../../components/HigherOrder/CustomBox";
import { MostWicketsTable } from "../../components";
import { HighestScoreTable } from "../../components";
import { BestBowlingFigureTable } from "../../components";
import { Select } from "@chakra-ui/react";
import _ from "underscore";

const Stats = () => {
  const { stats } = useContext(GlobalContext);

  return (
    <Box p={["1em", "2em"]}>
      <Flex align="center" gap="1" mb={4}>
        <Heading size="sm">From Year: </Heading>
        <Select
          value={stats.fromYear}
          onChange={(e) => stats.setFromYear(e.target.value)}
          width={100}
          size="md"
          bg={"white"}
        >
          {_.times(new Date().getFullYear() - StartYear + 1, (n) => (
            <option value={n + StartYear}>{n + StartYear}</option>
          ))}
        </Select>
      </Flex>
      <Wrap w={"99%"} spacing={10}>
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
    </Box>
  );
};

export default Stats;
