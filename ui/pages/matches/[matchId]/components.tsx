import {Match, MvpDetails, SpecialMvpDetails, TeamData} from "../../../types/match";
import {CustomBox} from "../../../components/HigherOrder/CustomBox";
import {Box, Flex, Heading, ListItem, Text, UnorderedList} from "@chakra-ui/react";
import {capitalize} from "../../../utils/utils";
import summaries from "../../../data/aiSummaries.json";
import {BattingTable, BowlingTable, FallOfWicketsTable} from "../../../components";

export function TeamScoreBoard(props: {
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
      <BowlingTable team={props.team2} date={props.date}/>
      <Text bg={"gray.50"} px={5} py={3} fontWeight={"bolder"}>
        Fall of Wickets
      </Text>
      <FallOfWicketsTable team={props.team2} date={props.date}/>
    </CustomBox>
  );
}

export function MVPCard(props: { mvp: MvpDetails }) {
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

export function SpecialMVPCard(props: { mvp: SpecialMvpDetails }) {
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

export function SpecialMentionsCard(props: { specialMentions: String[] }) {
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

export const calcRunsChartData = (match: Match) => {
  if (!match) {
    return [];
  }

  const startingData = [{team1Runs: 0, over: 0, team2Runs: 0}];

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

export function AISummary(props: { match: Match }) {
  return <CustomBox p={["1em", "2em"]} maxWidth={["100%", "30em"]}>
    <Flex pb={[2, 5]}>
      <Heading fontSize={"md"}>Summary from &nbsp;</Heading>
      <img style={{height: "20px"}}
           src={"https://www.gstatic.com/lamda/images/sparkle_resting_v2_darkmode_2bdb7df2724e450073ede.gif"} alt={"bard icon"}/>
      <Heading fontSize={"md"}>Bard AI(Experimental)</Heading></Flex>
    <pre style={{textWrap: "balance"}}>{summaries[props.match.matchFileNameDate]?.summary?.trim()}</pre>
  </CustomBox>
    ;
}
