import { Box, Heading, Wrap } from "@chakra-ui/react";
import { GlobalContext } from "../../state/GlobalContext";
import { useContext, useEffect, useState } from "react";
import { CustomBox } from "../../components/HigherOrder/CustomBox";
import { SimpleTable } from "../../components/SimpleTable";
import { RecentMatches } from "../../components";
import { capitalize } from "../../utils/utils";
import { useRouter } from "next/router";
import { PlayerBasicInfo } from "../../components/playerInfo/playerBasicInfo";
import { PlayerNameSelector } from "../../components/playerInfo/playerNameSelector";
import {
  getBattingInfo,
  getBowlingInfo
} from "../../components/playerInfo/calcCareerRecords";

const battingColumns = [
  { field: "b", headerName: "Batting", width: 10 },
  { field: "runsScored", headerName: "Runs Scored", width: 10 },
  { field: "ballsFaced", headerName: "Balls Faced", width: 10 },
  { field: "sr", headerName: "Strike Rate", width: 10 },
  { field: "avg", headerName: "Average", width: 10 },
  { field: "matchesBatted", headerName: "Matches Batted", width: 10 },
  { field: "topFigures", headerName: "Top Scores", width: 10 }
];

const bowlingColumns = [
  { field: "b", headerName: "Bowling", width: 10 },
  { field: "wickets", headerName: "Wickets Taken", width: 10 },
  { field: "oversBowled", headerName: "Overs Bowled", width: 10 },
  { field: "economy", headerName: "Economy", width: 10 },
  { field: "average", headerName: "Average", width: 10 },
  { field: "matchesBowled", headerName: "Matches Bowled", width: 10 },
  { field: "topFigures", headerName: "Top Scores", width: 10 }
];

function getBattingInfoRow(battingInfo) {
  const battingRow = { ...battingInfo };

  battingRow.topFigures = (
    <Wrap maxW={"100%"}>
      {battingRow?.topFigures}
    </Wrap>
  );

  return battingRow;
}

function getBowlingInfoRow(bowlingInfo) {
  const bowlingRow = { ...bowlingInfo };

  bowlingRow.topFigures = (
    <Wrap>
      {bowlingInfo?.topFigures}
    </Wrap>
  );

  return bowlingRow;
}

const PlayerInfoHome = () => {
  const [playerName, setPlayerName] = useState("");
  const { stats } = useContext(GlobalContext);
  const playerStats = stats.playerStats[playerName];
  const battingInfo = getBattingInfo(stats.batting[playerName]);
  const bowlingInfo = getBowlingInfo(stats.bowling[playerName]);
  const router = useRouter();

  useEffect(() => {
    let playerName = router.query.playerName;
    if (Array.isArray(playerName)) {
      playerName = playerName[0];
    }

    setPlayerName(playerName);
  }, [stats]);

  return (
    <Wrap spacing={5} direction={"column"} p={["1em", "2em"]}>
      <Box>
        <PlayerNameSelector
          value={playerName}
          onChange={(playerName) => {
            setPlayerName(playerName);
            router.query.playerName = playerName;
            router.push(router);
          }}
          playerNames={Object.keys(stats.playerStats)}
        />
      </Box>

      {playerStats && (
        <>
          <Heading size={"lg"} mb={3}>
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
        </>
      )}
    </Wrap>
  );
};

export default PlayerInfoHome;