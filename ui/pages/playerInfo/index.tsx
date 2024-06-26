import { Box, Flex, Heading, Stack, Text, Wrap } from "@chakra-ui/react";
import { Filter, GlobalContext } from "../../state/GlobalContext";
import { useContext, useEffect, useState } from "react";
import { CustomBox } from "../../components/HigherOrder/CustomBox";
import { SimpleTable } from "../../components/SimpleTable";
import { getAvg, LineChartBox, RecentMatches } from "../../components";
import { capitalize, getPercentage } from "../../utils/utils";
import { useRouter } from "next/router";
import { PlayerBasicInfo } from "../../components/playerInfo/playerBasicInfo";
import { PlayerNameSelector } from "../../components/playerInfo/playerNameSelector";
import { getBattingInfo, getBowlingInfo, getOutCausePlayerCount, getOutCausesCount } from "../../components/playerInfo/calcCareerRecords";
import { FromYearFilter } from "../../components/filters";
import { ComposedChartGraph } from "../../components/lineChart";
import _ from "lodash";

const battingColumns = [
  { field: "b", headerName: "Batting", width: 10 },
  { field: "runsScored", headerName: "Runs Scored", width: 10 },
  { field: "ballsFaced", headerName: "Balls Faced", width: 10 },
  { field: "sr", headerName: "Strike Rate", width: 10 },
  { field: "avg", headerName: "Average", width: 10 },
  { field: "matchesBatted", headerName: "Matches Batted", width: 10 },
  { field: "milestones", headerName: "Milestones", width: 10 },
  { field: "topFigures", headerName: "Top Scores", width: 10 },
  { field: "mostOutBy", headerName: "Most Out By", width: 10 },
  { field: "mostOutByPlayer", headerName: "Most Out By", width: 10 },
  { field: "ranking", headerName: "Rankings", width: 10 }
];

const bowlingColumns = [
  { field: "b", headerName: "Bowling", width: 10 },
  { field: "wickets", headerName: "Wickets Taken", width: 10 },
  { field: "oversBowled", headerName: "Overs Bowled", width: 10 },
  { field: "economy", headerName: "Economy", width: 10 },
  { field: "average", headerName: "Average", width: 10 },
  { field: "matchesBowled", headerName: "Matches Bowled", width: 10 },
  { field: "milestones", headerName: "Milestones  ", width: 10 },
  { field: "topFigures", headerName: "Top Scores", width: 10 },
  { field: "ranking", headerName: "Rankings", width: 10 }
];

function getOutCausePercentages(outCausesCount: _.Dictionary<number>) {
  if (!outCausesCount) {
    return [];
  }

  const totalOuts = Object.values(outCausesCount || {}).reduce((acc, val) => acc + val, 0);

  return _.map(outCausesCount, (count: number, cause) => ({
    cause,
    percentage: parseFloat(getPercentage(count, totalOuts)),
  }));
}

function getBattingInfoRow(battingInfo) {
  const battingRow = { ...battingInfo };
  console.log(battingInfo?.outCauses)

  const outCausePercentages = getOutCausePercentages(getOutCausesCount(battingInfo?.outCauses || [])) || {};
  const outPlayerCausePercentages = getOutCausePercentages(getOutCausePlayerCount(battingInfo?.outCauses || [])) || {};

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

  battingRow["milestones"] = (
    <Flex gap={5}>
      <Text>50s: {battingRow["50s"]}</Text>
      <Text> 30s: {battingRow["30s"]}</Text>
      <Text> 20s:{battingRow["20s"]} </Text>
      <Text>
        Ducks: {battingRow.ducks}(
        {getPercentage(battingRow.ducks, battingRow.matchesBatted)}%)
      </Text>
    </Flex>
  );

  const topCauses = _.sortBy(outCausePercentages, "percentage")?.slice(-3).reverse();
  const topPlayerCause = _.sortBy(outPlayerCausePercentages, "percentage")?.slice(-3).reverse();

  battingRow["mostOutBy"] = (
    <Flex gap={1}>
      {topCauses.map((cause: any, i) => <Text key={i}>{cause?.cause}({cause?.percentage}%)</Text>)}
    </Flex>
  );

  battingRow["mostOutByPlayer"] = (
    <Flex gap={1}>
      {topPlayerCause.map((cause: any, i) => <Text key={i}>{cause?.cause}({cause?.percentage}%)</Text>)}
    </Flex>
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

  bowlingRow["milestones"] = (
    <Flex gap={5}>
      <Text>3W+: {bowlingRow.noOf3Wickets} </Text>
      <Text> 2W: {bowlingRow.noOf2Wickets}</Text>
      <Text> Maidens: {bowlingRow.maidens}</Text>
    </Flex>
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
    let playerName: string = Array.isArray(router.query.playerName) ? router.query.playerName[0] : router.query.playerName;

    setChartData(
      stats.batting[playerName]?.battingStatByMatch.map((s, i) => ({
        matchNo: i + 1,
        avg: +getAvg(s.runs, s.matches, s.notOuts),
        ...s,
        totalRuns: s.runs,
        runs: s.runs - (stats.batting[playerName]?.battingStatByMatch[i - 1]?.runs || 0)
      })) || []
    );
    setPlayerName(playerName);
  }, [stats]);

  return (
    <Wrap spacing={10} direction={"column"} p={["1em", "2em"]}>
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

      {playerStats && (
        <>
          <Wrap spacing={20}>
            <Box>
              <Heading size={"lg"} mb={3}>
                {capitalize(playerName)}
              </Heading>
              <PlayerBasicInfo
                playerName={playerName}
                playerStats={playerStats}
              />
            </Box>
            <Box paddingTop={5}>
              <Heading mb={3} fontSize={"m"}>
                Last 5 Matches
              </Heading>

              <RecentMatches
                playerName={playerName}
                bowlingInfo={bowlingInfo}
                battingInfo={battingInfo}
              />
            </Box>
          </Wrap>
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
          <Heading mb={3} fontSize={"m"}>
            Charts
          </Heading>
          <Wrap spacing={10}>
            <LineChartBox
              title={"Runs Vs Matches"}
              xAxisKey={"matchNo"}
              lines={[{ key: "totalRuns", name: "Runs" }]}
              width={1000}
              data={chartData}
            />
            <ComposedChartGraph
              title={"Avg Vs Matches"}
              xAxisKey={"matchNo"}
              width={1000}
              data={chartData}
              barName={"Runs"}
              lineName={"Average"}
              barKey={"runs"}
              lineKey={"avg"}
              showDot={false}
              onClick={(data: any) => router.push("/matches/" + data.matchIndex)}
            />
          </Wrap>
        </>
      )}
    </Wrap>
  );
};

export default PlayerInfoHome;
