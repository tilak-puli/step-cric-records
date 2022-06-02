import { Box, Heading, Wrap, Flex } from "@chakra-ui/react";
import { useContext } from "react";
import { GlobalContext, START_YEAR } from "../../state/GlobalContext";
import { MostRunsTable } from "../../components";
import { CustomBox } from "../../components/HigherOrder/CustomBox";
import { MostWicketsTable } from "../../components";
import { HighestScoreTable } from "../../components";
import { BestBowlingFigureTable } from "../../components";
import { Select } from "@chakra-ui/react";
import _ from "underscore";
import { Partnership } from "../../types/stats";
import { sortPartnerships } from "../matches/[matchId]/GetTopPartnerships";
import { SimpleTable } from "../../components/SimpleTable";
import { capitalize } from "../../utils";
import Link from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";

function BestPartnerships(props: { partnerships: Partnership[] }) {
  const partnerships = sortPartnerships(props.partnerships, 50).map((p) => ({
    ...p,
    batsman1: capitalize(p.batsman1),
    batsman2: capitalize(p.batsman2),
    scoreLink: (
      <Link href={"/matches/" + (p.matchIndex + 1)} passHref>
        <ChakraLink className={"underline"}>
          <>{p.runs + "(" + p.balls + ")"}</>
        </ChakraLink>
      </Link>
    ),
  }));

  const columns = [
    { field: "batsman1", headerName: "BatsPerson 1", width: 40 },
    { field: "scoreLink", headerName: "Runs", width: 40 },
    { field: "batsman2", headerName: "BatsPerson 2", width: 40 },
  ];

  return <SimpleTable columns={columns} rows={partnerships} />;
}

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
          {_.times(new Date().getFullYear() - START_YEAR + 1, (n) => (
            <option key={n} value={n + START_YEAR}>
              {n + START_YEAR}
            </option>
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
        <CustomBox width={["100%", 400]}>
          <Heading p={2} fontSize={"md"}>
            Top Partnerships
          </Heading>
          <Box height={450} overflow={"auto"}>
            <BestPartnerships partnerships={stats.partnerships} />
          </Box>
        </CustomBox>
      </Wrap>
    </Box>
  );
};

export default Stats;
