import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { GlobalContext } from "../../../state/GlobalContext";
import NavBar from "../../../components/Navbar";
import { MatchCard } from "../../../components/MatchesList";
import { CustomBox } from "../../../components/HigherOrder/CustomBox";
import { Match, TeamData } from "../../../types/match";
import { BattingTable } from "../../../components/BattingTable";
import { BowlingTable } from "../../../components/BowlingTable";

function TeamScoreBoard(props: {
  name: String;
  team1: TeamData;
  team2: TeamData;
}) {
  return (
    <CustomBox width={1000} maxWidth={"90vw"}>
      <Heading p={3} fontSize="l">
        {props.name}
      </Heading>
      <BattingTable team={props.team1} />
      <BowlingTable team={props.team2} />
    </CustomBox>
  );
}

const Matches = () => {
  const router = useRouter();
  const { matchId } = router.query;
  const { matches } = useContext(GlobalContext);
  const match = matches[+matchId - 1] as Match;

  return (
    <Box>
      <NavBar />
      <Box p={"2vw"}>
        {!match && <Box width={500}>{<Text>Match not found.</Text>}</Box>}
        {match && (
          <Flex direction={"column"}>
            <Box width={500}>
              {
                <MatchCard
                  id={+matchId}
                  p={"1em"}
                  boxShadow={"sm"}
                  match={match}
                />
              }
            </Box>
            <Flex direction={"column"} gap={10}>
              <TeamScoreBoard
                name={match.team1Name}
                team1={match.team1}
                team2={match.team2}
              />
              <TeamScoreBoard
                name={match.team2Name}
                team2={match.team1}
                team1={match.team2}
              />
            </Flex>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Matches;
