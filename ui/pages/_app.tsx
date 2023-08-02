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
          <meta name={"title"} content={"Step Cricket Records"}/>
          <meta name={"description"} content={"A website to show records and stats of STEP cricket"}/>
          <meta property={"og:title"} content={"Step Cricket Records"}/>
          <meta property={"og:type"} content={"website"}/>
          <meta property={"og:url"} content={"https://step-cric-records.vercel.app/"}/>
        </Head>
        <NavBar />
        <Component {...pageProps} />
      </ChakraProvider>
    </GlobalContextProvider>
  );
}
