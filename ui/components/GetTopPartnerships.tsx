import { Match } from "../types/match";
import { Box, Flex, Heading, Table, Text } from "@chakra-ui/react";
import { capitalize, getIndexName } from "../utils";
import { getPartnerships } from "../state/stats";
import { CustomBox } from "./HigherOrder/CustomBox";
import { Partnership } from "../types/stats";

function getTopBatsman(match: Match, count: number) {
  const getBattingRecords = (b) => ({
    name: capitalize(getIndexName(b.name, match.matchFileNameDate)),
    runs: b.runs,
    balls: b.balls,
  });
  const team1Batsman = match.team1.batting.map(getBattingRecords);
  const team2Batsman = match.team2.batting.map(getBattingRecords);

  return [...team1Batsman, ...team2Batsman]
    .sort((b1, b2) => {
      let diff = b2.runs - b1.runs;

      if (diff === 0) {
        diff = b1.balls - b2.balls;
      }

      return diff;
    })
    .slice(0, count);
}

function getTopBowlers(match: Match, count: number) {
  const getBowlingRecords = (b) => ({
    name: capitalize(getIndexName(b.name, match.matchFileNameDate)),
    overs: b.overs,
    runs: b.runs,
    economy: b.economy,
    wickets: b.wickets,
  });
  const team1Bowling = match.team1.bowling.map(getBowlingRecords);
  const team2Bowling = match.team2.bowling.map(getBowlingRecords);

  return [...team1Bowling, ...team2Bowling]
    .sort((b1, b2) => {
      let diff = b2.wickets - b1.wickets;

      if (diff === 0) {
        diff = b1.economy - b2.economy;
      }

      return diff;
    })
    .slice(0, count);
}

export function sortPartnerships(partnerships: Partnership[], count: number) {
  return partnerships
    .sort((b1, b2) => {
      let diff = b2.runs - b1.runs;

      if (diff === 0) {
        diff = b1.balls - b2.balls;
      }

      return diff;
    })
    .slice(0, count);
}

export function getTopPartnerships(match: Match, count: number) {
  const team1Partnerships = getPartnerships(
    match.matchFileNameDate,
    0,
    match.team2.fallOfWickets,
    match.team1.batting
  );
  const team2Partnerships = getPartnerships(
    match.matchFileNameDate,
    0,
    match.team1.fallOfWickets,
    match.team2.batting
  );

  return sortPartnerships(
    [...team1Partnerships, ...team2Partnerships],
    count
  ).map((p) => ({
    ...p,
    batsman1: capitalize(getIndexName(p.batsman1, match.matchFileNameDate)),
    batsman2: capitalize(getIndexName(p.batsman2, match.matchFileNameDate)),
  }));
}

function TopBatsman(props: { match: Match }) {
  return (
    <Box p={2}>
      <Heading mb={3} fontSize={"sm"}>
        Batting
      </Heading>
      {getTopBatsman(props.match, 3)?.map((batsman, i) => (
        <Flex justify="space-between" key={i}>
          <Text>{batsman.name}</Text>
          <Text>
            {batsman.runs}({batsman.balls})
          </Text>
        </Flex>
      ))}
    </Box>
  );
}

function TopBowling(props: { match: Match }) {
  return (
    <Box p={2}>
      <Heading mb={3} fontSize={"sm"}>
        Bowling
      </Heading>
      {getTopBowlers(props.match, 3)?.map((bowler, i) => (
        <Flex justify="space-between" key={i}>
          <Text>{bowler.name}</Text>
          <Text>
            {bowler.wickets}/{bowler.runs}({bowler.overs})
          </Text>
        </Flex>
      ))}
    </Box>
  );
}

function TopPartnerships(props: { match: Match }) {
  return (
    <Box p={2}>
      <Heading mb={3} fontSize={"sm"}>
        Partnerships
      </Heading>
      <Table width={"100%"}>
        {getTopPartnerships(props.match, 3)?.map((batsman, i) => (
          <tr key={i}>
            <td>
              <Text>{batsman.batsman1}</Text>
            </td>
            <td>
              <Text>
                {batsman.runs}/{batsman.balls}
              </Text>
            </td>
            <td>
              <Text textAlign={"right"}>{batsman.batsman2}</Text>
            </td>
          </tr>
        ))}
      </Table>
    </Box>
  );
}

export function TopPerformers(props: { match: Match }) {
  return (
    <CustomBox width={["100%", 300]} height={450} p={5}>
      <Heading mb={3} fontSize={"m"}>
        Top Performers
      </Heading>
      <TopBatsman match={props.match} />
      <TopBowling match={props.match} />
      <TopPartnerships match={props.match} />
    </CustomBox>
  );
}
