import { Match, Score } from "../types/match";
import Link from "next/link";
import { CustomBox } from "./HigherOrder/CustomBox";
import { Flex, Text } from "@chakra-ui/react";
import { formatDate } from "../utils";

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
    <Link href={"/matches/" + props.id} passHref>
      <CustomBox
        p={props.p || "0.5em"}
        width="100%"
        height={130}
        boxShadow={props.boxShadow || "md"}
        cursor={!props.disableLink && "pointer"}
      >
        <Flex direction={"column"} gap={2}>
          <Text fontSize="xs">
            {formatDate(new Date(props.match.matchFileNameDate))}
          </Text>
          <Flex direction={"column"}>
            <ScoreRow
              name={props.match.team1.name}
              score={props.match.team1.score}
            />
            <ScoreRow
              name={props.match.team2.name}
              score={props.match.team2.score}
            />
            <Text fontSize="sm">{props.match.result}</Text>
          </Flex>
        </Flex>
      </CustomBox>
    </Link>
  );
}