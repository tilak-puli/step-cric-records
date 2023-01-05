import { Flex, Text, Wrap } from "@chakra-ui/react";
import { CustomBox } from "../HigherOrder/CustomBox";

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

export const PlayerBasicInfo = ({ playerName, playerStats }) => {
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
