import { Match } from "../types/match";
import { Box, Flex, Heading, Table, Text } from "@chakra-ui/react";
import { capitalize, getIndexName } from "../utils/utils";
import { getPartnershipsRecords } from "../state/stats";
import { CustomBox } from "./HigherOrder/CustomBox";
import { Partnership } from "../types/stats";

interface BowlingRecord {
  name: string;
  economy: any;
  overs: any;
  runs: any;
  wickets: any;
}

interface BattingRecord {
  balls: any;
  name: string;
  runs: any;
}

export function sortBatsmen(batsmen: BattingRecord[]) {
  return batsmen.sort((b1, b2) => {
    let diff = b2.runs - b1.runs;

    if (diff === 0) {
      diff = b1.balls - b2.balls;
    }

    return diff;
  });
}
export const getBattingRecords = (date, b) => ({
  name: capitalize(getIndexName(b.name, date)),
  runs: b.runs,
  balls: b.balls,
});

export function getTopBatsman(match: Match, count: number) {
  const team1Batsman: BattingRecord[] = match.team1.batting.map(
    getBattingRecords.bind(null, match.matchFileNameDate)
  );
  const team2Batsman: BattingRecord[] = match.team2.batting.map(
    getBattingRecords.bind(null, match.matchFileNameDate)
  );

  return sortBatsmen([...team1Batsman, ...team2Batsman]).slice(0, count);
}

export function sortBowlers(bowlers: BowlingRecord[]) {
  return bowlers.sort((b1, b2) => {
    let diff = b2.wickets - b1.wickets;

    if (diff === 0) {
      diff = b1.economy - b2.economy;
    }

    return diff;
  });
}

export const getBowlingRecords = (date, b): BowlingRecord => ({
  name: capitalize(getIndexName(b.name, date)),
  overs: b.overs,
  runs: b.runs,
  economy: b.economy,
  wickets: b.wickets,
});

export function getTopBowlers(match: Match, count: number) {
  const team1Bowling: BowlingRecord[] = match.team1.bowling.map(
    getBowlingRecords.bind(null, match.matchFileNameDate)
  );
  const team2Bowling: BowlingRecord[] = match.team2.bowling.map(
    getBowlingRecords.bind(null, match.matchFileNameDate)
  );

  return sortBowlers([...team1Bowling, ...team2Bowling]).slice(0, count);
}

export function sortPartnerships(partnerships: Partnership[]) {
  return partnerships.sort((b1, b2) => {
    let diff = b2.runs - b1.runs;

    if (diff === 0) {
      diff = b1.balls - b2.balls;
    }

    return diff;
  });
}

export function getTopPartnerships(match: Match, count: number) {
  const team1Partnerships = getPartnershipsRecords(
    match.matchFileNameDate,
    match.matchIndex,
    match.team2.fallOfWickets,
    match.team1
  );
  const team2Partnerships = getPartnershipsRecords(
    match.matchFileNameDate,
    match.matchIndex,
    match.team1.fallOfWickets,
    match.team2
  );

  return sortPartnerships([...team1Partnerships, ...team2Partnerships])
    .slice(0, count)
    .map((p) => ({
      ...p,
      batsman1: capitalize(getIndexName(p.batsman1, match.matchFileNameDate)),
      batsman2: capitalize(getIndexName(p.batsman2, match.matchFileNameDate)),
    }));
}

export function TopBatsman(props: { topBatsman: any }) {
  return (
    <Box w={250} p={2}>
      <Heading mb={3} fontSize={"sm"}>
        Batting
      </Heading>
      {props.topBatsman?.map((batsman, i) => (
        <Flex justify="space-between" key={i} lineHeight={1.6}>
          <Text>{batsman.name}</Text>
          <Text>
            {batsman.runs}({batsman.balls})
          </Text>
        </Flex>
      ))}
    </Box>
  );
}

export function TopBowling(props: { topBowlers: any }) {
  return (
    <Box w={250} p={2}>
      <Heading mb={3} fontSize={"sm"}>
        Bowling
      </Heading>
      {props.topBowlers?.map((bowler, i) => (
        <Flex justify="space-between" key={i} lineHeight={1.6}>
          <Text>{bowler.name}</Text>
          <Text>
            {bowler.wickets}/{bowler.runs}({bowler.overs})
          </Text>
        </Flex>
      ))}
    </Box>
  );
}

export function TopPartnerships(props: { topPartnerships: any; w?: number }) {
  return (
    <Box w={props.w || 250} p={2}>
      <Heading mb={3} fontSize={"sm"}>
        Partnerships
      </Heading>
      <Table width={"100%"}>
        {props.topPartnerships?.map((batsman, i) => (
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

export function TopPerformers(props: {
  topBatsman: any;
  topBowlers: any;
  topPartnerships: any;
  height?: number;
  width?: number;
}) {
  return (
    <CustomBox
      width={["100%", props.width || 300]}
      height={props.height || 450}
      p={5}
    >
      <Heading mb={3} fontSize={"m"}>
        Top Performers
      </Heading>

      <TopBatsman topBatsman={props.topBatsman} />
      <TopBowling topBowlers={props.topBowlers} />
      <TopPartnerships topPartnerships={props.topPartnerships} />
    </CustomBox>
  );
}
