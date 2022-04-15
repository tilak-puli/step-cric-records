import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const theme = extendTheme({
  colors,
  styles: {
    global: {
      body: {
        bg: "gray.100",
      },
    },
  },
});

export default theme;
