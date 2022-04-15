import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useMemo } from "react";
import _ from "underscore";
import { capitalize } from "../utils";
import { BattingStats } from "../types/stats";

const columns = [
  { field: "name", headerName: "Name", width: 50 },
  { field: "highestScore", headerName: "Score", width: 20 },
  { field: "highestScoreInBalls", headerName: "Balls", width: 20 },
];

export function HighestScoreTable(props: { battingStats: BattingStats }) {
  const rows = useMemo(() => {
    const allFigures = _.map(props.battingStats, (stat, name) =>
      stat.battingFigures.map((f) => ({ name: name, figure: f }))
    );

    const sortedStats = _.map(_.flatten(allFigures), ({ figure, name }) => [
      capitalize(name),
      figure.runs,
      figure.balls,
    ]).sort((s, s1) => {
      let diff = s1[1] - s[1];

      if (diff === 0) {
        diff = s[2] - s1[2];
      }

      return diff;
    });

    return sortedStats
      .map(([name, highestScore, highestScoreInBalls]) => ({
        name,
        highestScore,
        highestScoreInBalls,
      }))
      .filter(({ highestScore }) => highestScore !== 0);
  }, [props.battingStats]);

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
