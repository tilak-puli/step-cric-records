export interface BattingStat {
  runs: number;
  battingFigures: BattingFigure[];
  matches: number;
}

export interface BattingStats {
  [name: string]: BattingStat;
}

export interface BattingFigure {
  runs: number;
  balls: number;
}

export interface BowlingFigure {
  wickets: number;
  wicketsWithRuns: number;
  wicketsInOvers: number;
}
export interface BowlingStat {
  wickets: number;
  bowlingFigures: BowlingFigure[];
  matches: number;
}

export interface BowlingStats {
  [name: string]: BowlingStat;
}
