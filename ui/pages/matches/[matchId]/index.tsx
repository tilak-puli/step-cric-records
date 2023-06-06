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

const calcRunsChartData = (match: Match) => {
  if (!match) {
    return [];
  }

  const startingData = [{ team1Runs: 0, over: 0, team2Runs: 0 }];

  const endData: {
    over?: number;
    score?: string;
    team1Runs?: number;
    team1Score?: string;
    team2Name?: string;
    team2Score?: string;
    team2Runs?: number;
  }[] = [
    {
      team2Name: match.team2Name,
      team1Runs: match.team1.score.runs,
      over: match.team1.score.overs,
      score: match.team1.score.runs + "/" + match.team1.score.wickets,
    },
  ];

  if (match.team1.score.overs === match.team2.score.overs) {
    endData[0].team2Score =
      match.team2.score.runs + "/" + match.team2.score.wickets;
    endData[0].team2Runs = match.team2.score.runs;
  } else {
    endData.push({
      team2Name: match.team2Name,
      over: match.team2.score.overs,
      team2Score: match.team1.score.runs + "/" + match.team1.score.wickets,
      team2Runs: match.team2.score.runs,
    });
  }

  const fwDataTeam1 =
    match["team1"].fallOfWickets.map((fw) => ({
      team2Runs: +fw.score.split("/")[0],
      over: +fw.over,
      name: fw.name,
      score: fw.score,
    })) || [];

  const fwDataTeam2 =
    match["team2"].fallOfWickets.map((fw) => ({
      team1Runs: +fw.score.split("/")[0],
      over: +fw.over,
      name: fw.name,
      score: fw.score,
    })) || [];

  return [...startingData, ...fwDataTeam1, ...fwDataTeam2, ...endData];
};

const Match = () => {
  const router = useRouter();
  const { matchId } = router.query;
  const { matches } = useContext(GlobalContext);
  const [runsChartData, setRunsChartData] = useState([]);
  const match = matches[+matchId - 1] as Match;

  const mvp = useMemo(() => findMvp(match), [match]);
  useMemo(() => setRunsChartData(calcRunsChartData(match)), [match]);
  console.log(runsChartData)

  return (
    <Box>
      <Box p={["1em", "2em"]}>
        {!match && (
          <Box width={["100%", 500]}>{<Text>Match not found.</Text>}</Box>
        )}
        {match && (
          <Box>
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
            </Wrap>
            <Box mt={10}>
              <Heading mb={3} fontSize={"m"}>
                Charts
              </Heading>
              <Wrap spacing={10}>
                <LineChartBox
                  title={"Runs"}
                  xAxisKey={"over"}
                  lines={[
                    { key: "team1Runs", name: match.team1.name },
                    { key: "team2Runs", name: match.team2.name },
                  ]}
                  width={700}
                  xTicks={_.times(
                    Math.ceil(
                      match[
                        match.winner === match.team1.name ? "team1" : "team2"
                      ].score.overs
                    ),
                    (n) => n
                  )}
                  data={runsChartData}
                  lineType={"monotoneX"}
                  CustomTooltip={CustomTooltip}
                  showDot
                  yAxisMaxDataIndex={match.winner === match.team1.name ? 0 : 1}
                />
              </Wrap>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const isWicketTooltip = !!payload[0].payload.name;

    if (isWicketTooltip) {
      return (
        <CustomBox p={2}>
          <Text>Wicket: {payload[0].payload.name}</Text>
          <Text>Score: {payload[0].payload.score}</Text>
        </CustomBox>
      );
    }

    return (
      <CustomBox p={2}>
        {payload[0].payload.score && (
          <Text>
            {payload[0].name}: {payload[0].payload.score}
          </Text>
        )}
        {payload[0].payload.team2Score && (
          <Text>
            {payload[0].payload.team2Name}: {payload[0].payload.team2Score}
          </Text>
        )}
      </CustomBox>
    );
  }

  return null;
};

export default Match;
