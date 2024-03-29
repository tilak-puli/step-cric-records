import React, { createContext, useEffect, useState } from "react";
import { Match } from "../types/match";
import extraDataJson from "../data/extraMatchData.json";
import extraDataGlobalJson from "../data/extraTagsData.json";
import getStats from "./stats";
import {
  BattingStats,
  BowlingStats,
  Partnership,
  PlayerStats,
} from "../types/stats";
import matchesJson from "../data/allMatches";
import { useRouter } from "next/router";

export let MATCHES_DATA: Match[] = [];

export interface Filter {
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
    playerStats: { [name: string]: PlayerStats };
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
  playerStats: {},
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
        tagI === globalTags.length - 1 || //last tag
        matchDate < new Date(globalTags[tagI + 1].startDate) //less than next tag start
      ) {
        matches[i].extraData.tags.push(tag.name);
      } else {
        tagI++;
        i--;
      }
    }
  }

  matches.forEach((m) => {
    m.extraData.tags = Array.from(new Set(m.extraData.tags));
  });
}

function addExtraMatchDetails(m: Match, i: number) {
  let date = m.matchFileNameDate?.replace(/\//g, "-");
  const matchNo = m.matchFileNameIdentifier?.match(/.*\((.*)\).*/);

  if (matchNo) {
    date = `${date}(${matchNo[1]})`;
  }

  let match = { ...m, matchIndex: i + 1, extraData: extraDataJson[date] || {} };

  match.extraData.tags = match.extraData.tags || [];

  return match;
}

export default function GlobalContextProvider({ children }) {
  const router = useRouter();

  const [fromYear, setFromYear] = useState(START_YEAR);
  const [tags, setTags] = useState([]);

  if (MATCHES_DATA.length === 0) {
    const matches: Match[] = matchesJson.map(addExtraMatchDetails);
    addGlobalTags(extraDataGlobalJson.timeTags, matches);

    MATCHES_DATA = matches;
  }

  const onSetTags = (tags) => {
    router.query.tags = tags;
    router.replace(router);
  };

  useEffect(() => {
    const tags = Array.isArray(router.query.tags)
      ? router.query.tags
      : (router.query.tags && [router.query.tags]) || [];
    //query.tags returns string or string[]

    setTags(tags);
  }, [router.query.tags]);

  return (
    <GlobalContext.Provider
      value={{
        matches: MATCHES_DATA,
        stats: { ...getStats(MATCHES_DATA, fromYear, tags) },
        filters: {
          fromYear: { value: fromYear, set: setFromYear },
          tags: { value: tags, set: onSetTags },
        },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
