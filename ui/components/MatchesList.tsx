import { Match, Score } from "../types/match";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/Link";
import { CustomBox } from "./HigherOrder/CustomBox";
import _ from "underscore";

function ScoreRow(props: { name: String; score: Score }) {
  return (
    <Flex align={"center"} justify={"space-between"}>
      <Text fontWeight={"bold"}>{props.name}</Text>
      <Flex align={"center"} gap={1}>
        <Text fontSize="xs">({props.score.overs})</Text>
        <Text fontWeight={"semibold"}>
          {props.score.runs}/{props.score.wickets}
        </Text>
      </Flex>
    </Flex>
  );
}

export function MatchCard(props: {
  match: Match;
  id: number;
  p?: string;
  boxShadow?: string;
  disableLink?: boolean;
}) {
  return (
    <CustomBox
      p={props.p || "0.5em"}
      mb={5}
      width="100%"
      height={120}
      boxShadow={props.boxShadow || "md"}
    >
      <Link href={"/matches/" + props.id}>
        <Flex direction={"column"} gap={2}>
          <Text fontSize="xs">{props.match.matchFileNameDate}</Text>
          <Flex direction={"column"}>
            <ScoreRow
              name={props.match.team2Name}
              score={props.match.team2.score}
            />
            <ScoreRow
              name={props.match.team1Name}
              score={props.match.team1.score}
            />
            <Text fontSize="sm">{props.match.result}</Text>
          </Flex>
        </Flex>
      </Link>
    </CustomBox>
  );
}

export function Matches(props: { data: Match[] }) {
  return (
    <Box maxHeight="500" overflow={"auto"} p={"1em"}>
      {_.map(props.data, (match: Match, i) => {
        return <MatchCard id={i + 1} match={match} />;
      })}
    </Box>
  );
}
