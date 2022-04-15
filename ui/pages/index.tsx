import NavBar from "../components/Navbar";
import { Flex, Heading } from "@chakra-ui/react";
import { CustomBox } from "../components/HigherOrder/CustomBox";
import { useContext } from "react";
import { GlobalContext } from "../state/GlobalContext";
import { Matches } from "../components/MatchesList";

function Home() {
  const { matches } = useContext(GlobalContext);

  return (
    <div>
      <NavBar />
      <Flex p={"2em"}>
        <CustomBox width={400} maxWidth={"80vw"} minHeight={500}>
          <Heading color={"brand.900"} p={"1em"} size={"l"}>
            Recent Matches
          </Heading>
          <Matches data={matches} />
        </CustomBox>
      </Flex>
    </div>
  );
}

export default Home;
