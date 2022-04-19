export interface BattingStat {
  runs: number;
  battingFigures: BattingFigure[];
  matches: number;
  notOuts: number;
}

export interface BattingStats {
  [name: string]: BattingStat;
}

export interface BattingFigure {
  runs: number;
  balls: number;
  matchIndex: number;
}

export interface BowlingFigure {
  wickets: number;
  wicketsWithRuns: number;
  wicketsInOvers: number;
  matchIndex: number;
}
export interface BowlingStat {
  wickets: number;
  bowlingFigures: BowlingFigure[];
  matches: number;
}

export interface BowlingStats {
  [name: string]: BowlingStat;
}
