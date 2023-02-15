import { Divider, Flex, Heading, Stack, Text, Wrap } from "@chakra-ui/react";
import { Filter, GlobalContext } from "../../state/GlobalContext";
import { useContext, useEffect, useState } from "react";
import { CustomBox } from "../../components/HigherOrder/CustomBox";
import { SimpleTable } from "../../components/SimpleTable";
import { getAvg, LineChartBox, RecentMatches } from "../../components";
import { capitalize } from "../../utils/utils";
import { useRouter } from "next/router";
import { PlayerBasicInfo } from "../../components/playerInfo/playerBasicInfo";
import { PlayerNameSelector } from "../../components/playerInfo/playerNameSelector";
import {
  getBattingInfo,
  getBowlingInfo,
} from "../../components/playerInfo/calcCareerRecords";
import { FromYearFilter } from "../../components/filters";

const battingColumns = [
  { field: "b", headerName: "Batting", width: 10 },
  { field: "runsScored", headerName: "Runs Scored", width: 10 },
  { field: "ballsFaced", headerName: "Balls Faced", width: 10 },
  { field: "sr", headerName: "Strike Rate", width: 10 },
  { field: "avg", headerName: "Average", width: 10 },
  { field: "matchesBatted", headerName: "Matches Batted", width: 10 },
  { field: "topFigures", headerName: "Top Scores", width: 10 },
  { field: "ranking", headerName: "Rankings", width: 10 },
];

const bowlingColumns = [
  { field: "b", headerName: "Bowling", width: 10 },
  { field: "wickets", headerName: "Wickets Taken", width: 10 },
  { field: "oversBowled", headerName: "Overs Bowled", width: 10 },
  { field: "economy", headerName: "Economy", width: 10 },
  { field: "average", headerName: "Average", width: 10 },
  { field: "matchesBowled", headerName: "Matches Bowled", width: 10 },
  { field: "topFigures", headerName: "Top Scores", width: 10 },
  { field: "ranking", headerName: "Rankings", width: 10 },
];

function getBattingInfoRow(battingInfo) {
  const battingRow = { ...battingInfo };

  battingRow.topFigures = <Wrap maxW={"100%"}>{battingRow?.topFigures}</Wrap>;

  battingRow.ranking = (
    <Stack>
      <Text>#{battingRow.runsRanking} in Runs scored</Text>
      <Text>#{battingRow.highestScoreRanking} in Highest score</Text>
      {battingRow.avgRank > 0 && <Text>#{battingRow.avgRank} in Average</Text>}
      {battingRow.srRank > 0 && (
        <Text>#{battingRow.srRank} in Strike Rate</Text>
      )}
    </Stack>
  );

  return battingRow;
}

function getBowlingInfoRow(bowlingInfo) {
  const bowlingRow = { ...bowlingInfo };

  bowlingRow.topFigures = <Wrap>{bowlingInfo?.topFigures}</Wrap>;
  bowlingRow.ranking = (
    <Stack>
      <Text>#{bowlingRow.wicketsRanking} in Wickets taken</Text>
      <Text>#{bowlingRow.bowlingFigureRanking} in Best bowling figure</Text>
      {bowlingRow.economyRanking > 0 && (
        <Text>#{bowlingRow.economyRanking} in Economy</Text>
      )}
    </Stack>
  );

  return bowlingRow;
}

function PlayerInfoFilters(props: {
  value: string;
  onPlayerNameChange: (playerName) => void;
  fromYear: Filter;
  playerNames: string[];
}) {
  return (
    <Wrap spacing="10">
      <Flex align="center">
        <FromYearFilter fromYear={props.fromYear} />
      </Flex>

      <Flex align="center">
        <PlayerNameSelector
          value={props.value}
          onChange={props.onPlayerNameChange}
          playerNames={props.playerNames}
        />
      </Flex>
    </Wrap>
  );
}

const PlayerInfoHome = () => {
  const [playerName, setPlayerName] = useState("");
  const [chartData, setChartData] = useState([]);
  const { stats, filters } = useContext(GlobalContext);
  const playerStats = stats.playerStats[playerName];
  const battingInfo = getBattingInfo(stats.batting, playerName);
  const bowlingInfo = getBowlingInfo(stats.bowling, playerName);
  const router = useRouter();

  useEffect(() => {
    let playerName = router.query.playerName;
    if (Array.isArray(playerName)) {
      playerName = playerName[0];
    }

    setChartData(
      stats.batting[playerName]?.battingStatByMatch.map((s, i) => ({
        matchNo: i + 1,
        avg: +getAvg(s.runs, s.matches, s.notOuts),
        ...s,
      })) || []
    );
    setPlayerName(playerName);
  }, [stats]);

  return (
    <Wrap spacing={5} direction={"column"} p={["1em", "2em"]}>
      <PlayerInfoFilters
        value={playerName}
        onPlayerNameChange={(playerName) => {
          setPlayerName(playerName);
          router.query.playerName = playerName;
          router.push(router);
        }}
        playerNames={Object.keys(stats.playerStats)}
        fromYear={filters.fromYear}
      />
      <Divider />

      {playerStats && (
        <>
          <Heading size={"lg"} mb={3}>
            {capitalize(playerName)}
          </Heading>
          <PlayerBasicInfo playerName={playerName} playerStats={playerStats} />
          <Heading mb={3} fontSize={"m"}>
            Last 5 Matches
          </Heading>
          <RecentMatches
            playerName={playerName}
            bowlingInfo={bowlingInfo}
            battingInfo={battingInfo}
          />
          <Heading mb={3} fontSize={"m"}>
            Career Stats
          </Heading>
          <Wrap width={"calc(100vw - 3em)"} spacing={5}>
            <CustomBox minW={["100%", 450]}>
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

            <CustomBox minW={["100%", 450]}>
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
          <Wrap spacing={10}>
            <LineChartBox
              title={"Runs Vs Matches"}
              xAxisKey={"matchNo"}
              dataKey={"runs"}
              width={700}
              data={chartData}
            />
            <LineChartBox
              title={"Avg Vs Matches"}
              xAxisKey={"matchNo"}
              dataKey={"avg"}
              width={700}
              data={chartData}
            />
          </Wrap>
        </>
      )}
    </Wrap>
  );
};

export default PlayerInfoHome;
