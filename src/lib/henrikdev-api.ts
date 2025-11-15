// API Client para HenrikDev System
// Integração com dados reais do Valorant

import { env } from "@/config/env";

// API URLs - centralizadas na configuração
const HENRIKDEV_BASE_URL = env.henrikdev.apiUrl;
// Removido variável não utilizada

// Agora vamos testar com a API real!
const USE_MOCK_DATA = false;

export interface HenrikDevPlayer {
  status: number;
  data: {
    puuid: string;
    region: string;
    account_level: number;
    name: string;
    tag: string;
    card: {
      small: string;
      large: string;
      wide: string;
    };
    last_update: string;
    last_update_raw: number;
  };
}

export interface HenrikDevMMR {
  status: number;
  data: {
    currenttier: number;
    currenttierpatched: string;
    images: {
      small: string;
      large: string;
      triangle_down: string;
      triangle_up: string;
    };
    ranking_in_tier: number;
    mmr_change_to_last_game: number;
    elo: number;
    name: string;
    tag: string;
    old: boolean;
  };
}

export interface HenrikDevMatch {
  status: number;
  data: {
    metadata: {
      map: string;
      game_version: string;
      game_length: number;
      game_start: number;
      game_start_patched: string;
      rounds_played: number;
      mode: string;
      mode_id: string;
      queue: string;
      season_id: string;
      platform: string;
      matchid: string;
      match_id?: string; // API v3 pode usar match_id
      premier_info: {
        tournament_id: string;
        matchup_id: string;
      };
      region: string;
      cluster: string;
    };
    players: {
      all_players: Array<{
        puuid: string;
        name: string;
        tag: string;
        team: string;
        level: number;
        character: string;
        currenttier: number;
        currenttierpatched: string;
        player_card: string;
        player_title: string;
        party_id: string;
        session_playtime: {
          minutes: number;
          seconds: number;
          milliseconds: number;
        };
        behavior: {
          afk_rounds: number;
          friendly_fire: {
            incoming: number;
            outgoing: number;
          };
          rounds_in_spawn: number;
        };
        platform: {
          type: string;
          os: {
            name: string;
            version: string;
          };
        };
        ability_casts: {
          c_cast: number;
          q_cast: number;
          e_cast: number;
          x_cast: number;
        };
        assets: {
          card: {
            small: string;
            large: string;
            wide: string;
          };
          agent: {
            small: string;
            full: string;
            bust: string;
            killfeed: string;
          };
        };
        stats: {
          score: number;
          kills: number;
          deaths: number;
          assists: number;
          bodyshots: number;
          headshots: number;
          legshots: number;
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
        damage_made: number;
        damage_received: number;
      }>;
      red: Array<{
        puuid: string;
        name: string;
        tag: string;
        team: string;
        level: number;
        character: string;
        currenttier: number;
        currenttierpatched: string;
        player_card: string;
        player_title: string;
        party_id: string;
        session_playtime: {
          minutes: number;
          seconds: number;
          milliseconds: number;
        };
        behavior: {
          afk_rounds: number;
          friendly_fire: {
            incoming: number;
            outgoing: number;
          };
          rounds_in_spawn: number;
        };
        platform: {
          type: string;
          os: {
            name: string;
            version: string;
          };
        };
        ability_casts: {
          c_cast: number;
          q_cast: number;
          e_cast: number;
          x_cast: number;
        };
        assets: {
          agent: {
            small: string;
            full: string;
            bust: string;
            killfeed: string;
          };
        };
        stats: {
          score: number;
          kills: number;
          deaths: number;
          assists: number;
          bodyshots: number;
          headshots: number;
          legshots: number;
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
        damage_made: number;
        damage_received: number;
      }>;
      blue: Array<{
        puuid: string;
        name: string;
        tag: string;
        team: string;
        level: number;
        character: string;
        currenttier: number;
        currenttierpatched: string;
        player_card: string;
        player_title: string;
        party_id: string;
        session_playtime: {
          minutes: number;
          seconds: number;
          milliseconds: number;
        };
        behavior: {
          afk_rounds: number;
          friendly_fire: {
            incoming: number;
            outgoing: number;
          };
          rounds_in_spawn: number;
        };
        platform: {
          type: string;
          os: {
            name: string;
            version: string;
          };
        };
        ability_casts: {
          c_cast: number;
          q_cast: number;
          e_cast: number;
          x_cast: number;
        };
        assets: {
          agent: {
            small: string;
            full: string;
            bust: string;
            killfeed: string;
          };
        };
        stats: {
          score: number;
          kills: number;
          deaths: number;
          assists: number;
          bodyshots: number;
          headshots: number;
          legshots: number;
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
        damage_made: number;
        damage_received: number;
      }>;
    };
    teams: {
      red: {
        has_won: boolean;
        rounds_won: number;
        rounds_played: number;
        team: string;
      };
      blue: {
        has_won: boolean;
        rounds_won: number;
        rounds_played: number;
        team: string;
      };
    };
    rounds: Array<{
      winning_team: string;
      end_type: string;
      bomb_planted: boolean;
      bomb_defused: boolean;
      plant_events: {
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
        player_locations_on_plant: Array<{
          player_puuid: string;
          player_display_name: string;
          player_team: string;
          location: {
            x: number;
            y: number;
          };
          view_radians: number;
        }>;
      };
      defuse_events: {
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
        player_locations_on_defuse: Array<{
          player_puuid: string;
          player_display_name: string;
          player_team: string;
          location: {
            x: number;
            y: number;
          };
          view_radians: number;
        }>;
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
  };
}

export class HenrikDevAPI {
  private static async fetchWithError(url: string): Promise<unknown> {
    try {
      const apiKey = env.henrikdev.apiKey;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Adicionar API key se disponível
      if (apiKey) {
        headers["Authorization"] = apiKey; // HenrikDev usa key direta, não Bearer
        console.log("🔑 API Key configurada:", apiKey.substring(0, 10) + "...");
      } else {
        console.log("⚠️ API Key não encontrada, usando acesso público");
      }

      console.log("🌐 Fazendo requisição para:", url);
      console.log("📋 Headers:", headers);
      console.log("🔗 URL Base:", HENRIKDEV_BASE_URL);
      console.log("🔗 URL Completa:", url);

      // Teste simples primeiro
      console.log("🧪 Testando fetch básico...");
      try {
        const testResponse = await fetch("https://httpbin.org/get");
        console.log("✅ Teste básico funcionou:", testResponse.status);
      } catch (testError) {
        console.error("❌ Teste básico falhou:", testError);
      }

      // Fazer requisição simples sem timeout
      const response = await fetch(url, {
        headers,
      });
      console.log("📡 Status da resposta:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro na API:", response.status, errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`,
        );
      }

      const data = await response.json();
      console.log("✅ Dados recebidos com sucesso");
      return data;
    } catch (error) {
      console.error("💥 Erro na API HenrikDev:", error);

      // Se for erro de rede, dar uma mensagem mais amigável
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("🔍 Detalhes do erro de rede:", error.message);
        throw new Error(
          "Erro de conexão. Verifique sua internet ou tente novamente.",
        );
      }

      // Se for timeout (removido por enquanto)
      // if (error.name === 'AbortError') {
      // 	throw new Error('Timeout na requisição. Tente novamente.');
      // }

      throw error;
    }
  }

  // Buscar dados do jogador
  static async getPlayer(
    name: string,
    tag: string,
    region: string = "na",
  ): Promise<HenrikDevPlayer> {
    if (USE_MOCK_DATA) {
      console.log("🎭 Usando dados mockados para jogador");
      return {
        status: 200,
        data: {
          puuid: "mock-puuid",
          region: region,
          account_level: 156,
          name: name,
          tag: tag,
          card: {
            small:
              "https://media.valorant-api.com/playercards/9fb348bc-41a0-91ad-8a3e-818035c4e105/displayicon.png",
            large:
              "https://media.valorant-api.com/playercards/9fb348bc-41a0-91ad-8a3e-818035c4e105/displayicon.png",
            wide: "https://media.valorant-api.com/playercards/9fb348bc-41a0-91ad-8a3e-818035c4e105/displayicon.png",
          },
          last_update: new Date().toISOString(),
          last_update_raw: Math.floor(Date.now() / 1000),
        },
      };
    }

    try {
      // Usar API route para evitar CORS
      const url = `/api/valorant/player?name=${encodeURIComponent(
        name,
      )}&tag=${encodeURIComponent(tag)}&region=${region}`;
      console.log("🎯 URL da API route:", url);
      console.log("📝 Parâmetros:", { name, tag, region });

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro na API route:", response.status, errorText);

        if (response.status === 404) {
          throw new Error(
            `Jogador ${name}#${tag} não encontrado. Verifique o nome e tag.`,
          );
        }

        throw new Error(`Erro na API: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (!data.player) {
        throw new Error("Dados do jogador não encontrados na resposta");
      }

      return data.player;
    } catch (error) {
      console.error("💥 Erro ao buscar jogador:", error);
      throw error;
    }
  }

  // Buscar MMR/Rank do jogador
  static async getMMR(
    name: string,
    tag: string,
    region: string = "na",
  ): Promise<HenrikDevMMR> {
    if (USE_MOCK_DATA) {
      console.log("🎭 Usando dados mockados para MMR");
      return {
        status: 200,
        data: {
          currenttier: 15,
          currenttierpatched: "Diamond 3",
          images: {
            small:
              "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a5db9e5b2/15/smallicon.png",
            large:
              "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a5db9e5b2/15/largeicon.png",
            triangle_down:
              "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a5db9e5b2/15/ranktriangledownicon.png",
            triangle_up:
              "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a5db9e5b2/15/ranktriangleupicon.png",
          },
          ranking_in_tier: 5,
          mmr_change_to_last_game: 25,
          elo: 1945,
          name: name,
          tag: tag,
          old: false,
        },
      };
    }

    try {
      // Usar API route para evitar CORS
      const url = `/api/valorant/player?name=${encodeURIComponent(
        name,
      )}&tag=${encodeURIComponent(tag)}&region=${region}`;
      console.log("🎯 URL da API route (MMR):", url);
      console.log("📝 Parâmetros:", { name, tag, region });

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "❌ Erro na API route (MMR):",
          response.status,
          errorText,
        );

        if (response.status === 404) {
          throw new Error(
            `Jogador ${name}#${tag} não encontrado. Verifique o nome e tag.`,
          );
        }

        throw new Error(`Erro na API: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (!data.mmr) {
        throw new Error(
          "Dados de MMR não encontrados. O jogador pode não ter jogado partidas competitivas.",
        );
      }

      return data.mmr;
    } catch (error) {
      console.error("💥 Erro ao buscar MMR:", error);
      throw error;
    }
  }

  // Buscar histórico de partidas
  static async getMatches(
    name: string,
    tag: string,
    region: string = "na",
    mode: string = "competitive",
    size: number = 10,
  ): Promise<HenrikDevMatch[]> {
    if (USE_MOCK_DATA) {
      console.log("🎭 Usando dados mockados para partidas");
      return [
        {
          status: 200,
          data: {
            metadata: {
              map: "Ascent",
              game_version: "7.0",
              game_length: 1680,
              game_start: Math.floor(Date.now() / 1000) - 3600,
              game_start_patched: new Date(Date.now() - 3600000).toISOString(),
              rounds_played: 24,
              mode: "competitive",
              mode_id: "competitive",
              queue: "competitive",
              season_id: "current",
              platform: "PC",
              matchid: "mock-match-1",
              premier_info: { tournament_id: "", matchup_id: "" },
              region: region,
              cluster: region,
            },
            players: {
              all_players: [
                {
                  puuid: "mock-puuid",
                  name: name,
                  tag: tag,
                  team: "Red",
                  level: 156,
                  character: "Jett",
                  currenttier: 15,
                  currenttierpatched: "Diamond 3",
                  player_card:
                    "https://media.valorant-api.com/playercards/9fb348bc-41a0-91ad-8a3e-818035c4e105/displayicon.png",
                  player_title: "Mock Title",
                  party_id: "mock-party",
                  session_playtime: {
                    minutes: 120,
                    seconds: 0,
                    milliseconds: 0,
                  },
                  behavior: {
                    afk_rounds: 0,
                    friendly_fire: { incoming: 0, outgoing: 0 },
                    rounds_in_spawn: 0,
                  },
                  platform: {
                    type: "PC",
                    os: { name: "Windows", version: "10" },
                  },
                  ability_casts: {
                    c_cast: 5,
                    q_cast: 8,
                    e_cast: 12,
                    x_cast: 2,
                  },
                  assets: {
                    card: { small: "", large: "", wide: "" },
                    agent: { small: "", full: "", bust: "", killfeed: "" },
                  },
                  stats: {
                    score: 250,
                    kills: 18,
                    deaths: 12,
                    assists: 4,
                    bodyshots: 5,
                    headshots: 8,
                    legshots: 5,
                  },
                  economy: {
                    spent: { overall: 45000, average: 1875 },
                    loadout_value: { overall: 48000, average: 2000 },
                  },
                  damage_made: 2456,
                  damage_received: 1890,
                },
              ],
              red: [],
              blue: [],
            },
            teams: {
              red: {
                has_won: true,
                rounds_won: 13,
                rounds_played: 24,
                team: "Red",
              },
              blue: {
                has_won: false,
                rounds_won: 11,
                rounds_played: 24,
                team: "Blue",
              },
            },
            rounds: [],
            kills: [
              {
                kill_time_in_round: 15000,
                kill_time_in_match: 15000,
                killer_puuid: "mock-puuid",
                killer_display_name: name,
                killer_team: "Red",
                victim_puuid: "mock-victim-1",
                victim_display_name: "Mock Victim 1",
                victim_team: "Blue",
                victim_death_location: { x: 100, y: 200 },
                damage_weapon_id: "mock-weapon-1",
                damage_weapon_name: "Vandal",
                secondary_fire_mode: false,
                player_locations_on_kill: [
                  {
                    player_puuid: "mock-puuid",
                    player_display_name: name,
                    player_team: "Red",
                    location: { x: 100, y: 200 },
                    view_radians: 0,
                  },
                ],
                assistants: [],
              },
              {
                kill_time_in_round: 45000,
                kill_time_in_match: 45000,
                killer_puuid: "mock-victim-1",
                killer_display_name: "Mock Victim 1",
                killer_team: "Blue",
                victim_puuid: "mock-puuid",
                victim_display_name: name,
                victim_team: "Red",
                victim_death_location: { x: 150, y: 250 },
                damage_weapon_id: "mock-weapon-2",
                damage_weapon_name: "Phantom",
                secondary_fire_mode: false,
                player_locations_on_kill: [
                  {
                    player_puuid: "mock-victim-1",
                    player_display_name: "Mock Victim 1",
                    player_team: "Blue",
                    location: { x: 150, y: 250 },
                    view_radians: 0,
                  },
                ],
                assistants: [],
              },
            ],
          },
        },
      ];
    }

    try {
      // Usar API route para evitar CORS
      const url = `/api/valorant/player?name=${encodeURIComponent(
        name,
      )}&tag=${encodeURIComponent(tag)}&region=${region}`;
      console.log("🎯 URL da API route (Matches):", url);
      console.log("📝 Parâmetros:", { name, tag, region, mode, size });

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "❌ Erro na API route (Matches):",
          response.status,
          errorText,
        );

        if (response.status === 404) {
          throw new Error(
            `Jogador ${name}#${tag} não encontrado. Verifique o nome e tag.`,
          );
        }

        throw new Error(`Erro na API: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (!data.matches) {
        return [];
      }

      return data.matches;
    } catch (error) {
      console.error("💥 Erro ao buscar partidas:", error);
      throw error;
    }
  }

  // Buscar partida específica
  static async getMatch(matchId: string): Promise<unknown> {
    const url = `${HENRIKDEV_BASE_URL}/match/${matchId}`;
    return this.fetchWithError(url);
  }

  // Buscar dados de performance do jogador
  static async getPlayerStats(
    name: string,
    tag: string,
    region: string = "na",
  ): Promise<unknown> {
    const url = `${HENRIKDEV_BASE_URL}/stats/${region}/${name}/${tag}`;
    return this.fetchWithError(url);
  }

  // Buscar dados de leaderboard
  static async getLeaderboard(
    region: string = "na",
    act: string = "current",
  ): Promise<unknown> {
    const url = `${HENRIKDEV_BASE_URL}/leaderboard/${region}?act=${act}`;
    return this.fetchWithError(url);
  }
}

// Funções utilitárias para processar dados
export function processPlayerData(
  playerData: HenrikDevPlayer,
  mmrData: HenrikDevMMR,
) {
  return {
    name: playerData.data.name,
    tag: playerData.data.tag,
    level: playerData.data.account_level,
    rank: mmrData.data.currenttierpatched,
    elo: mmrData.data.elo,
    rankImage: mmrData.data.images.large,
    cardImage: playerData.data.card.large,
    lastUpdate: new Date(playerData.data.last_update_raw * 1000),
  };
}

export function processMatchData(match: any, playerName: string) {
  // API v3 retorna uma estrutura mais simples
  // Verificar se temos os dados necessários
  if (!match || !match.metadata) {
    console.log("❌ Dados da partida inválidos:", match);
    return null;
  }

  // Na API v3, os dados do jogador podem estar em uma estrutura diferente
  // Vamos procurar o jogador nos dados disponíveis
  const player = match.players?.all_players?.find(
    (p: any) => p.name.toLowerCase().trim() === playerName.toLowerCase().trim(),
  );

  if (!player) {
    console.log("❌ Jogador não encontrado na partida:", playerName);
    return null;
  }

  return {
    id: match.metadata.matchid || match.metadata.match_id,
    map: match.metadata.map,
    mode: match.metadata.mode,
    agent: player.character,
    result: match.teams?.red?.has_won
      ? player.team === "Red"
        ? "win"
        : "loss"
      : player.team === "Blue"
        ? "win"
        : "loss",
    score: match.teams
      ? `${match.teams.red?.rounds_won || 0}-${
          match.teams.blue?.rounds_won || 0
        }`
      : "0-0",
    kills: player.stats?.kills || 0,
    deaths: player.stats?.deaths || 0,
    assists: player.stats?.assists || 0,
    headshots: player.stats?.headshots || 0,
    damage: player.damage_made || 0,
    rounds_played: match.metadata.rounds_played || 0,
    date: new Date(
      (match.metadata.game_start || match.metadata.game_start_patched) * 1000,
    ),
    duration: Math.round((match.metadata.game_length || 0) / 60),
  };
}
