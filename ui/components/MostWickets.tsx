import { useMemo } from "react";
import _ from "underscore";
import { capitalize } from "../utils/utils";
import { BowlingStats } from "../types/stats";
import { TableWithSorting } from "./TableWithSorting";
import { numberOfBalls } from "../state/stats";

const columns = [
  { accessor: "name", Header: "Name", width: 50, disableSortBy: true },
  { accessor: "overs", Header: "O", width: 10, sortType: "number" },
  {
    accessor: "wickets",
    Header: "W",
    width: 10,
    sortType: "number",
  },
  { accessor: "economy", Header: "ER", width: 10, sortType: "number" },
];

export function getBowlingAverage(bowlingFigures) {
  if (!bowlingFigures) return;

  let wickets = 0;
  let runs = 0;

  for (let figure of bowlingFigures) {
    wickets += +figure.wickets;
    runs += +figure.wicketsWithRuns;
  }
  return runs / (wickets || 1);
}

export function getEconomy(bowlingFigures = []) {
  if (!bowlingFigures) return;

  let balls = 0;
  let runs = 0;

  for (let figure of bowlingFigures) {
    balls += numberOfBalls(figure.wicketsInOvers);
    runs += +figure.wicketsWithRuns;
  }

  return (6 * (runs / balls)).toFixed(2);
}

export function roundOver(over) {
  return over % 1 > 0.3 ? Math.ceil(over) : Math.floor(over);
}

export function MostWicketsTable(props: { bowlingStats: BowlingStats }) {
  const rows = useMemo(() => {
    const sortedStats = _.map(props.bowlingStats, (b, name) => [
      capitalize(name),
      b.wickets,
      parseFloat((+b.overs).toFixed(1)),
      getEconomy(b.bowlingFigures),
    ]).sort((s, s1) => {
      let diff = s1[1] - s[1];
      if (diff === 0) {
        diff = s[2] - s1[2];
      }
      return diff;
    });

    return sortedStats
      .map(([name, wickets, overs, economy]) => ({
        name,
        wickets,
        overs,
        economy,
      }))
      .filter(({ wickets }) => wickets !== 0)
      .slice(0, 50);
  }, [props.bowlingStats]);

  return <TableWithSorting data={rows} columns={columns} />;
}
