import React, { createContext } from "react";
import { Match } from "../types/match";
import matches from "../data/matches.json";
import getStats from "./stats";

export const GlobalContext = createContext({
  matches: [],
  stats: { batting: {}, bowling: {} },
});

export default function GlobalContextProvider({ children }) {
  return (
    <GlobalContext.Provider
      value={{ matches: matches as Match[], stats: getStats(matches) }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
