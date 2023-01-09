import { Match } from "../types/match";
import { Box, Flex, Link as ChakraLink, Text, Wrap } from "@chakra-ui/react";
import _ from "underscore";
import { MatchCard } from "./MatchCard";
import Link from "next/link";

export function RecentMatchesList(props: { data: Match[] }) {
  return (
    <Flex
      p={"1em"}
      direction={"column"}
      overflow={"auto"}
      gap={5}
      width={"100%"}
      maxHeight={["calc(90vh - 170px)", "fit-content"]}
    >
      <Wrap>
        {_.map(props.data.slice(-8).reverse(), (match: Match, i) => {
          return <MatchCard key={i} match={match} width={350} />;
        })}
      </Wrap>
      <Box>
        <Link href={"/matches"} passHref>
          <ChakraLink >
            <Text textAlign={"center"} fontSize={"lg"}>
              View all matches
            </Text>
          </ChakraLink>
        </Link>
      </Box>
    </Flex>
  );
}
