"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import styles from "./page.module.scss";
import { calculateFKandFD, calculateMK } from "@/utils/matchCalculations";

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

export default function MatchDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("scoreboard");
  const [sortBy, setSortBy] = useState("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [tableView, setTableView] = useState<"total" | "teams">("total");

  const matchId = params.matchId as string;
  const region = searchParams.get("region") || "na";

  // Busca os detalhes da partida
  useEffect(() => {
    console.log("matchDetails:", matchDetails);
    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/valorant/match/${matchId}?region=${region}`,
        );

        // Verifica se a resposta é ok
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Erro ao buscar detalhes da partida",
          );
        }

        // Converte a resposta para o tipo MatchDetails
        const data = await response.json();
        setMatchDetails(data.match);
      } catch (err) {
        // Loga o erro
        console.error("Erro ao buscar detalhes da partida:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    // Verifica se o matchId é válido
    if (matchId) {
      fetchMatchDetails();
    }
  }, [matchId, region]);

  // Salva os dados de FK, FD e MK
  const fkAndFD = calculateFKandFD(matchDetails?.kills || []);
  const mk = calculateMK(matchDetails?.kills || []);

  // Verifica se ainda está carregando
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando detalhes da partida...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>❌ Erro</h2>
          <p>{error}</p>
          <button onClick={() => window.history.back()}>Voltar</button>
        </div>
      </div>
    );
  }

  // Verifica se não há detalhes da partida
  if (!matchDetails) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>❌ Partida não encontrada</h2>
          <p>Não foi possível encontrar os detalhes desta partida.</p>
          <button onClick={() => window.history.back()}>Voltar</button>
        </div>
      </div>
    );
  }

  // Formata a duração para o formato mm:ss
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Formata a data para o formato brasileiro
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  // Redireciona para a página de MMR com os parâmetros pré-preenchidos
  const handlePlayerClick = (playerName: string, playerTag: string) => {
    const encodedName = encodeURIComponent(playerName);
    const encodedTag = encodeURIComponent(playerTag);
    // Redireciona para a página de MMR com os parâmetros pré-preenchidos
    window.location.href = `/mmr?name=${encodedName}&tag=${encodedTag}&region=${region}`;
  };

  // Função para calcular estatísticas adicionais do jogador
  const calculatePlayerStats = (player: MatchDetails["players"][0]) => {
    const kd =
      player.stats.deaths > 0
        ? player.stats.kills / player.stats.deaths
        : player.stats.kills;
    const kdDiff = player.stats.kills - player.stats.deaths;
    const totalShots =
      player.stats.headshots + player.stats.bodyshots + player.stats.legshots;
    const hsPercentage =
      totalShots > 0
        ? Math.round((player.stats.headshots / totalShots) * 100)
        : 0;
    const adr = matchDetails?.rounds?.length
      ? Math.round(player.stats.damage.dealt / matchDetails.rounds.length)
      : 0;

    return {
      kd: kd.toFixed(1),
      kdDiff,
      hsPercentage,
      adr,
      totalShots,
    };
  };

  // Função para ordenar jogadores
  const sortPlayers = (players: MatchDetails["players"]) => {
    return [...players].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortBy) {
        case "score":
          aValue = a.stats.score;
          bValue = b.stats.score;
          break;
        case "kills":
          aValue = a.stats.kills;
          bValue = b.stats.kills;
          break;
        case "deaths":
          aValue = a.stats.deaths;
          bValue = b.stats.deaths;
          break;
        case "assists":
          aValue = a.stats.assists;
          bValue = b.stats.assists;
          break;
        case "kd":
          aValue =
            a.stats.deaths > 0 ? a.stats.kills / a.stats.deaths : a.stats.kills;
          bValue =
            b.stats.deaths > 0 ? b.stats.kills / b.stats.deaths : b.stats.kills;
          break;
        case "hs":
          const aTotalShots =
            a.stats.headshots + a.stats.bodyshots + a.stats.legshots;
          const bTotalShots =
            b.stats.headshots + b.stats.bodyshots + b.stats.legshots;
          aValue =
            aTotalShots > 0 ? (a.stats.headshots / aTotalShots) * 100 : 0;
          bValue =
            bTotalShots > 0 ? (b.stats.headshots / bTotalShots) * 100 : 0;
          break;
        case "damage":
          aValue = a.stats.damage.dealt;
          bValue = b.stats.damage.dealt;
          break;
        default:
          aValue = a.stats.score;
          bValue = b.stats.score;
      }

      return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
    });
  };

  // Verificar se temos dados de jogadores válidos
  const allPlayers = matchDetails.players || [];
  const sortedPlayers = sortPlayers(allPlayers);

  const redTeam = sortedPlayers.filter((player) => player.team_id === "Red");
  const blueTeam = sortedPlayers.filter((player) => player.team_id === "Blue");

  const redTeamScore =
    matchDetails.teams?.find((team) => team.team_id === "Red")?.rounds?.won ||
    0;
  const blueTeamScore =
    matchDetails.teams?.find((team) => team.team_id === "Blue")?.rounds?.won ||
    0;
  const redTeamWon =
    matchDetails.teams?.find((team) => team.team_id === "Red")?.won || false;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => window.history.back()}
          className={styles.backButton}
        >
          ← Voltar
        </button>
        <h1>Detalhes da Partida</h1>
      </div>

      {/* Match Header */}
      <div className={styles.matchHeader}>
        <div className={styles.matchInfo}>
          <div className={styles.matchTitle}>
            <h2>{matchDetails.metadata?.map?.name || "Mapa Desconhecido"}</h2>
            <span className={styles.matchMode}>
              {matchDetails.metadata?.queue?.name || "Modo Desconhecido"}
            </span>
          </div>
          <div className={styles.matchScore}>
            <span className={styles.teamName}>Time A</span>
            <span className={styles.score}>
              {redTeamScore} : {blueTeamScore}
            </span>
            <span className={styles.teamName}>Time B</span>
          </div>
          <div className={styles.matchDetails}>
            <span>
              {formatDate(
                matchDetails.metadata?.started_at || new Date().toISOString(),
              )}
            </span>
            <span>•</span>
            <span>
              {formatDuration(matchDetails.metadata?.game_length_in_ms || 0)}
            </span>
            <span>•</span>
            <span>Platinum II</span>
          </div>
        </div>
        <div className={styles.matchActions}>
          <button className={styles.actionButton}>Abrir em Nova Aba</button>
          <button className={styles.actionButton}>Copiar Link</button>
          <button className={styles.closeButton}>×</button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "scoreboard" ? styles.active : ""}`}
          onClick={() => setActiveTab("scoreboard")}
        >
          Scoreboard
        </button>
        <button
          className={`${styles.tab} ${activeTab === "performance" ? styles.active : ""}`}
          onClick={() => setActiveTab("performance")}
        >
          Performance
        </button>
        <button
          className={`${styles.tab} ${activeTab === "economy" ? styles.active : ""}`}
          onClick={() => setActiveTab("economy")}
        >
          Economy
        </button>
        <button
          className={`${styles.tab} ${activeTab === "rounds" ? styles.active : ""}`}
          onClick={() => setActiveTab("rounds")}
        >
          Rounds
        </button>
        <button
          className={`${styles.tab} ${activeTab === "duels" ? styles.active : ""}`}
          onClick={() => setActiveTab("duels")}
        >
          Duels
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === "scoreboard" && (
          <div className={styles.scoreboardTab}>
            {/* Round History */}
            <div className={styles.roundHistory}>
              <div className={styles.roundHistoryHeader}>
                <h4>Histórico de Rounds</h4>
                <span className={styles.roundCount}>
                  {matchDetails.rounds?.length || 0} rounds
                </span>
              </div>
              <div className={styles.roundHistoryGrid}>
                <div className={styles.roundHistoryRow}>
                  <div className={styles.teamLabel}>Time A</div>
                  <div className={styles.roundIconsContainer}>
                    {(matchDetails.rounds || []).map((round, i) => {
                      const isWin = round?.winning_team === "Red";
                      return (
                        <div
                          key={i}
                          className={`${styles.roundIcon} ${isWin ? styles.win : styles.loss}`}
                          title={`Round ${i + 1}: ${isWin ? "Vitória" : "Derrota"}`}
                        >
                          {isWin ? "✓" : "✗"}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={styles.roundHistoryRow}>
                  <div className={styles.teamLabel}></div>
                  <div className={styles.roundNumbersContainer}>
                    {(matchDetails.rounds || []).map((_, i) => (
                      <span key={i} className={styles.roundNumber}>
                        {i + 1}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.roundHistoryRow}>
                  <div className={styles.teamLabel}>Time B</div>
                  <div className={styles.roundIconsContainer}>
                    {(matchDetails.rounds || []).map((round, i) => {
                      const isWin = round?.winning_team === "Blue";
                      return (
                        <div
                          key={i}
                          className={`${styles.roundIcon} ${isWin ? styles.win : styles.loss}`}
                          title={`Round ${i + 1}: ${isWin ? "Vitória" : "Derrota"}`}
                        >
                          {isWin ? "✓" : "✗"}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* View Controls */}
            <div className={styles.viewControls}>
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewButton} ${tableView === "total" ? styles.active : ""}`}
                  onClick={() => setTableView("total")}
                >
                  <span className={styles.viewIcon}>📊</span>
                  Scoreboard Geral
                </button>
                <button
                  className={`${styles.viewButton} ${tableView === "teams" ? styles.active : ""}`}
                  onClick={() => setTableView("teams")}
                >
                  <span className={styles.viewIcon}>🏆</span>
                  Por Times
                </button>
              </div>
            </div>

            {/* Sort Controls */}
            <div className={styles.sortControls}>
              <div className={styles.sortGroup}>
                <label>Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.sortSelect}
                >
                  <option value="score">Score</option>
                  <option value="kills">Kills</option>
                  <option value="deaths">Deaths</option>
                  <option value="assists">Assists</option>
                  <option value="kd">K/D</option>
                  <option value="hs">HS%</option>
                  <option value="damage">Damage</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                  }
                  className={styles.sortButton}
                >
                  {sortOrder === "desc" ? "↓" : "↑"}
                </button>
              </div>
            </div>

            {/* Scoreboard Table */}
            <div className={styles.scoreboardTable}>
              {tableView === "total" ? (
                // Scoreboard Total - Todos os jogadores juntos
                <table>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>TRS</th>
                      <th>ACS</th>
                      <th>K</th>
                      <th>D</th>
                      <th>A</th>
                      <th>+/-</th>
                      <th>K/D</th>
                      <th>ADR</th>
                      <th>HS%</th>
                      <th>KAST</th>
                      <th>FK</th>
                      <th>FD</th>
                      <th>MK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPlayers.map((player, index) => {
                      const stats = calculatePlayerStats(player);
                      return (
                        <tr
                          key={player.puuid}
                          className={
                            player.team_id === "Red"
                              ? styles.redTeam
                              : styles.blueTeam
                          }
                        >
                          <td
                            className={styles.playerCell}
                            onClick={() =>
                              handlePlayerClick(player.name, player.tag)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <div className={styles.playerInfo}>
                              <img
                                src={`https://media.valorant-api.com/agents/${player.agent?.id}/displayicon.png`}
                                alt={player.agent?.name}
                                className={styles.agentIcon}
                              />
                              <div>
                                <div className={styles.playerName}>
                                  {player.name}#{player.tag}
                                </div>
                                <div className={styles.playerRank}>
                                  {player.tier?.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{player.stats.score}</td>
                          <td>
                            {Math.round(
                              player.stats.score /
                                (matchDetails.rounds?.length || 1),
                            )}
                          </td>
                          <td>{player.stats.kills}</td>
                          <td>{player.stats.deaths}</td>
                          <td>{player.stats.assists}</td>
                          <td
                            className={
                              stats.kdDiff >= 0
                                ? styles.positive
                                : styles.negative
                            }
                          >
                            {stats.kdDiff >= 0 ? "+" : ""}
                            {stats.kdDiff}
                          </td>
                          <td>{stats.kd}</td>
                          <td>{stats.adr}</td>
                          <td>{stats.hsPercentage}%</td>
                          <td>75%</td>
                          <td>{fkAndFD.fkCount[player.puuid] || 0}</td>
                          <td>{fkAndFD.fdCount[player.puuid] || 0}</td>
                          <td>{mk[player.puuid] || 0}</td>
                          <td></td>
                          <td>-</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                // Por Times - Times separados
                <div className={styles.teamsScoreboard}>
                  {/* Time A */}
                  <div className={styles.teamScoreboard}>
                    <div className={styles.teamHeader}>
                      <h4>Time A ({redTeamScore} rounds)</h4>
                      <span
                        className={redTeamWon ? styles.winner : styles.loser}
                      >
                        {redTeamWon ? "🏆 Vencedor" : "❌ Perdedor"}
                      </span>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>TRS</th>
                          <th>ACS</th>
                          <th>K</th>
                          <th>D</th>
                          <th>A</th>
                          <th>+/-</th>
                          <th>K/D</th>
                          <th>ADR</th>
                          <th>HS%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortPlayers(redTeam).map((player, index) => {
                          const stats = calculatePlayerStats(player);
                          return (
                            <tr key={player.puuid} className={styles.redTeam}>
                              <td
                                className={styles.playerCell}
                                onClick={() =>
                                  handlePlayerClick(player.name, player.tag)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <div className={styles.playerInfo}>
                                  <img
                                    src={`https://media.valorant-api.com/agents/${player.agent?.id}/displayicon.png`}
                                    alt={player.agent?.name}
                                    className={styles.agentIcon}
                                  />
                                  <div>
                                    <div className={styles.playerName}>
                                      {player.name}#{player.tag}
                                    </div>
                                    <div className={styles.playerRank}>
                                      {player.tier?.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>{player.stats.score}</td>
                              <td>
                                {Math.round(
                                  player.stats.score /
                                    (matchDetails.rounds?.length || 1),
                                )}
                              </td>
                              <td>{player.stats.kills}</td>
                              <td>{player.stats.deaths}</td>
                              <td>{player.stats.assists}</td>
                              <td
                                className={
                                  stats.kdDiff >= 0
                                    ? styles.positive
                                    : styles.negative
                                }
                              >
                                {stats.kdDiff >= 0 ? "+" : ""}
                                {stats.kdDiff}
                              </td>
                              <td>{stats.kd}</td>
                              <td>{stats.adr}</td>
                              <td>{stats.hsPercentage}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Time B */}
                  <div className={styles.teamScoreboard}>
                    <div className={styles.teamHeader}>
                      <h4>Time B ({blueTeamScore} rounds)</h4>
                      <span
                        className={!redTeamWon ? styles.winner : styles.loser}
                      >
                        {!redTeamWon ? "🏆 Vencedor" : "❌ Perdedor"}
                      </span>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>TRS</th>
                          <th>ACS</th>
                          <th>K</th>
                          <th>D</th>
                          <th>A</th>
                          <th>+/-</th>
                          <th>K/D</th>
                          <th>ADR</th>
                          <th>HS%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortPlayers(blueTeam).map((player, index) => {
                          const stats = calculatePlayerStats(player);
                          return (
                            <tr key={player.puuid} className={styles.blueTeam}>
                              <td
                                className={styles.playerCell}
                                onClick={() =>
                                  handlePlayerClick(player.name, player.tag)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <div className={styles.playerInfo}>
                                  <img
                                    src={`https://media.valorant-api.com/agents/${player.agent?.id}/displayicon.png`}
                                    alt={player.agent?.name}
                                    className={styles.agentIcon}
                                  />
                                  <div>
                                    <div className={styles.playerName}>
                                      {player.name}#{player.tag}
                                    </div>
                                    <div className={styles.playerRank}>
                                      {player.tier?.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>{player.stats.score}</td>
                              <td>
                                {Math.round(
                                  player.stats.score /
                                    (matchDetails.rounds?.length || 1),
                                )}
                              </td>
                              <td>{player.stats.kills}</td>
                              <td>{player.stats.deaths}</td>
                              <td>{player.stats.assists}</td>
                              <td
                                className={
                                  stats.kdDiff >= 0
                                    ? styles.positive
                                    : styles.negative
                                }
                              >
                                {stats.kdDiff >= 0 ? "+" : ""}
                                {stats.kdDiff}
                              </td>
                              <td>{stats.kd}</td>
                              <td>{stats.adr}</td>
                              <td>{stats.hsPercentage}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "rounds" && (
          <div className={styles.roundsTab}>
            <div className={styles.roundsList}>
              {(matchDetails.rounds || []).map((round, index) => (
                <div key={index} className={styles.round}>
                  <div className={styles.roundHeader}>
                    <span className={styles.roundNumber}>
                      Round {index + 1}
                    </span>
                    <span
                      className={`${styles.roundWinner} ${
                        round.winning_team === "Red"
                          ? styles.redTeam
                          : styles.blueTeam
                      }`}
                    >
                      {round.winning_team === "Red" ? "Vermelho" : "Azul"}{" "}
                      venceu
                    </span>
                    <span className={styles.roundType}>{round.end_type}</span>
                  </div>
                  {round.bomb_planted &&
                    round.plant_events?.planted_by?.display_name && (
                      <div className={styles.bombInfo}>
                        <span>
                          💣 Bomba plantada por{" "}
                          {round.plant_events.planted_by.display_name}
                        </span>
                      </div>
                    )}
                  {round.bomb_defused &&
                    round.defuse_events?.defused_by?.display_name && (
                      <div className={styles.bombInfo}>
                        <span>
                          ✂️ Bomba defusada por{" "}
                          {round.defuse_events.defused_by.display_name}
                        </span>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === "performance" ||
          activeTab === "economy" ||
          activeTab === "duels") && (
          <div className={styles.comingSoon}>
            <h3>🚧 Em Desenvolvimento</h3>
            <p>Esta aba será implementada em breve!</p>
          </div>
        )}
      </div>
    </div>
  );
}
