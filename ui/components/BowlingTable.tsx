import { TeamData } from "../types/match";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useMemo } from "react";

const columns = [
  { field: "name", headerName: "Bowling", width: 40 },
  { field: "overs", headerName: "O", width: 10 },
  { field: "maidens", headerName: "M", width: 10 },
  {
    field: "runs",
    headerName: "R",
    width: 10,
  },
  {
    field: "wickets",
    headerName: "W",
    width: 10,
  },
  {
    field: "economy",
    headerName: "ER",
    width: 20,
  },
];

export function BowlingTable(props: { team: TeamData }) {
  const rows = useMemo(() => {
    return props.team.bowling.map((b, i) => ({
      id: i,
      name: b.name,
      runs: b.runs,
      wickets: <Text fontWeight="bold">{b.wickets}</Text>,
      maidens: b.maidens,
      overs: b.overs,
      economy: <Text>{b.economy?.toFixed(2)}</Text>,
    }));
  }, [props.team.bowling]);

  return (
    <TableContainer px={[3, 0]}>
      <Table variant="simple">
        <Thead>
          <Tr>
            {columns.map((c, k) => (
              <Th px={[1, 5]} key={k} width={c.width}>
                {c.headerName}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((r, k) => (
            <Tr key={k}>
              {columns.map((c, k) => (
                <Td px={[1, 5]} width={c.width} key={k} py={1} fontSize={"sm"}>
                  {r[c.field]}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
