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

export function getAvg(runs, matches, notOuts) {
  let avg = runs / (matches - notOuts);

  if (matches === notOuts) {
    avg = runs;
  }

  return avg.toFixed(2);
}

export function getSR(runs, balls) {
  return ((runs / balls) * 100).toFixed(0);
}

export function sortByRuns(battingStats: BattingStats): any[] {
  return _.map(battingStats, (b, name) => [
    name,
    b.runs,
    b.balls,
    b.matches,
    b.notOuts,
  ]).sort((s, s1) => s1[1] - s[1]);
}

export function validAvg({ runs, matches }) {
  return runs !== 0 && (matches >= 3 || runs > 30);
}

export function MostRunsTable(props: { battingStats: BattingStats }) {
  const data = useMemo(() => {
    const sortedStats = sortByRuns(props.battingStats);

    return sortedStats
      .map(([name, runs, balls, matches, notOuts]) => ({
        name: capitalize(name),
        sr: getSR(runs, balls),
        runs,
        matches,
        avg: getAvg(runs, matches, notOuts),
      }))
      .filter(validAvg);
  }, [props.battingStats]);

  return (
    <TableWithSorting data={data} columns={columns} showNumbering limit={50} />
  );
}
