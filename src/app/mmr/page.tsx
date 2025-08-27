"use client";

import React, { useState } from "react";
import {
  HenrikDevAPI,
  processPlayerData,
  processMatchData,
  HenrikDevMatch,
} from "../../lib/henrikdev-api";
import styles from "./page.module.scss";

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

        {/* Exemplos de jogadores para testar */}
        <div className={styles.examples}>
          <p>💡 Exemplos para testar:</p>
          <div className={styles.exampleButtons}>
            <button
              onClick={() => {
                setSearchInput("TenZ#1337");
                setRegion("na");
              }}
              className={styles.exampleButton}
            >
              TenZ#1337 (NA)
            </button>
            <button
              onClick={() => {
                setSearchInput("shroud#1337");
                setRegion("na");
              }}
              className={styles.exampleButton}
            >
              shroud#1337 (NA)
            </button>
            <button
              onClick={() => {
                setSearchInput("Mixwell#1337");
                setRegion("eu");
              }}
              className={styles.exampleButton}
            >
              Mixwell#1337 (EU)
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className={styles.error}>❌ {error}</div>}

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
              📊 Visão Geral
            </button>
            <button
              className={`${styles.tab} ${activeTab === "matches" ? styles.active : ""}`}
              onClick={() => setActiveTab("matches")}
            >
              🎮 Partidas Recentes
            </button>
            <button
              className={`${styles.tab} ${activeTab === "stats" ? styles.active : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              📈 Estatísticas
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
                  <p>Nenhuma partida competitiva encontrada recentemente.</p>
                ) : (
                  <div className={styles.matchesList}>
                    {matches.map((match) => (
                      <div
                        key={match.id}
                        className={`${styles.matchCard} ${getResultColor(match.result)}`}
                      >
                        <div className={styles.matchHeader}>
                          <span className={styles.map}>{match.map}</span>
                          <span className={styles.agent}>{match.agent}</span>
                          <span className={styles.result}>
                            {match.result.toUpperCase()}
                          </span>
                        </div>
                        <div className={styles.matchStats}>
                          <div className={styles.score}>
                            <span>Score: {match.score}</span>
                            <span>Duração: {match.duration}min</span>
                          </div>
                          <div className={styles.kda}>
                            <span>K: {match.kills}</span>
                            <span>D: {match.deaths}</span>
                            <span>A: {match.assists}</span>
                            <span>HS: {match.headshots}</span>
                          </div>
                          <div className={styles.damage}>
                            <span>Dano: {match.damage.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className={styles.matchDate}>
                          {match.date.toLocaleDateString("pt-BR")} às{" "}
                          {match.date.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
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
