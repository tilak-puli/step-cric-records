import React, { createContext, useState } from "react";
import { Match } from "../types/match";
import extraDataJson from "../data/extraData.json";
import extraDataGlobalJson from "../data/extraDataGlobal.json";
import getStats from "./stats";
import { BattingStats, BowlingStats, Partnership } from "../types/stats";
import matchesJson from "../data/allMatches";

let MATCHES_DATA: Match[] = [];

interface Filter {
  value: any;
  set: Function;
}

interface GlobalContextType {
  matches: Match[];
  filters: { [name: string]: Filter };
  stats: {
    batting: BattingStats;
    bowling: BowlingStats;
    partnerships: Partnership[];
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
  partnerships: [],
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
  filters: {
    fromYear: { value: START_YEAR, set: () => {} },
    tags: { value: [], set: () => {} },
  },
});

function addGlobalTags(globalTags, matches) {
  let tagI = 0;

  for (let i = 0; i < matches.length && tagI != globalTags.length; i++) {
    let tag = globalTags[tagI];
    let matchDate = new Date(matches[i].matchFileNameDate);

    if (matchDate >= new Date(tag.startDate)) {
      if (
        tagI === globalTags.length - 1 ||
        matchDate < new Date(globalTags[tagI + 1].startDate)
      ) {
        matches[i].extraData.tags.push(tag.name);
      } else {
        tagI++;
      }
    }
  }

  matches.forEach((m) => {
    m.extraData.tags = Array.from(new Set(m.extraData.tags));
  });
}

function addExtraMatchDetails(m: Match) {
  let date = m.matchFileNameDate?.replace(/\//g, "-");
  const matchNo = m.matchFileNameIdentifier?.match(/.*\((.*)\).*/);

  if (matchNo) {
    date = `${date}(${matchNo[1]})`;
  }

  let match = { ...m, extraData: extraDataJson[date] || {} };

  match.extraData.tags = match.extraData.tags || [];

  return match;
}

export default function GlobalContextProvider({ children }) {
  const [fromYear, setFromYear] = useState(START_YEAR);
  const [tags, setTags] = useState([]);

  if (MATCHES_DATA.length === 0) {
    const matches: Match[] = matchesJson.map(addExtraMatchDetails);
    addGlobalTags(extraDataGlobalJson.tags, matches);

    MATCHES_DATA = matches;
  }

  return (
    <GlobalContext.Provider
      value={{
        matches: MATCHES_DATA,
        stats: { ...getStats(MATCHES_DATA, fromYear, tags) },
        filters: {
          fromYear: { value: fromYear, set: setFromYear },
          tags: { value: tags, set: setTags },
        },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
