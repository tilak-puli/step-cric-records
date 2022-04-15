import { Flex, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useMemo } from "react";
import _ from "underscore";
import { capitalize } from "../utils";
import { BattingStats } from "../types/stats";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useTable, useSortBy } from "react-table";

const columns = [
  {
    accessor: "name",
    Header: "Name",
    width: 50,
    disableSortBy: true,
    sortDescFirst: true,
  },
  { accessor: "matches", Header: "M", width: 10, disableSortBy: true },
  { accessor: "runs", Header: "Runs", width: 20, sortType: "basic" },
  { accessor: "avg", Header: "Avg", width: 20, sortType: "basic" },
];

export function MostRunsTable(props: { battingStats: BattingStats }) {
  const data = useMemo(() => {
    const sortedStats = _.map(props.battingStats, (b, name) => [
      capitalize(name),
      b.runs,
      b.matches,
    ]).sort((s, s1) => s1[1] - s[1]);

    return sortedStats
      .map(([name, runs, matches]) => ({
        name,
        runs,
        matches,
        avg: (runs / matches).toFixed(2),
      }))
      .filter(({ runs }) => runs !== 0);
  }, [props.battingStats]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <Table variant="simple" {...getTableProps()}>
      <Thead position={"sticky"} top={0} bg={"white"}>
        {headerGroups.map((headerGroup, k) => (
          <Tr key={k} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, k) => (
              <Th
                key={k}
                {...column.getHeaderProps(column.getSortByToggleProps())}
                px={["5", "inherit"]}
              >
                <Flex direction={"row"} align="center">
                  {column.render("Header")}
                  {column.canSort &&
                    (column.isSorted ? (
                      column.isSortedDesc ? (
                        <TriangleDownIcon aria-label="sorted descending" />
                      ) : (
                        <TriangleUpIcon aria-label="sorted ascending" />
                      )
                    ) : (
                      <TriangleDownIcon aria-label="sorted descending" />
                    ))}
                </Flex>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row, k) => {
          prepareRow(row);
          return (
            <Tr key={k} {...row.getRowProps()}>
              {row.cells.map((cell, k) => (
                <Td
                  key={k}
                  py={1}
                  fontSize={"sm"}
                  {...cell.getCellProps()}
                  isNumeric={cell.column.isNumeric}
                >
                  {cell.render("Cell")}
                </Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
