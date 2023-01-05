import {
  Box,
  Center,
  Flex,
  Heading,
  Link as ChakraLink,
  Select,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { GlobalContext } from "../../state/GlobalContext";
import { Component, useContext, useState } from "react";
import { CustomBox } from "../../components/HigherOrder/CustomBox";
import { SimpleTable } from "../../components/SimpleTable";
import { getAvg, getBowlingAverage, getEconomy } from "../../components";
import Link from "next/link";
import { capitalize, getIndexName } from "../../utils/utils";
import { BattingFigure, BowlingFigure } from "../../types/stats";

const battingColumns = [
  { field: "b", headerName: "Batting", width: 10 },
  { field: "runsScored", headerName: "Runs Scored", width: 10 },
  { field: "ballsFaced", headerName: "Balls Faced", width: 10 },
  { field: "sr", headerName: "Strike Rate", width: 10 },
  { field: "avg", headerName: "Average", width: 10 },
  { field: "matchesBatted", headerName: "Matches Batted", width: 10 },
  { field: "topFigures", headerName: "Top Scores", width: 10 },
];

const bowlingColumns = [
  { field: "b", headerName: "Bowling", width: 10 },
  { field: "wickets", headerName: "Wickets Taken", width: 10 },
  { field: "oversBowled", headerName: "Overs Bowled", width: 10 },
  { field: "economy", headerName: "Economy", width: 10 },
  { field: "average", headerName: "Average", width: 10 },
  { field: "matchesBowled", headerName: "Matches Bowled", width: 10 },
  { field: "topFigures", headerName: "Top Scores", width: 10 },
];

class PlayerNameSelector extends Component<{
  value: string;
  onChange: (string) => void;
  playerNames: string[];
}> {
  render() {
    return (
      <Flex align="center" gap="1" marginBottom={5}>
        <Heading size="sm">Search by Name: </Heading>
        <Select
          value={this.props.value}
          onChange={(e) => this.props.onChange(e.target.value)}
          width={150}
          size="md"
          bg={"white"}
        >
          {this.props.playerNames.sort().map((playerName) => (
            <option key={playerName} value={playerName}>
              {capitalize(playerName)}
            </option>
          ))}
        </Select>
      </Flex>
    );
  }
}

function FigureLink({ text, matchIndex }) {
  return (
    <Link href={"/matches/" + matchIndex} passHref>
      <ChakraLink className={"underline"} isExternal>
        <>{text}</>
      </ChakraLink>
    </Link>
  );
}

function top5BattingFigures(battingFigures) {
  return battingFigures
    .sort((f1, f2) => {
      let diff = f2.runs - f1.runs;

      if (diff === 0) {
        diff = f1.balls - f2.balls;
      }

      return diff;
    })
    .map((f, i) => (
      <FigureLink
        key={i}
        text={`${f.runs}(${f.balls})${f.notOut ? "*" : ""}`}
        matchIndex={f.matchIndex}
      />
    ))
    .slice(0, 5);
}

function top5BowlingFigures(battingFigures) {
  return battingFigures
    .sort((f1, f2) => {
      let diff = f2.wickets - f1.wickets;

      if (diff === 0) {
        diff = f1.wicketsInOvers - f2.wicketsInOvers;
      }

      return diff;
    })
    .map((f, i) => (
      <FigureLink
        key={i}
        text={`${f.wickets}/${f.wicketsWithRuns}(${f.wicketsInOvers})`}
        matchIndex={f.matchIndex}
      />
    ))
    .slice(0, 5);
}

function getPlayerInfoRow(playerName, playerStats) {
  return {
    name: playerName,
    topTag: Object.entries(playerStats.tags).reduce((topTag, tag) =>
      tag[1] > topTag[1] ? tag : topTag
    )[0],
    matches: playerStats.matches,
    wins: playerStats.wins,
  };
}

function getBattingInfo(batting) {
  if (!batting) return {};

  return {
    runsScored: batting.runs,
    ballsFaced: batting.balls,
    sr: ((batting.runs / batting.balls) * 100).toFixed(0),
    avg: getAvg(batting.runs, batting.matches, batting.notOuts),
    matchesBatted: batting.matches,
    topFigures: top5BattingFigures([...batting.battingFigures]),
    recentFigures: [...batting.battingFigures].slice(-5).reverse(),
  };
}

function getBattingInfoRow(battingInfo) {
  const battingRow = { ...battingInfo };

  battingRow.topFigures = (
    <Box>
      {battingRow.topFigures?.reduce((prev, curr) => [prev, ", ", curr])}
    </Box>
  );

  return battingRow;
}

function getBowlingInfo(bowling) {
  if (!bowling) return {};

  return {
    wickets: bowling.wickets,
    matchesBowled: bowling.matches,
    oversBowled: bowling.overs,
    economy: getEconomy(bowling.bowlingFigures),
    average: getBowlingAverage(bowling.bowlingFigures),
    topFigures: top5BowlingFigures([...bowling.bowlingFigures]),
    recentFigures: [...bowling.bowlingFigures].slice(-5).reverse(),
  };
}

function getBowlingInfoRow(bowlingInfo) {
  const bowlingRow = { ...bowlingInfo };

  bowlingRow.topFigures = (
    <Box>
      {bowlingInfo.topFigures.reduce((prev, curr) => [prev, ", ", curr])}
    </Box>
  );

  return bowlingRow;
}

function CommonInfo({ title, value }) {
  return (
    <Wrap spacing={5}>
      <Text color={"brand.900"} width={130} fontSize={15}>
        {title}
      </Text>
      <Text>{value}</Text>
    </Wrap>
  );
}

const PlayerBasicInfo = ({ playerName, playerStats }) => {
  const info = getPlayerInfoRow(playerName, playerStats);

  return (
    <CustomBox width={350} p={3}>
      <Flex direction={"column"} paddingLeft={2}>
        <Wrap spacing={1}>
          <CommonInfo title={"Most with tag"} value={info.topTag} />
          <CommonInfo title={"Matches played"} value={info.matches} />
          <CommonInfo
            title={"Win percentage"}
            value={`${((info.wins / info.matches) * 100).toFixed(0)}%`}
          />
        </Wrap>
      </Flex>
    </CustomBox>
  );
};

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

function RecentMatches({ playerName, bowlingInfo, battingInfo }) {
  const recentFigures: {
    [matchIndex: string]: { batting?: BattingFigure; bowling?: BowlingFigure };
  } = {};

  battingInfo.recentFigures.forEach((f) => {
    recentFigures[f.matchIndex] = { batting: f };
  });

  bowlingInfo.recentFigures.forEach((f) => {
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
      {recentMatchesGrouped.map((m) => (
        <RecentMatchInfo
          playerName={playerName}
          index={m.index}
          figures={m.figures}
        />
      ))}
    </Wrap>
  );
}

const PlayerInfoHome = () => {
  const [playerName, setPlayerName] = useState(null);
  const { stats } = useContext(GlobalContext);
  const playerStats = stats.playerStats[playerName];
  const battingInfo = getBattingInfo(stats.batting[playerName]);
  const bowlingInfo = getBowlingInfo(stats.bowling[playerName]);

  return (
    <Wrap spacing={5} direction={"column"} p={["1em", "2em"]}>
      <Box>
        <PlayerNameSelector
          value={playerName}
          onChange={(playerName) => {
            setPlayerName(playerName);
          }}
          playerNames={Object.keys(stats.playerStats)}
        />
      </Box>

      {playerStats && (
        <>
          <Heading size={"lg"} mb={3} paddingLeft={2}>
            {capitalize(playerName)}
          </Heading>
          <PlayerBasicInfo playerName={playerName} playerStats={playerStats} />
          <Heading mb={3} fontSize={"m"}>
            Recent Form
          </Heading>
          <RecentMatches
            playerName={playerName}
            bowlingInfo={bowlingInfo}
            battingInfo={battingInfo}
          />
          <Heading mb={3} fontSize={"m"}>
            Career Stats
          </Heading>
          <Wrap>
            <CustomBox width={500}>
              <SimpleTable
                columns={battingColumns}
                rows={[getBattingInfoRow(battingInfo)]}
                textAlign={"left"}
                transpose
                colorAllHeaders={true}
                headerFontSize={15}
                rowFontSize={15}
                rowP={3}
              />
            </CustomBox>

            <CustomBox width={500}>
              <SimpleTable
                columns={bowlingColumns}
                rows={[getBowlingInfoRow(bowlingInfo)]}
                textAlign={"left"}
                transpose
                colorAllHeaders={true}
                headerFontSize={15}
                rowFontSize={15}
                rowP={3}
              />
            </CustomBox>
          </Wrap>
        </>
      )}
    </Wrap>
  );
};

export default PlayerInfoHome;
