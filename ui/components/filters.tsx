import { useContext, useEffect } from "react";
import { GlobalContext, START_YEAR } from "../state/GlobalContext";
import {
  Container,
  Flex,
  FormControl,
  Heading,
  Select,
  Wrap,
} from "@chakra-ui/react";
import _ from "underscore";
import { Select as MultiSelect } from "chakra-react-select";

export function Filters() {
  const { filters, matches } = useContext(GlobalContext);
  const allTags = Array.from(new Set(matches.flatMap((m) => m.extraData.tags)));

  useEffect(() => {
    return filters.fromYear.set(START_YEAR);
  }, []);

  return (
    <Wrap gap="10" mb={4}>
      <Flex align="center" gap="1">
        <Heading size="sm">From Year: </Heading>
        <Select
          value={filters.fromYear.value}
          onChange={(e) => filters.fromYear.set(e.target.value)}
          width={100}
          size="md"
          bg={"white"}
        >
          {_.times(new Date().getFullYear() - START_YEAR + 1, (n) => (
            <option key={n} value={n + START_YEAR}>
              {n + START_YEAR}
            </option>
          ))}
        </Select>
      </Flex>
      <Flex align="center" gap="1" w={400}>
        <Heading size="sm">Tags: </Heading>
        <Container>
          <FormControl bg={"white"} w="100%">
            <MultiSelect
              colorScheme="brand"
              value={filters.tags.value.map(getTag)}
              options={(allTags || []).map(getTag)}
              onChange={(v) => filters.tags.set(v.map((v) => v.value))}
              isMulti
              chakraStyles={{
                multiValueLabel: (provided) => ({
                  ...provided,
                  color: "white",
                  fontSize: 12,
                }),
                multiValueRemove: (provided) => ({
                  ...provided,
                  color: "white",
                }),
                multiValue: (provided) => ({
                  ...provided,
                  borderRadius: "sm",
                }),
              }}
            />
          </FormControl>
        </Container>
      </Flex>
    </Wrap>
  );
}

const getTag = (tag) => ({
  label: tag,
  value: tag,
});
