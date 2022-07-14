import { useContext } from "react";
import { GlobalContext } from "../../state/GlobalContext";
import { Box, Heading, Wrap } from "@chakra-ui/react";
import { Filters, MatchCard } from "../../components";
import { getFilteredMatches } from "../../state/stats";
import { tagToImages } from "../../data/images/images";
import { ImagesList } from "../images";
import { getPointsTable } from "../../utils";
import extraTagsData from "../../data/extraTagsData.json";
import { SimpleTable } from "../../components/SimpleTable";
import { CustomBox } from "../../components/HigherOrder/CustomBox";

function getNRR(team: any) {
  return (
    6 *
    (team.runsScored / team.ballsPlayed - team.runsGiven / team.ballsBowled)
  ).toPrecision(3);
}

function PointsTable(props: { table: {} }) {
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

  return <SimpleTable columns={columns} rows={rows} rowP={3} />;
}

function TeamTable(props: { team: any }) {
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

const Matches = () => {
  const {
    matches,
    filters: {
      fromYear: { value: fromYear },
      tags: { value: tags },
    },
  } = useContext(GlobalContext);

  const filteredMatches = getFilteredMatches(matches, fromYear, tags);
  const images = tags.flatMap((t) => tagToImages[t] || []);
  let pointsTable = {};

  if (tags.length === 1 && extraTagsData.tournamentTags.includes(tags[0])) {
    pointsTable = getPointsTable(
      filteredMatches,
      extraTagsData.tournaments[tags[0]]
    );
  }

  return (
    <Box p={["1em", "2em"]}>
      <Box>
        <Filters />
      </Box>
      <Wrap w={"99%"} spacing={10}>
        {filteredMatches
          .map((m, i) => (
            <Box w={["100%", 400]} key={i}>
              <MatchCard match={m} />
            </Box>
          ))
          .reverse()}
      </Wrap>

      {pointsTable && (
        <Box>
          <Heading my={"2em"} size={"md"}>
            Points Table
          </Heading>
          <CustomBox maxW={"100%"} width={["100%", 1000]}>
            <PointsTable table={pointsTable} />
          </CustomBox>
        </Box>
      )}

      {pointsTable && (
        <Box>
          <Heading my={"2em"} size={"md"}>
            Teams
          </Heading>
          <Wrap spacing={[5, 10]}>
            {extraTagsData.tournaments[tags[0]]?.teams?.map((team, i) => (
              <CustomBox maxW={"100%"} width={["100%", 200]} key={i}>
                <TeamTable team={team} />
              </CustomBox>
            ))}
          </Wrap>
        </Box>
      )}

      {images.length > 0 && (
        <Box>
          <Heading my={"2em"} size={"md"}>
            Images
          </Heading>
          <ImagesList images={images} />
        </Box>
      )}
    </Box>
  );
};

export default Matches;
