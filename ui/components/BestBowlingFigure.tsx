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
import { BowlingStats } from "../types/stats";

const columns = [
  { field: "name", headerName: "Name", width: 50 },
  { field: "figure", headerName: "Bowling", width: 30 },
  { field: "overs", headerName: "Overs", width: 10 },
];

export function BestBowlingFigureTable(props: { bowlingStats: BowlingStats }) {
  const rows = useMemo(() => {
    if (!props.bowlingStats) {
      this.props.bowlingStats = [];
    }
    const allFigures = _.map(props.bowlingStats, (stat, name) =>
      stat.bowlingFigures.map((f) => ({ name: name, figure: f }))
    );
    const sortedStats = _.map(_.flatten(allFigures), ({ figure, name }) => [
      capitalize(name),
      figure.wickets,
      figure.wicketsWithRuns,
      figure.wicketsInOvers,
      figure.matchIndex,
    ]).sort((s, s1) => {
      let diff = s1[1] - s[1];

      if (diff === 0) {
        diff = s[2] - s1[2];
      }

      if (diff === 0) {
        diff = s[3] - s1[3];
      }
      return diff;
    });

    return sortedStats
      .filter((figure) => figure[1] !== 0)
      .map(([name, wickets, wicketsWithRuns, overs, matchIndex]) => ({
        name,
        figure: (
          <Link href={"/matches/" + matchIndex} passHref>
            <ChakraLink className={"underline"}>
              <>{wickets + "/" + wicketsWithRuns}</>
            </ChakraLink>
          </Link>
        ),
        overs,
      }))
      .slice(0, 50);
  }, [props.bowlingStats]);

  return (
    <Table variant="simple">
      <Thead position={"sticky"} top={0} bg={"white"}>
        <Tr>
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
