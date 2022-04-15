import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";
import GlobalContextProvider from "../state/GlobalContext";
import Head from "next/head";
import NavBar from "../components/Navbar";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalContextProvider>
      <ChakraProvider theme={theme}>
        <Head>
          <title>Step Cricket Scores</title>
          <link
            href="https://fonts.googleapis.com/css2?family=Square+Peg&display=swap"
            rel="stylesheet"
          />
        </Head>
        <NavBar />
        <Component {...pageProps} />
      </ChakraProvider>
    </GlobalContextProvider>
  );
}
