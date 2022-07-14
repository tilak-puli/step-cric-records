export interface Match {
  team1Name: string;
  team2Name: string;
  result: string;
  matchIndex?: number;
  team1: TeamData;
  team2: TeamData;
  winner: string;
  matchUploadedDate: string;
  matchFileNameDate: string;
  matchFileNameIdentifier: string;
  extraData?: ExtraData;
}

export interface MvpDetails {
  name: string;
  points: number;
  wickets: number;
  runsGiven: number;
  runs: number;
  balls: number;
  overs: number;
  text: string;
}

export interface SpecialMvpDetails {
  name: string;
  reason: string;
}

export interface PlayersMvpDetails {
  [name: string]: MvpDetails;
}

export interface ExtraData {
  specialMvp: SpecialMvpDetails;
  specialMentions?: String[];
  tags?: String[];
}

export interface FallOfWicket {
  name: String;
  score: String;
  over: String;
}

export interface TeamData {
  name: string;
  score: Score;
  batting: Batting[];
  bowling: Bowling[];
  fallOfWickets: FallOfWicket[];
  extrasGot: number;
  battingRunRate: number;
  extrasBowled: number;
  extrasBowledText: string;
}

export interface Score {
  runs: number;
  wickets: number;
  overs: number;
}

export interface Batting {
  name: string;
  outReason: string;
  notOut: boolean;
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
