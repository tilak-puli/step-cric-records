import { Flex, Heading, Wrap } from "@chakra-ui/react";
import { CustomBox } from "../components/HigherOrder/CustomBox";
import { useContext } from "react";
import { GlobalContext } from "../state/GlobalContext";
import { Matches } from "../components";

function Home() {
  const {
    matches,
    stats: { total },
  } = useContext(GlobalContext);

  return (
    <Flex p={["1em", "2em"]} gap={10} wrap={"wrap"} direction={"row"}>
      <CustomBox width={["100%", 400]}>
        <Heading p={"1em"} size={"l"}>
          Recent Matches
        </Heading>
        <Matches data={matches} />
      </CustomBox>
      <Wrap p={["1em", "2em"]} spacing={10} flex={1}>
        <CustomBox width={["100%", 200]} height={150}>
          <Heading p={"1em"} size={"l"}>
            Matches Played
          </Heading>
          <Flex align="center" justify="center">
            <Heading size={"4xl"} color="black" fontFamily={"Square Peg"}>
              {matches.length}
            </Heading>
          </Flex>
        </CustomBox>
        <CustomBox width={["100%", 200]} height={150}>
          <Heading p={"1em"} size={"l"}>
            Runs Scored
          </Heading>
          <Flex align="center" justify="center">
            <Heading size={"4xl"} color="black" fontFamily={"Square Peg"}>
              {total.runsScored}
            </Heading>
          </Flex>
        </CustomBox>
        <CustomBox width={["100%", 200]} height={150}>
          <Heading p={"1em"} size={"l"}>
            Fours
          </Heading>
          <Flex align="center" justify="center">
            <Heading size={"4xl"} color="black" fontFamily={"Square Peg"}>
              {total.foursHit}
            </Heading>
          </Flex>
        </CustomBox>
        <CustomBox width={["100%", 200]} height={150}>
          <Heading p={"1em"} size={"l"}>
            Sixes
          </Heading>
          <Flex align="center" justify="center">
            <Heading size={"4xl"} color="black" fontFamily={"Square Peg"}>
              {total.sixesHit}
            </Heading>
          </Flex>
        </CustomBox>
        <CustomBox width={["100%", 200]} height={150}>
          <Heading p={"1em"} size={"l"}>
            highest Team Score
          </Heading>
          <Flex align="center" justify="center">
            <Heading size={"4xl"} color="black" fontFamily={"Square Peg"}>
              {total.highestMatchScore}
            </Heading>
          </Flex>
        </CustomBox>
      </Wrap>
    </Flex>
  );
}

export default Home;
