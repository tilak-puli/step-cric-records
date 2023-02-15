import {
  Box,
  Flex,
  Heading,
  ListItem,
  Text,
  UnorderedList,
  Wrap,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext, useMemo, useState } from "react";
import { GlobalContext } from "../../../state/GlobalContext";
import {
  BattingTable,
  BowlingTable,
  FallOfWicketsTable,
  LineChartBox,
  MatchCard,
} from "../../../components";
import { CustomBox } from "../../../components/HigherOrder/CustomBox";
import {
  Match,
  MvpDetails,
  SpecialMvpDetails,
  TeamData,
} from "../../../types/match";
import { capitalize, findMvp } from "../../../utils/utils";
import {
  getTopBatsman,
  getTopBowlers,
  getTopPartnerships,
  TopPerformers,
} from "../../../components/GetTopPartnerships";
import _ from "lodash";
import Image from "next/image";

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
      <BattingTable
        team={props.team1}
        extrasBowledText={props.team2.extrasBowledText}
        date={props.date}
      />
      <BowlingTable team={props.team2} date={props.date} />
      <Text bg={"gray.50"} px={5} py={3} fontWeight={"bolder"}>
        Fall of Wickets
      </Text>
      <FallOfWicketsTable team={props.team2} date={props.date} />
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
    <CustomBox
      p={3}
      width={["100%", 220]}
      minHeight={130}
      height={"max-content"}
    >
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
        {props.specialMentions?.map((mention, i) => (
          <ListItem key={i}>
            <Text>{mention}</Text>
          </ListItem>
        ))}
      </UnorderedList>
    </CustomBox>
  );
}

const calcChatData = (match: Match, teamName: "team1" | "team2") => {
  if (!match) {
    return [];
  }

  const startingData = [{ runs: 0, over: 0 }];
  const endingData = [
    { runs: match[teamName].score.runs, over: match[teamName].score.overs },
  ];
  const fwData =
    match[teamName === "team2" ? "team1" : "team2"].fallOfWickets.map((fw) => ({
      runs: +fw.score.split("/")[0],
      over: +fw.over,
      name: fw.name,
      score: fw.score,
    })) || [];

  return [...startingData, ...fwData, ...endingData];
};

const Match = () => {
  const router = useRouter();
  const { matchId } = router.query;
  const { matches } = useContext(GlobalContext);
  const [team1ChartData, setTeam1ChartData] = useState([]);
  const [team2ChartData, setTeam2ChartData] = useState([]);
  const match = matches[+matchId - 1] as Match;

  const mvp = useMemo(() => findMvp(match), [match]);
  useMemo(() => setTeam1ChartData(calcChatData(match, "team1")), [match]);
  useMemo(() => setTeam2ChartData(calcChatData(match, "team2")), [match]);
  return (
    <Box>
      <Box p={["1em", "2em"]}>
        {!match && (
          <Box width={["100%", 500]}>{<Text>Match not found.</Text>}</Box>
        )}
        {match && (
          <Wrap spacing={[5, 10]}>
            <Flex direction={"column"}>
              <Wrap spacing={[5, 10]} pb={[5, 10]}>
                <Box width={["100%", 480]}>
                  {
                    <MatchCard
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
                <SpecialMentionsCard
                  specialMentions={match.extraData?.specialMentions}
                />
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
            <TopPerformers
              topBatsman={getTopBatsman(match, 3)}
              topBowlers={getTopBowlers(match, 3)}
              topPartnerships={getTopPartnerships(match, 3)}
            />
            <LineChartBox
              title={"Runs"}
              xAxisKey={"over"}
              dataKey={"runs"}
              width={700}
              xTicks={_.times(match.team1.score.overs, (n) => n)}
              data={team1ChartData}
              lineType={"monotoneX"}
              CustomTooltip={CustomTooltip}
              showDot
            />
            <LineChartBox
              title={"Runs"}
              xAxisKey={"over"}
              dataKey={"runs"}
              width={700}
              xTicks={_.times(match.team2.score.overs, (n) => n)}
              data={team2ChartData}
              lineType={"monotoneX"}
              CustomTooltip={CustomTooltip}
              showDot
            />
          </Wrap>
        )}
      </Box>
    </Box>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <CustomBox p={2}>
        <Text>Wicket: {payload[0].payload.name}</Text>
        <Text>Score: {payload[0].payload.score}</Text>
      </CustomBox>
    );
  }

  return null;
};

export default Match;
