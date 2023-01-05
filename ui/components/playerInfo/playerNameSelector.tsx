import { Flex, Heading, Select } from "@chakra-ui/react";
import { capitalize } from "../../utils/utils";

export function PlayerNameSelector(props: {
  value: string;
  onChange: (string) => void;
  playerNames: string[];
}) {
  return (
    <Flex align="center" gap="1" marginBottom={5}>
      <Heading size="sm">Search by Name: </Heading>
      <Select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        width={150}
        size="md"
        bg={"white"}
      >
        {props.playerNames.sort().map((playerName) => (
          <option key={playerName} value={playerName}>
            {capitalize(playerName)}
          </option>
        ))}
      </Select>
    </Flex>
  );
}
