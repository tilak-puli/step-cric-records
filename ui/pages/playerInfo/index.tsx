import {
  Box,
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
import { capitalize } from "../../utils/utils";

const battingColumns = [
  { field: "b", headerName: "Batting", width: 10 },
  { field: "runsScored", headerName: "Runs Scored", width: 10 },
  { field: "ballsFaced", headerName: "Balls Faced", width: 10 },
  { field: "sr", headerName: "Strike Rate", width: 10 },
  { field: "avg", headerName: "Average", width: 10 },
  { field: "matchesBatted", headerName: "Matches Batted", width: 10 },
  { field: "topFigures", headerName: "Top Scores", width: 10 },
  { field: "recentFigures", headerName: "Recent Scores", width: 10 },
];

const bowlingColumns = [
  { field: "b", headerName: "Bowling", width: 10 },
  { field: "wickets", headerName: "Wickets Taken", width: 10 },
  { field: "oversBowled", headerName: "Overs Bowled", width: 10 },
  { field: "economy", headerName: "Economy", width: 10 },
  { field: "average", headerName: "Average", width: 10 },
  { field: "matchesBowled", headerName: "Matches Bowled", width: 10 },
  { field: "topFigures", headerName: "Top Scores", width: 10 },
  { field: "recentFigures", headerName: "Recent Scores", width: 10 },
];

class PlayerNameSelector extends Component<{
  value: string;
  onChange: (string) => void;
  playerNames: string[];
}> {
  render() {
    return (
      <Flex align="center" gap="1">
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
              {playerName}
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
    .map((f) => (
      <FigureLink
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
    .map((f) => (
      <FigureLink
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
  };
}

function getBattingInfoRow(batting) {
  console.log(batting);
  return {
    runsScored: batting.runs,
    ballsFaced: batting.balls,
    sr: ((batting.runs / batting.balls) * 100).toFixed(0),
    avg: getAvg(batting.runs, batting.matches, batting.notOuts),
    matchesBatted: batting.matches,
    topFigures: (
      <Box>
        {top5BattingFigures([...batting.battingFigures]).reduce(
          (prev, curr) => [prev, ", ", curr]
        )}
      </Box>
    ),
    recentFigures: [...batting.battingFigures]
      .slice(-5)
      .reverse()
      .map((f) => (
        <FigureLink
          text={`${f.runs}(${f.balls})${f.notOut ? "*" : ""}`}
          matchIndex={f.matchIndex}
        />
      ))
      // @ts-ignore
      .reduce((prev, curr) => [prev, ", ", curr]),
  };
}

function getBowlingInfoRow(bowling) {
  return {
    wickets: bowling.wickets,
    matchesBowled: bowling.matches,
    oversBowled: bowling.overs,
    economy: getEconomy(bowling.bowlingFigures),
    average: getBowlingAverage(bowling.bowlingFigures),
    topFigures: (
      <Box>
        {top5BowlingFigures([...bowling.bowlingFigures]).reduce(
          (prev, curr) => [prev, ", ", curr]
        )}
      </Box>
    ),
    recentFigures: [...bowling.bowlingFigures]
      .slice(-5)
      .reverse()
      .map((f) => (
        <FigureLink
          text={`${f.wickets}/${f.wicketsWithRuns}(${f.wicketsInOvers})`}
          matchIndex={f.matchIndex}
        />
      ))
      // @ts-ignore
      .reduce((prev, curr) => [prev, ", ", curr]),
  };
}

const PlayerBasicInfo = ({ playerName, playerStats }) => {
  const info = getPlayerInfoRow(playerName, playerStats);

  return (
    <CustomBox width={350} p={3}>
      <Flex direction={"column"}>
        <Heading size={"md"} mb={3}>
          {capitalize(info.name)}
        </Heading>
        <Wrap>
          <Text>most with tag:</Text>
          <Text>{info.topTag}</Text>
        </Wrap>
      </Flex>
    </CustomBox>
  );
};

const PlayerInfoHome = () => {
  const [playerName, setPlayerName] = useState(null);
  const { stats } = useContext(GlobalContext);
  const playerStats = stats.playerNames[playerName];
  return (
    <Wrap spacing={5} direction={"column"} p={["1em", "2em"]}>
      <Box>
        <PlayerNameSelector
          value={playerName}
          onChange={(playerName) => {
            setPlayerName(playerName);
          }}
          playerNames={Object.keys(stats.playerNames)}
        />
      </Box>

      {playerStats && (
        <>
          <PlayerBasicInfo playerName={playerName} playerStats={playerStats} />
          <Wrap>
            <CustomBox width={500} pb={3}>
              <SimpleTable
                columns={battingColumns}
                rows={[getBattingInfoRow(stats.batting[playerName])]}
                textAlign={"left"}
                transpose
                headerFontSize={15}
              />
            </CustomBox>
            <CustomBox width={500} pb={3}>
              <SimpleTable
                columns={bowlingColumns}
                rows={[getBowlingInfoRow(stats.bowling[playerName])]}
                textAlign={"left"}
                transpose
                headerFontSize={15}
              />
            </CustomBox>
          </Wrap>
        </>
      )}
    </Wrap>
  );
};

export default PlayerInfoHome;
