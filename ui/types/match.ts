export interface Match {
  team1Name: string;
  team2Name: string;
  result: string;
  team1: TeamData;
  team2: TeamData;
  winner: string;
  matchUploadedDate: string;
  matchFileNameDate: string;
}

export interface TeamData {
  name: string;
  score: Score;
  batting: Batting[];
  extrasGot: number;
  battingRunRate: number;
  extrasBowled: number;
  extrasBowledText: string;
  bowling: Bowling[];
}

export interface Score {
  runs: number;
  wickets: number;
  overs: number;
}

export interface Batting {
  name: string;
  outReason: string;
  balls: number;
  runs: number;
  fours: number;
  sixes: number;
  runRate: number;
}

export interface Bowling {
  name: string;
  overs: number;
  runs: number;
  maidens: number;
  wickets: number;
  economy: number;
}
