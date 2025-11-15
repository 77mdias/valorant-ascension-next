/**
 * Type definitions for Match Details page
 * Extracted from page.tsx for better organization and reusability
 */

export interface MatchDetails {
  metadata: {
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
  };
  players: Array<{
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
    stats: {
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
    };
    ability_casts: {
      grenade: number;
      ability1: number;
      ability2: number;
      ultimate: number;
    };
    tier: {
      id: number;
      name: string;
    };
    customization: {
      card: string;
      title: string;
      preferred_level_border: string | null;
    };
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
    economy: {
      spent: {
        overall: number;
        average: number;
      };
      loadout_value: {
        overall: number;
        average: number;
      };
    };
  }>;
  teams: Array<{
    team_id: string;
    rounds: {
      won: number;
      lost: number;
    };
    won: boolean;
    premier_roster: any;
  }>;
  rounds: Array<{
    winning_team: string;
    end_type: string;
    bomb_planted: boolean;
    bomb_defused: boolean;
    plant_events?: {
      plant_location: {
        x: number;
        y: number;
      };
      planted_by: {
        puuid: string;
        display_name: string;
        team: string;
      };
      plant_site: string;
      plant_time_in_round: number;
    };
    defuse_events?: {
      defuse_location: {
        x: number;
        y: number;
      };
      defused_by: {
        puuid: string;
        display_name: string;
        team: string;
      };
      defuse_time_in_round: number;
    };
    player_stats: Array<{
      ability_casts: {
        c_cast: number;
        q_cast: number;
        e_cast: number;
        x_cast: number;
      };
      player_puuid: string;
      player_display_name: string;
      player_team: string;
      damage_events: Array<{
        receiver_puuid: string;
        receiver_display_name: string;
        receiver_team: string;
        damage: number;
        legshots: number;
        bodyshots: number;
        headshots: number;
      }>;
      damage: number;
      score: number;
      kills: number;
      headshots: number;
      bodyshots: number;
      legshots: number;
      kill_events?: Array<{
        kill_time_in_round: number;
        kill_time_in_match: number;
        killer_puuid: string;
        killer_display_name: string;
        killer_team: string;
        victim_puuid: string;
        victim_display_name: string;
        victim_team: string;
        victim_death_location: {
          x: number;
          y: number;
        };
        damage_weapon_id: string;
        damage_weapon_name: string;
        secondary_fire_mode: boolean;
        player_locations_on_kill: Array<{
          player_puuid: string;
          player_display_name: string;
          player_team: string;
          location: {
            x: number;
            y: number;
          };
          view_radians: number;
        }>;
        assistants: Array<{
          assistant_puuid: string;
          assistant_display_name: string;
          assistant_team: string;
        }>;
      }>;
    }>;
  }>;
  kills: Array<{
    round: number;
    time_in_round_in_ms: number;
    killer: {
      puuid: string;
    };
    victim: {
      puuid: string;
    };
    kill_time_in_round: number;
    kill_time_in_match: number;
    killer_puuid: string;
    killer_display_name: string;
    killer_team: string;
    victim_puuid: string;
    victim_display_name: string;
    victim_team: string;
    victim_death_location: {
      x: number;
      y: number;
    };
    damage_weapon_id: string;
    damage_weapon_name: string;
    secondary_fire_mode: boolean;
    player_locations_on_kill: Array<{
      player_puuid: string;
      player_display_name: string;
      player_team: string;
      location: {
        x: number;
        y: number;
      };
      view_radians: number;
    }>;
    assistants: Array<{
      assistant_puuid: string;
      assistant_display_name: string;
      assistant_team: string;
    }>;
  }>;
}

export type Player = MatchDetails["players"][number];
export type Team = MatchDetails["teams"][number];
export type Round = MatchDetails["rounds"][number];
export type Kill = MatchDetails["kills"][number];

export interface PlayerStats {
  puuid: string;
  name: string;
  tag: string;
  agent: string;
  teamId: string;
  tier: string;
  score: number;
  kills: number;
  deaths: number;
  assists: number;
  kd: number;
  adr: number;
  hs: number;
  kast: number;
  fk: number;
  fd: number;
  mk: number;
}

export type SortField =
  | "score"
  | "kills"
  | "deaths"
  | "assists"
  | "kd"
  | "adr"
  | "hs"
  | "kast"
  | "fk"
  | "fd"
  | "mk";

export type SortOrder = "asc" | "desc";

export type TableView = "total" | "teams";

export type TabType = "scoreboard" | "performance" | "economy" | "rounds" | "duels";
