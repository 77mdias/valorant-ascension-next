// Tipos para dados do Valorant - Sistema de Progresso do Jogador

export interface RankInfo {
  tier: string;
  division?: string;
  rr: number;
  elo?: number;
  iconUrl?: string;
  season?: string;
  peak?: {
    tier: string;
    division?: string;
    rr?: number;
  };
}

export interface MatchSummary {
  id: string;
  date: string;
  map: string;
  agent: string;
  mode: string;
  result: 'win' | 'loss' | 'draw';
  rrChange?: number;
  kills: number;
  deaths: number;
  assists: number;
  hsPercent?: number;
  durationMinutes?: number;
}

export interface AgentStat {
  agent: string;
  matches: number;
  winRate: number;
  kd: number;
  kpr?: number;
  adr?: number;
}

export interface MapStat {
  map: string;
  matches: number;
  winRate: number;
  kd: number;
  atkWinRate?: number;
  defWinRate?: number;
}

export interface WeaponStat {
  weapon: string;
  usagePercent: number;
  hsPercent?: number;
  kd?: number;
}

export interface PlayerOverview {
  winRate: number;
  kd: number;
  hsPercent: number;
  totalMatches: number;
  playtimeHours?: number;
}

export interface PlayerStreaks {
  wins: number;
  daysActive?: number;
  clutchStreak?: number;
  firstBloods?: number;
  hsStreak?: number;
}

export interface PlayerProgress {
  riotName: string;
  tag: string;
  rank: RankInfo;
  overview: PlayerOverview;
  streaks?: PlayerStreaks;
  agents: AgentStat[];
  maps: MapStat[];
  weapons?: WeaponStat[];
  recentMatches: MatchSummary[];
}

// Tipos para componentes
export interface OverviewCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

// Tipos para estados de loading/erro
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Tipos existentes da API atual (para compatibilidade)
export interface AccountDTO {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface MatchHistoryItem {
  matchId: string;
  gameStartTimeMillis: number;
  queueId: string;
}

export interface MatchlistDTO {
  history?: MatchHistoryItem[];
}

export interface PlayerResponse {
  account: AccountDTO;
  matchlist: MatchlistDTO | null;
  region: string;
  matchlistError?: {
    status: number;
    detail?: string;
    regionTried?: string;
  };
}
