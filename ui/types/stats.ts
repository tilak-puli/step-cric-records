export interface BattingStat {
  runs: number;
  highestScore: number;
  highestScoreInBalls: number;
  matches: number;
}

export interface BattingStats {
  [name: string]: BattingStat;
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
