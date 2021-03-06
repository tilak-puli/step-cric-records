import { useMemo } from "react";
import _ from "underscore";
import { capitalize } from "../utils/utils";
import { BattingStats } from "../types/stats";
import { TableWithSorting } from "./TableWithSorting";

const columns = [
  {
    accessor: "name",
    Header: "Name",
    width: 50,
    disableSortBy: true,
    sortDescFirst: true,
  },
  { accessor: "matches", Header: "M", width: 10, disableSortBy: true },
  { accessor: "runs", Header: "Runs", width: 10, sortType: "number", px: [3] },
  { accessor: "sr", Header: "SR", width: 10, sortType: "number", px: [3] },
  { accessor: "avg", Header: "Avg", width: 10, sortType: "number", px: [3] },
];

function getAvg(runs, matches, notOuts) {
  let avg = runs / (matches - notOuts);

  if (matches === notOuts) {
    avg = runs;
  }

  return avg.toFixed(2);
}

export function MostRunsTable(props: { battingStats: BattingStats }) {
  const data = useMemo(() => {
    const sortedStats = _.map(props.battingStats, (b, name) => [
      capitalize(name),
      b.runs,
      b.balls,
      b.matches,
      b.notOuts,
    ]).sort((s, s1) => s1[1] - s[1]);

    return sortedStats
      .map(([name, runs, balls, matches, notOuts]) => ({
        name,
        sr: ((runs / balls) * 100).toFixed(0),
        runs,
        matches,
        avg: getAvg(runs, matches, notOuts),
      }))
      .filter(({ runs }) => runs !== 0)
      .slice(0, 50);
  }, [props.battingStats]);

  return <TableWithSorting data={data} columns={columns} />;
}
