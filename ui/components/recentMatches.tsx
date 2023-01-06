import { BattingFigure, BowlingFigure } from "../types/stats";
import { useContext } from "react";
import { GlobalContext } from "../state/GlobalContext";
import { getIndexName } from "../utils/utils";
import Link from "next/link";
import { Link as ChakraLink } from "@chakra-ui/layout";
import { CustomBox } from "./HigherOrder/CustomBox";
import { Box, Flex, Text, Wrap } from "@chakra-ui/react";

function RecentMatchInfo(props: {
  playerName: string;
  index: string;
  figures: { batting?: BattingFigure; bowling?: BowlingFigure };
}) {
  const { matches } = useContext(GlobalContext);
  const match = matches[+props.index - 1];
  let partOfTeam1: boolean;
  let won = false;

  if (props.figures.batting) {
    partOfTeam1 = match.team1.batting.some(
      (b) => getIndexName(b.name, match.matchFileNameDate) === props.playerName
    );
  } else {
    partOfTeam1 = match.team1.bowling.some(
      (b) => getIndexName(b.name, match.matchFileNameDate) === props.playerName
    );
  }

  if (
    (match.winner === match.team1Name && partOfTeam1) ||
    (match.winner != match.team1Name && !partOfTeam1)
  ) {
    won = true;
  }

  return (
    <Link href={"/matches/" + props.index} passHref>
      <ChakraLink isExternal>
        <CustomBox
          width={110}
          height={90}
          py={5}
          borderColor={won ? "brand.wonGreen" : "brand.lostRed"}
          fontWeight={"bold"}
          boxShadow="sm"
        >
          <Flex
            direction={"column"}
            height={"100%"}
            justify={"center"}
            align={"center"}
          >
            {props.figures?.batting && (
              <Box>
                <Text>
                  {props.figures?.batting?.runs}({props.figures?.batting?.balls}
                  ){props.figures?.batting?.notOut ? "*" : ""}
                </Text>
              </Box>
            )}
            {props.figures?.bowling && (
              <Box>
                <Text>
                  {props.figures?.bowling?.wickets}/
                  {props.figures?.bowling?.wicketsWithRuns}(
                  {props.figures?.bowling?.wicketsInOvers})
                </Text>
              </Box>
            )}
          </Flex>
        </CustomBox>
      </ChakraLink>
    </Link>
  );
}

export function RecentMatches({ playerName, bowlingInfo, battingInfo }) {
  const recentFigures: {
    [matchIndex: string]: { batting?: BattingFigure; bowling?: BowlingFigure };
  } = {};

  battingInfo?.recentFigures?.forEach((f) => {
    recentFigures[f.matchIndex] = { batting: f };
  });

  bowlingInfo?.recentFigures?.forEach((f) => {
    if (recentFigures[f.matchIndex]) {
      recentFigures[f.matchIndex].bowling = f;
    } else {
      recentFigures[f.matchIndex] = { bowling: f };
    }
  });

  const recentMatchesGrouped = Object.entries(recentFigures)
    // @ts-ignore
    .sort((m1, m2) => m2[0] - m1[0])
    .slice(0, 5)
    .map((m) => ({ index: m[0], figures: m[1] }));

  return (
    <Wrap spacing={2}>
      {recentMatchesGrouped.map((m, i) => (
        <RecentMatchInfo
          key={i}
          playerName={playerName}
          index={m.index}
          figures={m.figures}
        />
      ))}
    </Wrap>
  );
}
