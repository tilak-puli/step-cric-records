import { useContext } from "react";
import { GlobalContext } from "../../state/GlobalContext";
import { Box, Wrap } from "@chakra-ui/react";
import { MatchCard } from "../../components";

const Matches = () => {
  const { matches } = useContext(GlobalContext);

  return (
    <Wrap spacing={10} m={[5, 10]}>
      {matches
        .map((m, i) => (
          <Box w={["100%", 400]} key={i}>
            <MatchCard id={i} match={m} />
          </Box>
        ))
        .reverse()}
    </Wrap>
  );
};

export default Matches;
