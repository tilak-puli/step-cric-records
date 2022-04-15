import { Batting, TeamData } from "../types/match";
import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useMemo } from "react";

const columns = [
  { field: "name", headerName: "Batting", width: 250 },
  { field: "runs", headerName: "R", width: 10 },
  { field: "balls", headerName: "B", width: 10 },
  {
    field: "fours",
    headerName: "4s",
    width: 10,
  },
  {
    field: "sixes",
    headerName: "6s",
    width: 10,
  },
  {
    field: "rr",
    headerName: "Run Rate",
    width: 20,
  },
];

export function BattingTable(props: { team: TeamData }) {
  const rows = useMemo(() => {
    return props.team.batting.map((b, i) => ({
      id: i,
      name: (
        <Flex
          justify={"space-between"}
          direction={{ base: "column", md: "row" }}
        >
          <Text fontWeight={"bold"}>{b.name}</Text>
          <Text>{b.outReason}</Text>
        </Flex>
      ),
      runs: b.runs,
      balls: b.balls,
      fours: b.fours,
      sixes: b.sixes,
      rr: b.runRate,
    }));
  }, [props.team.batting]);

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            {columns.map((c, k) => (
              <Th key={k} width={c.width}>
                {c.headerName}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((r) => (
            <Tr key={r.id}>
              {columns.map((c, k) => (
                <Td key={k} py={1} fontSize={"sm"}>
                  {r[c.field]}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
        <Tfoot bg={"gray.50"}>
          <Tr>
            <Td py={1} fontSize={"md"}>
              <Text>Extras</Text>
            </Td>
            <Td py={1} fontWeight={"bolder"} colSpan={5}>
              {props.team.extrasGot}
            </Td>
          </Tr>
          <Tr>
            <Td fontSize={"lg"}>
              <Flex justify={"space-between"}>
                <Text fontWeight={"bolder"}>Total</Text>
                <Flex>
                  <Text fontWeight={"bolder"}>{props.team.score.overs} Ov</Text>
                  <Text fontSize={"md"}>
                    (RR {props.team.battingRunRate.toFixed(2)})
                  </Text>
                </Flex>
              </Flex>
            </Td>
            <Td fontWeight={"bolder"} colSpan={5}>
              {props.team.score.runs}/{props.team.score.wickets}
            </Td>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
}
