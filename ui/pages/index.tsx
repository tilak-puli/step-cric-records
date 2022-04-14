import NavBar from "../components/Navbar";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { CustomBox } from "../components/HigherOrder/CustomBox";
import { useContext } from "react";
import { GlobalContext } from "../state/GlobalContext";

function Home() {
  const { matches } = useContext(GlobalContext);
  console.log(matches);

  return (
    <div>
      <NavBar />
      <Flex p={"2em"}>
        <CustomBox width={400} maxWidth={"80vw"} minHeight={500}>
          <Heading size={"xl"}>Recent Matches</Heading>
          <Box />
        </CustomBox>
      </Flex>
    </div>
  );
}

export default Home;
