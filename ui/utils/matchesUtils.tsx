import { Match } from "../types/match";
import {
  getBattingRecords,
  getBowlingRecords,
  sortBatsmen,
  sortBowlers,
  sortPartnerships,
  TopBatsman,
  TopBowling,
  TopPartnerships,
} from "../components/GetTopPartnerships";
import { getPartnershipsRecords } from "../state/stats";
import { useBreakpointValue, Wrap } from "@chakra-ui/react";
import { SimpleTable } from "../components/SimpleTable";
import { CustomBox } from "../components/HigherOrder/CustomBox";
import { capitalize, getIndexName } from "./utils";

export function TopPerformersCards(props: {
  performers: { topBowlers: any[]; topPartnerships: any[]; topBatsman: any[] };
}) {
  return (
    <Wrap spacing={10}>
      <CustomBox width={["100%", 300]} height={200} p={5}>
        <TopBatsman topBatsman={props.performers?.topBatsman} />
      </CustomBox>
      <CustomBox width={["100%", 300]} height={200} p={5}>
        <TopBowling topBowlers={props.performers?.topBowlers} />
      </CustomBox>
      <CustomBox width={["100%", 350]} height={200} p={5}>
        <TopPartnerships
          topPartnerships={props.performers?.topPartnerships}
          w={300}
        />
      </CustomBox>
    </Wrap>
  );
}

function getNRR(team: any) {
  return (
    6 *
    (team.runsScored / team.ballsPlayed - team.runsGiven / team.ballsBowled)
  ).toPrecision(3);
}

export function PointsTable(props: { table: {} }) {
  const transpose = useBreakpointValue({ base: true, md: false });

  const columns = [
    { field: "teamName", headerName: "Team Name", width: 40 },
    { field: "matchesPlayed", headerName: "Played", width: 10 },
    { field: "matchesWon", headerName: "Won", width: 10 },
    { field: "runsScored", headerName: "Runs Scored", width: 10 },
    { field: "ballsPlayed", headerName: "Balls Played", width: 10 },
    { field: "runsGiven", headerName: "Runs Given", width: 10 },
    { field: "ballsBowled", headerName: "Balls Bowled", width: 10 },
    { field: "nrr", headerName: "NRR", width: 10 },
  ];

  const rows = Object.keys(props.table)
    .map((teamName) => ({
      teamName,
      matchesPlayed: props.table[teamName].matchesPlayed,
      matchesWon: props.table[teamName].matchesWon,
      runsScored: props.table[teamName].runsScored,
      ballsPlayed: props.table[teamName].ballsPlayed,
      runsGiven: props.table[teamName].runsGiven,
      ballsBowled: props.table[teamName].ballsBowled,
      nrr: getNRR(props.table[teamName]),
    }))
    .sort((t1, t2) => {
      return t2.matchesWon - t1.matchesWon;
    });

  return (
    <SimpleTable columns={columns} rows={rows} rowP={3} transpose={transpose} />
  );
}

export function TeamTable(props: { team: any }) {
  const columns = [
    { field: "player", headerName: props.team.captain, width: 40 },
  ];

  const rows = props.team.players.map((player) => ({
    player,
  }));

  return (
    <SimpleTable columns={columns} rows={rows} rowP={3} headerFontSize={"sm"} />
  );
}

export function getTopPerformers(matches: Match[]) {
  let topBatsman = [];
  let topBowlers = [];
  let topPartnerships = [];

  matches.forEach((match) => {
    topBatsman = topBatsman.concat(
      [...match.team1.batting, ...match.team2.batting].map((b) =>
        getBattingRecords(match.matchFileNameDate, b)
      )
    );

    topBowlers = topBowlers.concat(
      [...match.team1.bowling, ...match.team2.bowling].map((b) =>
        getBowlingRecords(match.matchFileNameDate, b)
      )
    );

    topPartnerships = topPartnerships.concat(
      ...getPartnershipsRecords(
        match.matchFileNameDate,
        match.matchIndex,
        match.team2.fallOfWickets,
        match.team1
      ).map((p) => ({
        ...p,
        batsman1: capitalize(getIndexName(p.batsman1, match.matchFileNameDate)),
        batsman2: capitalize(getIndexName(p.batsman2, match.matchFileNameDate)),
      })),
      ...getPartnershipsRecords(
        match.matchFileNameDate,
        match.matchIndex,
        match.team1.fallOfWickets,
        match.team2
      ).map((p) => ({
        ...p,
        batsman1: capitalize(getIndexName(p.batsman1, match.matchFileNameDate)),
        batsman2: capitalize(getIndexName(p.batsman2, match.matchFileNameDate)),
      }))
    );
  });

  topBatsman = sortBatsmen(topBatsman).slice(0, 5);
  topBowlers = sortBowlers(topBowlers).slice(0, 5);
  topPartnerships = sortPartnerships(topPartnerships).slice(0, 5);

  return { topBatsman, topPartnerships, topBowlers };
}
