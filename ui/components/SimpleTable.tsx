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
import { TablePosCell, TablePosHeader } from "./HighestScore";

export function SimpleTable(props: {
  rows: any[];
  columns: any[];
  headerFontSize?: number | string;
  rowP?: number;
  rowFontSize?: number;
  textAlign?: ResponsiveValue<TextAlign>;
  transpose?: boolean;
  colorAllHeaders?: boolean;
  showNumbering?: boolean;
}) {
  return (
    <TableContainer px={[3, 0]}>
      <Table variant="simple">
        <Thead>
          <Tr>
            {props.showNumbering && <TablePosHeader />}
            {!props.transpose &&
              props.columns.map((c, k) => (
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
            {props.transpose && getTransposedHeader(props)}
          </Tr>
        </Thead>
        <Tbody>
          {!props.transpose &&
            props.rows.map((r, k) => (
              <Tr key={k}>
                {props.showNumbering && <TablePosCell k={k} />}

                {props.columns.map((c, k) => (
                  <Td
                    px={[1, 5]}
                    width={c.width}
                    key={k}
                    py={props.rowP || 1}
                    fontSize={props.rowFontSize || "sm"}
                    textAlign={props.textAlign || "center"}
                  >
                    {r[c.field]}
                  </Td>
                ))}
              </Tr>
            ))}
          {props.transpose &&
            props.columns.slice(1).map((c, k) => getTransposedRow(k, c, props))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

function getTransposedRow(
  k: number,
  c,
  props: {
    rows: any[];
    rowP?: number;
    textAlign?: ResponsiveValue<Property.TextAlign>;
    colorAllHeaders?: boolean;
    rowFontSize?: number;
  }
) {
  return (
    <Tr key={k}>
      <Td
        px={[1, 5]}
        width={c.width}
        key={0}
        color={props.colorAllHeaders ? "brand.900" : "inherit"}
        py={props.rowP || 1}
        fontSize={"sm"}
        textAlign={props.textAlign || "center"}
      >
        {c.headerName}
      </Td>
      {props.rows.map((r, i) => (
        <Td
          px={[1, 5]}
          width={r.width}
          key={i + 1}
          py={props.rowP || 1}
          textAlign={props.textAlign || "center"}
          fontSize={props.rowFontSize || "sm"}
        >
          {r[c.field]}
        </Td>
      ))}
    </Tr>
  );
}

function getTransposedHeader(props: {
  rows: any[];
  columns: any[];
  headerFontSize?: number | string;
  rowP?: number;
  textAlign?: ResponsiveValue<Property.TextAlign>;
  transpose?: boolean;
  colorAllHeaders?: boolean;
}) {
  return (
    <>
      <Th
        px={[1, 5]}
        fontSize={props.headerFontSize || 12}
        textAlign={props.textAlign || "center"}
      >
        {props.columns[0].headerName}
      </Th>
      {props.rows.map((r, k) => (
        <Th
          px={[1, 5]}
          key={k}
          fontSize={props.headerFontSize || 12}
          textAlign={props.textAlign || "center"}
        >
          {r[props.columns[0].field]}
        </Th>
      ))}
    </>
  );
}
