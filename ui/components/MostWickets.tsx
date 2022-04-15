import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useMemo } from "react";
import _ from "underscore";
import { capitalize } from "../utils";
import { BowlingStats } from "../types/stats";

const columns = [
  { field: "name", headerName: "Name", width: 50 },
  { field: "matches", headerName: "M", width: 10 },
  { field: "wickets", headerName: "Wickets", width: 20 },
];

export function MostWicketsTable(props: { bowlingStats: BowlingStats }) {
  const rows = useMemo(() => {
    const sortedStats = _.map(props.bowlingStats, (b, name) => [
      capitalize(name),
      b.wickets,
      b.matches,
    ]).sort((s, s1) => {
      let diff = s1[1] - s[1];
      if (diff === 0) {
        diff = s[2] - s1[2];
      }
      return diff;
    });

    return sortedStats
      .map(([name, wickets, matches]) => ({
        name,
        wickets,
        matches,
      }))
      .filter(({ wickets }) => wickets !== 0);
  }, [props.bowlingStats]);

  return (
    <Table variant="simple">
      <Thead position={"sticky"} top={0} bg={"white"}>
        <Tr>
          {columns.map((c) => (
            <Th width={c.width}>{c.headerName}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((r) => (
          <Tr>
            {columns.map((c) => (
              <Td py={1} fontSize={"sm"}>
                {r[c.field]}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
