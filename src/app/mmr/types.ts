export interface PlayerData {
  name: string;
  tag: string;
  level: number;
  rank: string;
  elo: number;
  rankImage: string;
  cardImage: string;
  lastUpdate: Date;
}

export interface MatchData {
  id: string;
  map: string;
  mode: string;
  agent: string;
  result: "win" | "loss" | "draw";
  score: string;
  kills: number;
  deaths: number;
  assists: number;
  headshots: number;
  damage: number;
  rounds_played: number;
  date: Date;
  duration: number;
}
