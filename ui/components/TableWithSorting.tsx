import { Flex, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useTable, useSortBy } from "react-table";

export const TableWithSorting = ({ columns, data }) => {
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
                px={column.px}
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
                  px={cell.column.px}
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
};
