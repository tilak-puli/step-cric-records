import {Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";

export function SimpleTable(props: { rows: any[], columns: any[] }) {
    return <TableContainer px={[3, 0]}>
        <Table variant="simple">
            <Thead>
                <Tr>
                    {props.columns.map((c, k) => (
                        <Th px={[1, 5]} key={k} width={c.width}>
                            {c.headerName}
                        </Th>
                    ))}
                </Tr>
            </Thead>
            <Tbody>
                {props.rows.map((r, k) => (
                    <Tr key={k}>
                        {props.columns.map((c, k) => (
                            <Td px={[1, 5]} width={c.width} key={k} py={1} fontSize={"sm"}>
                                {r[c.field]}
                            </Td>
                        ))}
                    </Tr>
                ))}
            </Tbody>
        </Table>
    </TableContainer>;
}
