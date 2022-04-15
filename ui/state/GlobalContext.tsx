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
    total?: {
      runsScored: number;
      wicketsTaken: number;
      foursHit: number;
      sixesHit: number;
      highestMatchScore: number;
    };
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
    total: {
      runsScored: 0,
      wicketsTaken: 0,
      foursHit: 0,
      sixesHit: 0,
      highestMatchScore: 0,
    },
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
