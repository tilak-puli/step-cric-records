import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useMemo } from "react";
import _ from "underscore";
import { capitalize } from "../utils";
import { BowlingStats } from "../types/stats";

const columns = [
  { field: "name", headerName: "Name", width: 50 },
  { field: "matches", headerName: "M", width: 10 },
  { field: "wickets", headerName: "W", width: 10 },
  { field: "economy", headerName: "ER", width: 10 },
];

function getEconomy(bowlingFigures) {
  let overs = 0;
  let runs = 0;

  for (let figure of bowlingFigures) {
    overs +=
      figure.wicketsInOvers % 1 > 0.3
        ? Math.ceil(figure.wicketsInOvers)
        : Math.floor(figure.wicketsInOvers);
    runs += +figure.wicketsWithRuns;
  }

  return (runs / overs).toFixed(2);
}

export function MostWicketsTable(props: { bowlingStats: BowlingStats }) {
  const rows = useMemo(() => {
    const sortedStats = _.map(props.bowlingStats, (b, name) => [
      capitalize(name),
      b.wickets,
      b.matches,
      getEconomy(b.bowlingFigures),
    ]).sort((s, s1) => {
      let diff = s1[1] - s[1];
      if (diff === 0) {
        diff = s[2] - s1[2];
      }
      return diff;
    });

    return sortedStats
      .map(([name, wickets, matches, economy]) => ({
        name,
        wickets,
        matches,
        economy,
      }))
      .filter(({ wickets }) => wickets !== 0)
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
