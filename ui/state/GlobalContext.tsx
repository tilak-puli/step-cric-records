import React, { createContext, useState } from "react";
import { Match } from "../types/match";
import matchesJson from "../data/matches.json";
import extraDataJson from "../data/extraData.json";
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
  const matches: Match[] = matchesJson.map((m) => {
    const date = m.matchFileNameDate?.replace(/\//g, "-");
    if (extraDataJson[date]) {
      return { ...m, extraData: extraDataJson[date] };
    }
    return m;
  });

  return (
    <GlobalContext.Provider
      value={{
        matches,
        stats: { ...getStats(matches, fromYear), setFromYear, fromYear },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
