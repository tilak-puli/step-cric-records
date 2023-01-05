import { ChakraProps } from "@chakra-ui/system/src/system.types";
import React, { ReactElement } from "react";
import { Box } from "@chakra-ui/react";

interface HigherOrderChakraProps extends ChakraProps {
  children?: ReactElement[] | ReactElement;
}

export const CustomBox = (props: HigherOrderChakraProps) => {
  return (
    <Box
      bg={props.bg || "white"}
      border="1px"
      borderStyle={"solid"}
      borderColor={"gray.200"}
      borderRadius={"sm"}
      {...props}
    >
      {props.children}
    </Box>
  );
};
