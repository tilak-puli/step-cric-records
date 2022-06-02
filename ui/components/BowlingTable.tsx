import { TeamData } from "../types/match";
import { Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { capitalize, getIndexName } from "../utils";
import { SimpleTable } from "./SimpleTable";

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

export function BowlingTable(props: { team: TeamData; date: string }) {
  const rows = useMemo(() => {
    return props.team.bowling.map((b, i) => ({
      id: i,
      name: capitalize(getIndexName(b.name, props.date)),
      runs: b.runs,
      wickets: <Text fontWeight="bold">{b.wickets}</Text>,
      maidens: b.maidens,
      overs: b.overs,
      economy: <Text>{b.economy?.toFixed(2)}</Text>,
    }));
  }, [props.team.bowling, props.date]);

  return <SimpleTable columns={columns} rows={rows} />;
}
