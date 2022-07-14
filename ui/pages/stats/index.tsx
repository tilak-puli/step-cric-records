import {
  Box,
  Heading,
  Link as ChakraLink,
  Stack,
  Wrap,
} from "@chakra-ui/react";
import { useContext } from "react";
import { GlobalContext } from "../../state/GlobalContext";
import {
  BestBowlingFigureTable,
  Filters,
  HighestScoreTable,
  MostRunsTable,
  MostWicketsTable,
} from "../../components";
import { CustomBox } from "../../components/HigherOrder/CustomBox";
import { Partnership } from "../../types/stats";
import { sortPartnerships } from "../../components/GetTopPartnerships";
import { SimpleTable } from "../../components/SimpleTable";
import { capitalize } from "../../utils/utils";
import Link from "next/link";

function BestPartnerships(props: { partnerships: Partnership[] }) {
  const partnerships = sortPartnerships(props.partnerships)
    .slice(0, 50)
    .map((p) => ({
      ...p,
      batsman1: capitalize(p.batsman1),
      batsman2: capitalize(p.batsman2),
      scoreLink: (
        <Link href={"/matches/" + p.matchIndex} passHref>
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
    <Stack spacing={12} p={["1em", "2em"]}>
      <Filters />
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
    </Stack>
  );
};

export default Stats;
