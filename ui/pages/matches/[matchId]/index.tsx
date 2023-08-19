import {Box, Flex, Heading, Text, Wrap,} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {useContext, useMemo, useState} from "react";
import {GlobalContext} from "../../../state/GlobalContext";
import {CustomTooltip, LineChartBox, MatchCard,} from "../../../components";
import {Match, MvpDetails,} from "../../../types/match";
import {findMvp} from "../../../utils/utils";
import {getTopBatsman, getTopBowlers, getTopPartnerships, TopPerformers,} from "../../../components/GetTopPartnerships";
import _ from "lodash";
import Head from "next/head";
import summaries from "../../../data/aiSummaries.json";
import {AISummary, calcRunsChartData, MVPCard, SpecialMentionsCard, SpecialMVPCard, TeamScoreBoard} from "../../../components/MatchPageComponents";

const Match = () => {
  const router = useRouter();
  const {matchId} = router.query;
  const {matches} = useContext(GlobalContext);
  const [runsChartData, setRunsChartData] = useState([]);
  const match = matches[+matchId - 1] as Match;

  const mvp = useMemo(() => findMvp(match), [match]);
  useMemo(() => setRunsChartData(calcRunsChartData(match)), [match]);

  return (
    <Box>
      <Head>
        <meta property={"og:description"} content={"Match Score and Stats"}/>
        <title>{match?.team1?.name} vs {match?.team2?.name}</title>
      </Head>

      <Box p={["1em", "2em"]}>
        {!match && (
          <Box width={["100%", 500]}>{<Text>Match not found.</Text>}</Box>
        )}
        {match && (
          <Box>
            <Wrap spacing={[5, 10]}>
              <ScoreSection match={match} mvp={mvp}/>
              <Stats match={match}/>
            </Wrap>
            <Charts match={match} iteratee={(n) => n} data={runsChartData}/>
          </Box>
        )}
      </Box>
    </Box>
  );
};

function ScoreSection(props: { match: Match, mvp: MvpDetails }) {
  return <Flex direction={"column"}>
    <Wrap spacing={[5, 10]} pb={[5, 10]}>
      <Box width={["100%", 480]}>
        {
          <MatchCard
            p={"1em"}
            boxShadow={"sm"}
            match={props.match}
            disableLink={true}
          />
        }
      </Box>
      <MVPCard mvp={props.mvp}/>
      {props.match.extraData?.specialMvp && (
        <SpecialMVPCard mvp={props.match.extraData?.specialMvp}/>
      )}
    </Wrap>
    {props.match.extraData?.specialMentions && (
      <SpecialMentionsCard
        specialMentions={props.match.extraData?.specialMentions}
      />
    )}
    <Flex direction={"column"} gap={[10]} width={"100%"}>
      <TeamScoreBoard
        name={props.match.team1.name}
        team1={props.match.team1}
        team2={props.match.team2}
        date={props.match.matchFileNameDate}
      />
      <TeamScoreBoard
        name={props.match.team2.name}
        team2={props.match.team1}
        team1={props.match.team2}
        date={props.match.matchFileNameDate}
      />
    </Flex>
  </Flex>;
}

function Stats(props: { match: Match }) {
  return <Flex direction={"column"} gap={5}>
    <TopPerformers
      topBatsman={getTopBatsman(props.match, 3)}
      topBowlers={getTopBowlers(props.match, 3)}
      topPartnerships={getTopPartnerships(props.match, 3)}
    />
    {summaries[props.match.matchFileNameDate] &&
      <AISummary match={props.match}/>}
  </Flex>;
}

function Charts(props: { match: Match, iteratee: (n) => number, data: any[] }) {
  return <Box mt={10}>
    <Heading mb={3} fontSize={"m"}>
      Charts
    </Heading>
    <Wrap spacing={10}>
      <LineChartBox
        title={"Runs"}
        xAxisKey={"over"}
        lines={[
          {key: "team1Runs", name: props.match.team1.name},
          {key: "team2Runs", name: props.match.team2.name},
        ]}
        width={700}
        xTicks={_.times(
          Math.ceil(
            props.match[
              props.match.winner === props.match.team1.name ? "team1" : "team2"
              ].score.overs
          ),
          props.iteratee
        )}
        data={props.data}
        lineType={"monotoneX"}
        CustomTooltip={CustomTooltip}
        showDot
        yAxisMaxDataIndex={props.match.winner === props.match.team1.name ? 0 : 1}
      />
    </Wrap>
  </Box>;
}

export default Match;
