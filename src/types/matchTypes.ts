// src/types/matchTypes.ts

import { MatchDetails } from "@/app/match/[matchId]/types/match.types";

export interface Kill {
  round: number;
  time_in_round_in_ms: number;
  killer: {
    puuid: string;
    name: string;
    tag: string;
    team: string;
  };
  victim: {
    puuid: string;
    name: string;
    tag: string;
    team: string;
  };
  assistants: Array<{
    puuid: string;
    name: string;
    tag: string;
    team: string;
  }>;
  location: {
    x: number;
    y: number;
  };
  weapon: {
    id: string;
    name: string;
    type: string;
  };
  secondary_fire_mode: boolean;
  player_locations: Array<{
    puuid: string;
    name: string;
    tag: string;
    team: string;
    view_radians: number;
    location: {
      x: number;
      y: number;
    };
  }>;
}

export interface PlayerStats {
  score: number;
  kills: number;
  deaths: number;
  assists: number;
  headshots: number;
  bodyshots: number;
  legshots: number;
  damage: {
    dealt: number;
    received: number;
  };
}

export interface AbilityCasts {
  grenade: number;
  ability_1: number;
  ability_2: number;
  ultimate: number;
}

export interface Economy {
  spent: {
    overall: number;
    average: number;
  };
  loadout_value: {
    overall: number;
    average: number;
  };
}

export interface Player {
  puuid: string;
  name: string;
  tag: string;
  team_id: string;
  platform: string;
  party_id: string;
  agent: {
    id: string;
    name: string;
  };
  stats: PlayerStats;
  ability_casts: AbilityCasts;
  tier: {
    id: number;
    name: string;
  };
  card_id: string;
  title_id: string;
  prefered_level_border: string;
  account_level: number;
  session_playtime_in_ms: number;
  behavior: {
    afk_rounds: number;
    friendly_fire: {
      incoming: number;
      outgoing: number;
    };
    rounds_in_spawn: number;
  };
  economy: Economy;
}

export interface Round {
  id: number;
  result: string;
  winning_team: string;
  plant?: {
    round_time_in_ms: number;
    site: string;
    location: { x: number; y: number };
    player: { puuid: string; name: string; tag: string; team: string };
    player_locations: Array<{
      puuid: string;
      name: string;
      tag: string;
      team: string;
      view_radians: number;
      location: { x: number; y: number };
    }>;
  };
  defuse?: {
    round_time_in_ms: number;
    location: { x: number; y: number };
    player: { puuid: string; name: string; tag: string; team: string };
    player_locations: Array<{
      puuid: string;
      name: string;
      tag: string;
      team: string;
      view_radians: number;
      location: { x: number; y: number };
    }>;
  };
  stats: Array<{
    ability_casts: AbilityCasts;
    player: { puuid: string; name: string; tag: string; team: string };
    damage_events: Array<{
      puuid: string;
      name: string;
      tag: string;
      team: string;
      bodyshots: number;
      headshots: number;
      legshots: number;
      damage: number;
    }>;
    stats: {
      bodyshots: number;
      headshots: number;
      legshots: number;
      damage: number;
      kills: number;
      assists: number;
      score: number;
    };
    economy: {
      loadout_value: number;
      remaining: number;
      weapon: { id: string; name: string; type: string };
      armor: { id: string; name: string };
    };
    was_afk: boolean;
    received_penalty: boolean;
    stayed_in_spawn: boolean;
  }>;
}

export interface Team {
  team_id: string;
  rounds: {
    won: number;
    lost: number;
  };
  won: boolean;
  premier_roster?: {
    id: string;
    name: string;
    tag: string;
    members: string[];
    customization: {
      icon: string;
      image: string;
      primary_color: string;
      secondary_color: string;
      tertiary_color: string;
    };
  };
}

export interface MatchMetadata {
  match_id: string;
  map: {
    id: string;
    name: string;
  };
  game_version: string;
  game_length_in_ms: number;
  started_at: string;
  is_completed: boolean;
  queue: {
    id: string;
    name: string;
    mode_type: string;
  };
  season: {
    id: string;
    short: string;
  };
  platform: string;
  region: string;
  cluster: string;
  premier: Record<string, unknown>;
  party_rr_penaltys: Array<{
    party_id: string;
    penalty: number;
  }>;
}

export interface MatchResponse {
  status: number;
  data: MatchDetails;
}

// Tipo para estatísticas avançadas do jogador
export interface PlayerExtendedStats {
  puuid: string;
  name: string;
  tag: string;
  agent: string;
  team_id: string;
  // Estatísticas base
  kills: number;
  deaths: number;
  assists: number;
  score: number;
  damage_dealt: number;
  damage_received: number;
  headshots: number;
  bodyshots: number;
  legshots: number;
  total_shots: number;
  // Estatísticas avançadas
  adr: number;
  acs: number;
  kdr: number;
  hsRate: number;
  fk: number;
  fd: number;
}
