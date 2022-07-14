import { Match } from "../types/match";
import { Flex, Link as ChakraLink, Text } from "@chakra-ui/react";
import _ from "underscore";
import { MatchCard } from "./MatchCard";
import Link from "next/link";

export function RecentMatchesList(props: { data: Match[] }) {
  return (
    <Flex
      maxHeight={["calc(90vh - 170px)", "550"]}
      direction={"column"}
      overflow={"auto"}
      p={"1em"}
      gap={5}
    >
      {_.map(props.data.slice(-10).reverse(), (match: Match, i) => {
        return <MatchCard key={i} match={match} />;
      })}
      <span>
        <Link href={"/matches"} passHref>
          <ChakraLink>
            <Text textAlign={"center"} fontSize={"lg"}>
              View all matches
            </Text>
          </ChakraLink>
        </Link>
      </span>
    </Flex>
  );
}
