import { Flex, Heading } from "@chakra-ui/react";
import { CustomBox } from "../components/HigherOrder/CustomBox";
import { useContext } from "react";
import { GlobalContext } from "../state/GlobalContext";
import { Matches } from "../components";

function Home() {
  const { matches } = useContext(GlobalContext);

  return (
    <Flex p={["1em", "2em"]}>
      <CustomBox width={["100%", 400]} minHeight={500}>
        <Heading p={"1em"} size={"l"}>
          Recent Matches
        </Heading>
        <Matches data={matches} />
      </CustomBox>
    </Flex>
  );
}

export default Home;
