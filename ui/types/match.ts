export interface Match {
  team1Name: String;
  team2Name: String;
  result: String;
  team1: TeamData;
  team2: TeamData;
  winner: String;
  matchUploadedDate: string;
  matchFileNameDate: string;
}

interface TeamData {
  name: String;
  score: Score;
  batting: Batting[];
  extrasGot: number;
  battingRunRate: number;
  extrasBowled: number;
  extrasBowledText: String;
  bowling: Bowling[];
}

export interface Score {
  runs: number;
  wickets: number;
  overs: number;
}

interface Batting {
  name: String;
  outReason: String;
  balls: number;
  runs: number;
  fours: number;
  sixes: number;
  runRate: number;
}

interface Bowling {
  name: String;
  overs: number;
  runs: number;
  maidens: number;
  wickets: number;
  bowlingRunRate: number;
}
