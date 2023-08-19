import {CustomBox} from "./HigherOrder/CustomBox";
import {Text} from "@chakra-ui/react";

export const CustomTooltip = ({active, payload}) => {
  if (active && payload && payload.length) {
    const isWicketTooltip = !!payload[0].payload.name;

    if (isWicketTooltip) {
      return (
        <CustomBox p={2}>
          <Text>Wicket: {payload[0].payload.name}</Text>
          <Text>Score: {payload[0].payload.score}</Text>
        </CustomBox>
      );
    }

    return (
      <CustomBox p={2}>
        {payload[0].payload.score && (
          <Text>
            {payload[0].name}: {payload[0].payload.score}
          </Text>
        )}
        {payload[0].payload.team2Score && (
          <Text>
            {payload[0].payload.team2Name}: {payload[0].payload.team2Score}
          </Text>
        )}
      </CustomBox>
    );
  }

  return null;
};
