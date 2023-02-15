export interface BattingStat {
  beforeLastMatchRecord?: BattingStat;
  runs: number;
  balls: number;
  battingFigures: BattingFigure[];
  matches: number;
  notOuts: number;
}

export interface Partnership {
  batsman1: string;
  batsman2: string;
  runs: number;
  balls: number;
  matchIndex: number;
}

export interface BattingStats {
  [name: string]: BattingStat;
}

export interface TagsFreq {
  [tagName: string]: number;
}

export interface PlayerStats {
  tags: TagsFreq;
  tournamentTags: Set<string>;
  wins: number;
  matches: number;
}

export interface BattingFigure {
  runs: number;
  balls: number;
  matchIndex: number;
  notOut: boolean;
}

export interface BowlingFigure {
  wickets: number;
  wicketsWithRuns: number;
  wicketsInOvers: number;
  matchIndex: number;
}
export interface BowlingStat {
  beforeLastMatchRecord?: {
    bowlingFigures: BowlingFigure[];
    overs: string;
    wickets: number;
    matches: number;
  };
  wickets: number;
  bowlingFigures: BowlingFigure[];
  matches: number;
  overs: string;
}

export interface BowlingStats {
  [name: string]: BowlingStat;
}
