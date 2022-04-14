import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";
import GlobalContextProvider from "../state/GlobalContext";
import Head from "next/Head";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalContextProvider>
      <ChakraProvider theme={theme}>
        <Head>
          <title>Step Cricket Scores</title>
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </GlobalContextProvider>
  );
}
