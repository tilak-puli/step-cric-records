import {
  ResponsiveValue,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { Property } from "csstype";
import TextAlign = Property.TextAlign;

export function SimpleTable(props: {
  rows: any[];
  columns: any[];
  headerFontSize?: number | string;
  rowP?: number;
  textAlign?: ResponsiveValue<TextAlign>;
}) {
  return (
    <TableContainer px={[3, 0]}>
      <Table variant="simple">
        <Thead>
          <Tr>
            {props.columns.map((c, k) => (
              <Th
                px={[1, 5]}
                key={k}
                width={c.width}
                fontSize={props.headerFontSize || 12}
                textAlign={props.textAlign || "center"}
              >
                {c.headerName}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {props.rows.map((r, k) => (
            <Tr key={k}>
              {props.columns.map((c, k) => (
                <Td
                  px={[1, 5]}
                  width={c.width}
                  key={k}
                  py={props.rowP || 1}
                  fontSize={"sm"}
                  textAlign={props.textAlign || "center"}
                >
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
