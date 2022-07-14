import { useContext } from "react";
import { GlobalContext } from "../../state/GlobalContext";
import { Box, Heading, Wrap } from "@chakra-ui/react";
import { Filters, MatchCard } from "../../components";
import { getFilteredMatches } from "../../state/stats";
import { tagToImages } from "../../data/images/images";
import { ImagesList } from "../images";

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

  return (
    <Box p={["1em", "2em"]}>
      <Box>
        <Filters />
      </Box>
      <Wrap w={"99%"} spacing={10}>
        {filteredMatches
          .map((m, i) => (
            <Box w={["100%", 400]} key={i}>
              <MatchCard id={i} match={m} />
            </Box>
          ))
          .reverse()}
      </Wrap>
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
