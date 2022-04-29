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
export const START_YEAR = 2019;

const defaultStats = {
  batting: {},
  bowling: {},
  fromYear: START_YEAR,
  setFromYear: () => {},
  total: {
    runsScored: 0,
    wicketsTaken: 0,
    foursHit: 0,
    sixesHit: 0,
    highestMatchScore: 0,
  },
};

export const GlobalContext = createContext<GlobalContextType>({
  matches: [],
  stats: defaultStats,
});

export default function GlobalContextProvider({ children }) {
  const [fromYear, setFromYear] = useState(START_YEAR);
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
