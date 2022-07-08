import { Match } from "../types/match";
import { Flex } from "@chakra-ui/react";
import _ from "underscore";
import { MatchCard } from "./MatchCard";

export function Matches(props: { data: Match[] }) {
  return (
    <Flex
      maxHeight={["calc(90vh - 170px)", "550"]}
      direction={"column"}
      overflow={"auto"}
      p={"1em"}
      gap={5}
    >
      {_.map(props.data, (match: Match, i) => {
        return <MatchCard key={i} id={i + 1} match={match} />;
      })?.reverse()}
    </Flex>
  );
}
