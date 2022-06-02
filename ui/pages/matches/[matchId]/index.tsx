import {Box, Flex, Heading, ListItem, Text, UnorderedList, Wrap} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext, useMemo } from "react";
import { GlobalContext } from "../../../state/GlobalContext";
import { MatchCard } from "../../../components";
import { CustomBox } from "../../../components/HigherOrder/CustomBox";
import {
  Match,
  MvpDetails,
  SpecialMvpDetails,
  TeamData,
} from "../../../types/match";
import { BattingTable } from "../../../components";
import { BowlingTable } from "../../../components";
import { capitalize, findMvp } from "../../../utils";

function TeamScoreBoard(props: {
  name: String;
  team1: TeamData;
  team2: TeamData;
  date: string;
}) {
  return (
    <CustomBox width={["100%", 1000]}>
      <Heading p={3} fontSize="l" color="white" bg="brand.900">
        {props.name}
      </Heading>
      <BattingTable team={props.team1} date={props.date} />
      <BowlingTable team={props.team2} date={props.date} />
    </CustomBox>
  );
}

function MVPCard(props: { mvp: MvpDetails }) {
  return (
    <CustomBox p={3} width={["100%", 220]} height={130}>
      <Heading mb={3} fontSize={"sm"}>
        MVP
      </Heading>
      <Box>
        <Text fontWeight={"bold"}>{capitalize(props.mvp?.name)}</Text>
      </Box>
      <Text fontSize={"sm"}>{props.mvp?.text}</Text>
    </CustomBox>
  );
}

function SpecialMVPCard(props: { mvp: SpecialMvpDetails }) {
  return (
    <CustomBox p={3} width={["100%", 220]} height={130}>
      <Heading mb={3} fontSize={"sm"}>
        Special MVP
      </Heading>
      <Box>
        <Text fontWeight={"bold"}>{capitalize(props.mvp?.name)}</Text>
      </Box>
      <Text fontSize={"sm"}>{props.mvp?.reason}</Text>
    </CustomBox>
  );
}

function SpecialMentionsCard(props: { specialMentions: String[] }) {
  return (
    <CustomBox p={3} mb={[5, 10]} width={["100%", 1000]} minHeight={100}>
      <Heading mb={3} fontSize={"sm"}>
        Special Mentions
      </Heading>
      <UnorderedList>
          {props.specialMentions?.map(mention => <ListItem><Text>{mention}</Text></ListItem>)}
      </UnorderedList>
    </CustomBox>
  );
}

const Matches = () => {
  const router = useRouter();
  const { matchId } = router.query;
  const { matches } = useContext(GlobalContext);
  const match = matches[+matchId - 1] as Match;

  const mvp = useMemo(() => findMvp(match), [match]);

  return (
    <Box>
      <Box p={["1em", "2em"]}>
        {!match && (
          <Box width={["100%", 500]}>{<Text>Match not found.</Text>}</Box>
        )}
        {match && (
          <Flex direction={"column"}>
            <Wrap spacing={[5, 10]} pb={[5, 10]}>
              <Box width={["100%", 480]}>
                {
                  <MatchCard
                    id={+matchId}
                    p={"1em"}
                    boxShadow={"sm"}
                    match={match}
                    disableLink={true}
                  />
                }
              </Box>
              <MVPCard mvp={mvp} />
              {match.extraData?.specialMvp && (
                <SpecialMVPCard mvp={match.extraData?.specialMvp} />
              )}
            </Wrap>
              {match.extraData?.specialMentions && (
                  <SpecialMentionsCard specialMentions={match.extraData?.specialMentions} />
              )}
            <Flex direction={"column"} gap={[10]} width={"100%"}>
              <TeamScoreBoard
                name={match.team1.name}
                team1={match.team1}
                team2={match.team2}
                date={match.matchFileNameDate}
              />
              <TeamScoreBoard
                name={match.team2.name}
                team2={match.team1}
                team1={match.team2}
                date={match.matchFileNameDate}
              />
            </Flex>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Matches;
