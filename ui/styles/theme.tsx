import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
    600: "#327ed0",
    500: "#2161b4",
    100: "#2161b4",
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
  components: {
    Heading: {
      baseStyle: { color: "brand.900" },
    },
  },
});

export default theme;
