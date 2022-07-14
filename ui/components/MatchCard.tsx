import { Match, Score } from "../types/match";
import Link from "next/link";
import { CustomBox } from "./HigherOrder/CustomBox";
import { Flex, Text, Wrap } from "@chakra-ui/react";
import { formatDate } from "../utils";

export function ScoreRow(props: { name: String; score: Score }) {
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

function Tag(props: { t: String }) {
  return (
    <Text
      bg={"brand.500"}
      color={"white"}
      fontSize={12}
      py={1}
      px={2}
      borderRadius={2}
    >
      {props.t}
    </Text>
  );
}

export function MatchCard(props: {
  match: Match;
  p?: string;
  boxShadow?: string;
  disableLink?: boolean;
}) {
  const tags = props.match.extraData?.tags || [];

  return (
    <Link href={"/matches/" + props.match.matchIndex} passHref>
      <CustomBox
        p={props.p || "0.5em"}
        width="100%"
        height={"auto"}
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
            <Wrap mt={2}>
              {tags?.map((t, i) => (
                <Tag t={t} key={i} />
              ))}
            </Wrap>
          </Flex>
        </Flex>
      </CustomBox>
    </Link>
  );
}
