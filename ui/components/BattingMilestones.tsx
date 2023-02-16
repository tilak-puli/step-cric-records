import { useMemo } from "react";
import _ from "underscore";
import { capitalize, getPercentage } from "../utils/utils";
import { BattingStats } from "../types/stats";
import { TableWithSorting } from "./TableWithSorting";

const columns = [
  {
    accessor: "name",
    Header: "Name",
    width: 10,
    disableSortBy: true,
    sortDescFirst: true,
  },
  { accessor: "matches", Header: "M", width: 5, disableSortBy: true, px: [2] },
  {
    accessor: "noOf50s",
    Header: "50s",
    width: 10,
    sortType: "number",
    px: [2],
  },
  {
    accessor: "noOf30s",
    Header: "30s",
    width: 10,
    sortType: "number",
    px: [2],
  },
  {
    accessor: "noOf20s",
    Header: "20s",
    width: 10,
    sortType: "number",
    px: [2],
  },
  {
    accessor: "noOfDucks",
    Header: "Ducks",
    width: 10,
    sortType: "number",
    px: [2],
  },
];

function sortByMilestones(battingStats: BattingStats) {
  return _.map(battingStats, (b, name) => ({
    name,
    matches: b.matches,
    noOf50s: b.noOf50s,
    noOf30s: b.noOf30s,
    noOf20s: b.noOf20s,
    noOfDucks: b.noOfDucks,
  })).sort((s, s1) => {
    let diff = s1.noOf50s - s.noOf50s;

    if (diff === 0) {
      diff = s1.noOf30s - s.noOf30s;
    }

    if (diff === 0) {
      diff = s1.noOf20s - s.noOf20s;
    }

    if (diff === 0) {
      diff = s1.matches - s.matches;
    }
    return diff;
  });
}

export function BattingMilestones(props: { battingStats: BattingStats }) {
  const data = useMemo(() => {
    const stats = sortByMilestones(props.battingStats);
    return stats.map(
      ({ name, matches, noOf50s, noOf30s, noOf20s, noOfDucks }) => ({
        name: capitalize(name),
        matches,
        noOf50s,
        noOf30s,
        noOf20s,
        noOfDucks,
      })
    );
  }, [props.battingStats]);

  return (
    <TableWithSorting
      data={data}
      columns={columns}
      showNumbering
      limit={50}
      textAlign={"center"}
    />
  );
}
