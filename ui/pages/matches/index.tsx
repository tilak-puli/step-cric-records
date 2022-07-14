import { useContext } from "react";
import { GlobalContext } from "../../state/GlobalContext";
import { Box, Heading, Stack, Wrap } from "@chakra-ui/react";
import { Filters, MatchCard } from "../../components";
import { getFilteredMatches } from "../../state/stats";
import { tagToImages } from "../../data/images";
import { ImagesList } from "../images";
import { getPointsTable } from "../../utils/utils";
import extraTagsData from "../../data/extraTagsData.json";
import { CustomBox } from "../../components/HigherOrder/CustomBox";
import { Match } from "../../types/match";
import {
  getTopPerformers,
  PointsTable,
  TeamTable,
  TopPerformersCards,
} from "../../utils/matchesUtils";

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
  let performers = { topBatsman: [], topBowlers: [], topPartnerships: [] };
  const isTournament = extraTagsData.tournamentTags.includes(tags[0]);

  if (tags.length === 1) {
    if (isTournament) {
      pointsTable = getPointsTable(
        filteredMatches,
        extraTagsData.tournaments[tags[0]]
      );
    }
    performers = getTopPerformers(filteredMatches);
  }

  return (
    <Stack spacing={12} p={["1em", "2em"]}>
      <Box>
        <Filters />
      </Box>
      <Wrap w={"99%"} spacing={10}>
        <MatchesList matches={filteredMatches} />
      </Wrap>

      {isTournament && (
        <Box>
          <Heading mb={6} size={"md"}>
            Points Table
          </Heading>
          <CustomBox maxW={"100%"} width={["100%", 1000]}>
            <PointsTable table={pointsTable} />
          </CustomBox>
        </Box>
      )}

      {tags.length >= 1 && (
        <Box>
          <Heading mb={6} size={"md"}>
            Top Performers
          </Heading>
          <TopPerformersCards performers={performers} />
        </Box>
      )}

      {isTournament && (
        <Box>
          <Heading mb={6} size={"md"}>
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
          <Heading mb={6} size={"md"}>
            Images
          </Heading>
          <ImagesList images={images} />
        </Box>
      )}
    </Stack>
  );
};

function MatchesList(props: { matches: Match[] }) {
  return (
    <>
      {props.matches
        .map((m, i) => (
          <Box w={["100%", 400]} key={i}>
            <MatchCard match={m} />
          </Box>
        ))
        .reverse()}
    </>
  );
}

export default Matches;
