"use client";

import React, { useState, useEffect } from "react";
import {
  HenrikDevAPI,
  processPlayerData,
  processMatchData,
  HenrikDevMatch,
} from "../../lib/henrikdev-api";
import { valorantCache } from "../../lib/cache";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";
import styles from "./page.module.scss";
import LoadingSpinner from "@/components/LoadingSpinner";

interface PlayerData {
  name: string;
  tag: string;
  level: number;
  rank: string;
  elo: number;
  rankImage: string;
  cardImage: string;
  lastUpdate: Date;
}

interface MatchData {
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

export default function PlayerSearch() {
  const [searchInput, setSearchInput] = useState("");
  const [region, setRegion] = useState("na");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "matches" | "stats">(
    "overview",
  );
  const [dataFromCache, setDataFromCache] = useState(false);

  // Função para executar busca diretamente com parâmetros
  const performSearch = async (
    name: string,
    tag: string,
    searchRegion: string,
  ) => {
    setLoading(true);
    setError("");
    setPlayerData(null);
    setMatches([]);

    try {
      console.log(
        "🔍 Buscando jogador:",
        name,
        tag,
        "na região:",
        searchRegion,
      );

      // Primeiro, verificar se há dados em cache
      const cachedData = valorantCache.getPlayerData(name, tag, searchRegion);

      if (cachedData) {
        console.log("📖 Usando dados do cache para:", name, tag);

        // Processar dados do cache
        const processedPlayer = processPlayerData(
          cachedData.player,
          cachedData.mmr,
        );
        setPlayerData(processedPlayer);

        const processedMatches = cachedData.matches
          .map((match: HenrikDevMatch) => processMatchData(match, name))
          .filter(Boolean) as MatchData[];

        setMatches(processedMatches);
        setLoading(false);
        return;
      }

      console.log("🌐 Dados não encontrados no cache, buscando na API...");

      // Buscar dados do jogador e MMR
      const [playerResponse, mmrResponse] = await Promise.all([
        HenrikDevAPI.getPlayer(name, tag, searchRegion),
        HenrikDevAPI.getMMR(name, tag, searchRegion),
      ]);

      // Processar dados do jogador
      const processedPlayer = processPlayerData(playerResponse, mmrResponse);
      setPlayerData(processedPlayer);

      // Buscar partidas recentes
      const matchesResponse = await HenrikDevAPI.getMatches(
        name,
        tag,
        searchRegion,
        "competitive",
        5,
      );

      const processedMatches = matchesResponse
        .map((match: HenrikDevMatch) => processMatchData(match, name))
        .filter(Boolean) as MatchData[];

      setMatches(processedMatches);

      // Salvar dados no cache
      const cacheData = {
        player: playerResponse,
        mmr: mmrResponse,
        matches: matchesResponse,
        region: searchRegion,
      };

      valorantCache.setPlayerData(name, tag, searchRegion, cacheData);
      console.log("💾 Dados salvos no cache para:", name, tag);

      // Marcar que os dados vieram da API (não do cache)
      setDataFromCache(false);
    } catch (err: unknown) {
      console.error("❌ Erro na busca automática:", err);
      setError(err instanceof Error ? err.message : "Erro ao buscar jogador");
    } finally {
      setLoading(false);
    }
  };

  // Ler parâmetros da URL ao carregar a página
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const nameParam = urlParams.get("name");
    const tagParam = urlParams.get("tag");
    const regionParam = urlParams.get("region");

    if (nameParam && tagParam) {
      // Preencher o input com o nome e tag da URL
      setSearchInput(`${nameParam}#${tagParam}`);

      // Atualizar a região se fornecida
      if (regionParam) {
        setRegion(regionParam);
      }

      // Verificar cache primeiro
      const cachedData = valorantCache.getPlayerData(
        nameParam,
        tagParam,
        regionParam || region,
      );

      if (cachedData) {
        console.log("📖 Carregando dados do cache para:", nameParam, tagParam);

        // Processar dados do cache
        const processedPlayer = processPlayerData(
          cachedData.player,
          cachedData.mmr,
        );
        setPlayerData(processedPlayer);

        const processedMatches = cachedData.matches
          .map((match: HenrikDevMatch) => processMatchData(match, nameParam))
          .filter(Boolean) as MatchData[];

        setMatches(processedMatches);
        setDataFromCache(true);
      } else {
        // Se não há cache, fazer busca na API após um pequeno delay
        const timer = setTimeout(() => {
          performSearch(nameParam, tagParam, regionParam || region);
        }, 500);

        return () => clearTimeout(timer);
      }
    }
  }, []); // Executar apenas uma vez ao montar o componente

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    setLoading(true);
    setError("");
    setPlayerData(null);
    setMatches([]);

    try {
      // Parse Riot ID (Name#Tag)
      const [name, tag] = searchInput.split("#");
      if (!name || !tag) {
        throw new Error("Formato inválido. Use: Nome#TAG");
      }

      console.log("🔍 Buscando jogador:", name, tag, "na região:", region);

      // Primeiro, verificar se há dados em cache
      const cachedData = valorantCache.getPlayerData(name, tag, region);

      if (cachedData) {
        console.log("📖 Usando dados do cache para:", name, tag);

        // Processar dados do cache
        const processedPlayer = processPlayerData(
          cachedData.player,
          cachedData.mmr,
        );
        setPlayerData(processedPlayer);

        const processedMatches = cachedData.matches
          .map((match: HenrikDevMatch) => processMatchData(match, name))
          .filter(Boolean) as MatchData[];

        setMatches(processedMatches);
        setDataFromCache(true);
        setLoading(false);
        return;
      }

      console.log("🌐 Dados não encontrados no cache, buscando na API...");

      // Buscar dados do jogador e MMR
      const [playerResponse, mmrResponse] = await Promise.all([
        HenrikDevAPI.getPlayer(name, tag, region),
        HenrikDevAPI.getMMR(name, tag, region),
      ]);

      // Processar dados do jogador
      const processedPlayer = processPlayerData(playerResponse, mmrResponse);
      setPlayerData(processedPlayer);

      // Buscar partidas recentes
      const matchesResponse = await HenrikDevAPI.getMatches(
        name,
        tag,
        region,
        "competitive",
        5,
      );

      const processedMatches = matchesResponse
        .map((match: HenrikDevMatch) => processMatchData(match, name))
        .filter(Boolean) as MatchData[];

      setMatches(processedMatches);

      // Salvar dados no cache
      const cacheData = {
        player: playerResponse,
        mmr: mmrResponse,
        matches: matchesResponse,
        region: region,
      };

      valorantCache.setPlayerData(name, tag, region, cacheData);
      console.log("💾 Dados salvos no cache para:", name, tag);

      // Marcar que os dados vieram da API (não do cache)
      setDataFromCache(false);
    } catch (err: unknown) {
      console.error("❌ Erro na busca:", err);
      setError(err instanceof Error ? err.message : "Erro ao buscar jogador");
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "win":
        return styles.win;
      case "loss":
        return styles.loss;
      default:
        return styles.draw;
    }
  };

  const getResultEmoji = (result: string) => {
    switch (result) {
      case "win":
        return "✅";
      case "loss":
        return "❌";
      default:
        return "🤝";
    }
  };

  // Calcula o ADR (Average Damage per Round)
  const calculateADR = (damage: number, rounds: number): number => {
    return Math.round(damage / Math.max(rounds, 1));
  };

  // Calcula o ADS (Average Deaths per Round)
  const calculateADS = (deaths: number, rounds: number): number => {
    return Number((deaths / Math.max(rounds, 1)).toFixed(2));
  };

  // Calcula o ACS (Average Combat Score)
  const calculateACS = (
    damage: number,
    kills: number,
    rounds: number,
  ): number => {
    // Fórmula aproximada do ACS:
    // (Dano total / Rounds) + (50 * Kills / Rounds)
    const damagePerRound = damage / Math.max(rounds, 1);
    const killScore = (50 * kills) / Math.max(rounds, 1);
    return Math.round(damagePerRound + killScore);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🔍 Buscar Jogador</h1>
        <p>Encontre estatísticas detalhadas de qualquer jogador do Valorant</p>
      </div>

      {/* Search Form */}
      <div className={styles.searchForm}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Nome#TAG (ex: TenZ#1337)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={styles.searchInput}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={styles.regionSelect}
          >
            <option value="na">América do Norte</option>
            <option value="eu">Europa</option>
            <option value="ap">Ásia-Pacífico</option>
            <option value="kr">Coreia</option>
            <option value="br">Brasil</option>
            <option value="latam">América Latina</option>
          </select>
          <button
            onClick={handleSearch}
            disabled={loading || !searchInput.trim()}
            className={styles.searchButton}
          >
            {loading ? "🔍 Buscando..." : "🔍 Buscar"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className={styles.error}>❌ {error}</div>}

      {/* Cache Status */}
      {playerData && (
        <div className={styles.cacheStatus}>
          {dataFromCache ? (
            <div className={styles.cacheInfo}>
              <span className={styles.cacheIcon}>📖</span>
              <span>Dados carregados do cache</span>
              <button
                onClick={() => {
                  if (playerData) {
                    const [name, tag] = searchInput.split("#");
                    if (name && tag) {
                      // Limpar cache e buscar novamente
                      valorantCache.clearAllCache();
                      setDataFromCache(false);
                      performSearch(name, tag, region);
                    }
                  }
                }}
                className={styles.refreshButton}
              >
                🔄 Atualizar
              </button>
            </div>
          ) : (
            <div className={styles.cacheInfo}>
              <span className={styles.cacheIcon}>🌐</span>
              <span>Dados carregados da API</span>
              <button
                onClick={() => valorantCache.clearAllCache()}
                className={styles.clearCacheButton}
              >
                🧹 Limpar Cache
              </button>
            </div>
          )}
        </div>
      )}

      {/* Player Data */}
      {playerData && (
        <div className={styles.playerCard}>
          <div className={styles.playerHeader}>
            <img
              src={playerData.cardImage}
              alt="Player Card"
              className={styles.playerCardImage}
            />
            <div className={styles.playerInfo}>
              <h2>
                {playerData.name}#{playerData.tag}
              </h2>
              <p>Nível: {playerData.level}</p>
              <p>Região: {region.toUpperCase()}</p>
              <p>
                Última atualização:{" "}
                {playerData.lastUpdate.toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className={styles.rankInfo}>
              <img
                src={playerData.rankImage}
                alt="Rank"
                className={styles.rankImage}
              />
              <h3>{playerData.rank}</h3>
              <p>ELO: {playerData.elo}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "overview" ? styles.active : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Geral
            </button>
            <button
              className={`${styles.tab} ${activeTab === "matches" ? styles.active : ""}`}
              onClick={() => setActiveTab("matches")}
            >
              Partidas
            </button>
            <button
              className={`${styles.tab} ${activeTab === "stats" ? styles.active : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              Estatísticas
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === "overview" && (
              <div className={styles.overview}>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <h4>Rank Atual</h4>
                    <p>{playerData.rank}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h4>ELO</h4>
                    <p>{playerData.elo}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h4>Nível da Conta</h4>
                    <p>{playerData.level}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h4>Região</h4>
                    <p>{region.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "matches" && (
              <div className={styles.matches}>
                {matches.length === 0 ? (
                  <div className={styles.noMatches}>
                    <p>
                      🎮 Nenhuma partida competitiva encontrada recentemente.
                    </p>
                    <p className={styles.noMatchesSub}>
                      O jogador pode não ter jogado partidas competitivas nas
                      últimas 5 partidas.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className={styles.matchesHeader}>
                      <h3>📊 Últimas {matches.length} Partidas</h3>
                      <div className={styles.matchesSummary}>
                        <span className={styles.winCount}>
                          ✅ Vitórias:{" "}
                          {matches.filter((m) => m.result === "win").length}
                        </span>
                        <span className={styles.lossCount}>
                          ❌ Derrotas:{" "}
                          {matches.filter((m) => m.result === "loss").length}
                        </span>
                      </div>
                    </div>

                    {/* SEÇÃO DE PARTIDAS*/}
                    <div className={styles.matchesTable}>
                      <table>
                        <tbody className={styles.matchesTableBody}>
                          {matches.map((match, index) => (
                            <tr
                              key={match.id}
                              onClick={() => {
                                // Navegar para a API externa do HenrikDev com contexto do player
                                if (playerData) {
                                  const playerName = `${playerData.name}#${playerData.tag}`;
                                  // Navegar para a página de match com contexto do player
                                  window.location.href = `/match/${match.id}?region=${region}&player=${encodeURIComponent(playerName)}`;
                                }
                              }}
                              className={`${styles.matchTableRow} ${match.result === "win" ? styles.win : styles.loss}`}
                              style={{ cursor: "pointer" }}
                            >
                              <td className={styles.matchInfo}>
                                <div className="flex flex-row gap-4 items-center">
                                  <div className={styles.agent}>
                                    <img
                                      src={`/agents/${match.agent.toLowerCase().replace(" ", "-").replace("/", "-")}.png`}
                                      alt={match.agent}
                                      className={styles.agentImage}
                                    />
                                  </div>
                                  <div className={styles.matchDate}>
                                    <span
                                      className={`${styles.map} ${match.result === "win" ? styles.winBg : styles.lossBg}`}
                                    >
                                      <p>{match.map}</p>
                                    </span>
                                  </div>
                                  <div className="flex flex-row items-center justify-center gap-2">
                                    <div className="size-10">
                                      <img
                                        src={playerData.rankImage}
                                        alt="Rank"
                                        className={`object-contain`}
                                      />
                                    </div>
                                    <div>
                                      <span className={styles.score}>
                                        {match.score}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className={styles.kdaRow}>
                                <div className={styles.columnHeader}>K/D/A</div>
                                <p className={styles.kdaValue}>
                                  {match.kills}/{match.deaths}/{match.assists}
                                </p>
                              </td>
                              <td className={styles.headshotsRow}>
                                <div className={styles.columnHeader}>HS%</div>
                                <div className="flex flex-row gap-2 font-bold text-white shadow-md">
                                  {match.headshots}
                                  <p className={styles.headshotsPercent}>
                                    (
                                    {(
                                      (match.headshots /
                                        Math.max(match.kills, 1)) *
                                      100
                                    ).toFixed(0)}
                                    %)
                                  </p>
                                </div>
                              </td>
                              <td className={styles.damageRow}>
                                <div className={styles.columnHeader}>
                                  DAMAGE
                                </div>
                                <p className={styles.damageValue}>
                                  {match.damage.toLocaleString()}
                                </p>
                              </td>
                              <td className={styles.adrRow}>
                                <div className={styles.columnHeader}>ADR</div>
                                <p className={styles.adValue}>
                                  {calculateADR(
                                    match.damage,
                                    match.rounds_played,
                                  )}
                                </p>
                              </td>
                              <td className={styles.acsRow}>
                                <div className={styles.columnHeader}>ACS</div>
                                <p className={styles.adValue}>
                                  {calculateACS(
                                    match.damage,
                                    match.kills,
                                    match.rounds_played,
                                  )}
                                </p>
                              </td>
                              <td className={styles.dateRow}>
                                <div className={styles.columnHeader}>Data</div>
                                <p className={styles.dateValue}>
                                  {match.date.toLocaleDateString("pt-BR")}
                                </p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "stats" && (
              <div className={styles.stats}>
                <p>Estatísticas detalhadas em desenvolvimento...</p>
                <p>Esta funcionalidade será implementada em breve!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
