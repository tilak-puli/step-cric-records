import React, { createContext, useState } from "react";
import { Match } from "../types/match";
import matches from "../data/matches.json";
import getStats from "./stats";
import { BattingStats, BowlingStats } from "../types/stats";

interface GlobalContextType {
  matches: Match[];
  stats: {
    batting: BattingStats;
    bowling: BowlingStats;
    fromYear: number;
    setFromYear: any;
  };
}
export const StartYear = 2019;

export const GlobalContext = createContext<GlobalContextType>({
  matches: [],
  stats: {
    batting: {},
    bowling: {},
    fromYear: StartYear,
    setFromYear: () => {},
  },
});

export default function GlobalContextProvider({ children }) {
  const [fromYear, setFromYear] = useState(StartYear);

  return (
    <GlobalContext.Provider
      value={{
        matches: matches as Match[],
        stats: { ...getStats(matches, fromYear), setFromYear, fromYear },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
