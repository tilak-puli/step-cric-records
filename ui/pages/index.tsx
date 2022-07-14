import { Flex, Heading, Wrap } from "@chakra-ui/react";
import { CustomBox } from "../components/HigherOrder/CustomBox";
import { useContext, useEffect } from "react";
import { GlobalContext, START_YEAR } from "../state/GlobalContext";
import { RecentMatchesList } from "../components";

function StatBox(props: { name: string; value: number }) {
  return (
    <CustomBox width={["100%", 200]} height={150}>
      <Heading p={"1em"} size={"l"}>
        {props.name}
      </Heading>
      <Flex align="center" justify="center">
        <Heading size={"4xl"} color="black" fontFamily={"Fredericka the Great"}>
          {props.value}
        </Heading>
      </Flex>
    </CustomBox>
  );
}

function Home() {
  const {
    matches,
    stats: { total, setFromYear },
  } = useContext(GlobalContext);

  useEffect(() => {
    setFromYear(START_YEAR);
  }, []);

  return (
    <Flex p={["1em", "2em"]} gap={10} wrap={"wrap"} direction={"row"}>
      <CustomBox width={["100%", 400]}>
        <Heading p={"1em"} size={"l"}>
          Recent Matches
        </Heading>
        <RecentMatchesList data={matches} />
      </CustomBox>
      <Wrap p={["1em", "2em"]} spacing={10} flex={1}>
        <StatBox name={"Matches Played"} value={matches.length} />
        <StatBox name={"Runs Scored"} value={total.runsScored} />
        <StatBox name={"Highest Team Score"} value={total.highestMatchScore} />
        <StatBox name={"Fours"} value={total.foursHit} />
        <StatBox name={"Sixes"} value={total.sixesHit} />
        <StatBox name={"Wickets"} value={total.wicketsTaken} />
      </Wrap>
    </Flex>
  );
}

export default Home;
