import {
  Link as ChakraLink,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import { useMemo } from "react";
import _ from "underscore";
import { capitalize } from "../utils/utils";
import { BattingStats } from "../types/stats";

const columns = [
  { field: "name", headerName: "Name", width: 50 },
  { field: "highestScore", headerName: "Score", width: 20 },
  { field: "highestScoreInBalls", headerName: "Balls", width: 20 },
];

export function TablePosCell(props: { k: any }) {
  return (
    <Td
      py={1}
      paddingRight={0}
      fontSize={"sm"}
      w={"min-content"}
      color={"grey"}
    >
      {props.k + 1}
    </Td>
  );
}

export function TablePosHeader() {
  return (
    <Th w={"2px"} paddingRight={0}>
      Pos
    </Th>
  );
}

export function sortByHighestScore(battingStats: BattingStats) {
  const allFigures = _.map(battingStats, (stat, name) =>
    stat.battingFigures.map((f) => ({ name: name, figure: f }))
  );

  return _.map(_.flatten(allFigures), ({ figure, name }) => [
    name,
    figure.runs,
    figure.balls,
    figure.matchIndex,
  ]).sort((s, s1) => {
    let diff = s1[1] - s[1];

    if (diff === 0) {
      diff = s[2] - s1[2];
    }

    return diff;
  });
}

export function HighestScoreTable(props: { battingStats: BattingStats }) {
  const rows = useMemo(() => {
    const sortedStats = sortByHighestScore(props.battingStats);

    return sortedStats
      .map(([name, highestScore, highestScoreInBalls, matchIndex]) => ({
        name: capitalize(name),
        highestScore,
        highestScoreInBalls,
        matchIndex,
      }))
      .filter(({ highestScore }) => highestScore !== 0)
      .map(({ highestScore, matchIndex, ...rest }) => ({
        ...rest,
        highestScore: (
          <Link href={"/matches/" + matchIndex} passHref>
            <ChakraLink className={"underline"}>
              <>{highestScore}</>
            </ChakraLink>
          </Link>
        ),
      }))
      .slice(0, 50);
  }, [props.battingStats]);

  return (
    <Table variant="simple">
      <Thead position={"sticky"} top={0} bg={"white"}>
        <Tr>
          {/*for numbering */}
          <TablePosHeader />
          {columns.map((c, k) => (
            <Th key={k} width={c.width}>
              {c.headerName}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((r, k) => (
          <Tr key={k}>
            <TablePosCell k={k} />
            {columns.map((c, k) => (
              <Td key={k} py={1} fontSize={"sm"}>
                {r[c.field]}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
