import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Matches = () => {
  const router = useRouter();
  const { matchId } = router.query;

  return <Box>Match {matchId}</Box>;
};

export default Matches;
