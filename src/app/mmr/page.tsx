"use client";

import React, { useState, useEffect } from "react";
import {
  HenrikDevAPI,
  processPlayerData,
  processMatchData,
  HenrikDevMatch,
} from "../../lib/henrikdev-api";
import { valorantCache } from "../../lib/cache";
import LoadingSpinner from "@/components/LoadingSpinner";
import { PlayerData, MatchData } from "./types";

// Components
import { SearchHero } from "./components/SearchHero";
import { PlayerStatsCard } from "./components/PlayerStatsCard";
import { MatchHistoryList } from "./components/MatchHistoryList";
import { CacheStatus } from "./components/CacheStatus";
import { Tabs } from "./components/Tabs";
import { motion, AnimatePresence } from "framer-motion";

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

  // Function to perform search
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
      // Check cache first
      const cachedData = valorantCache.getPlayerData(name, tag, searchRegion);

      if (cachedData) {
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

      // Fetch from API
      const [playerResponse, mmrResponse] = await Promise.all([
        HenrikDevAPI.getPlayer(name, tag, searchRegion),
        HenrikDevAPI.getMMR(name, tag, searchRegion),
      ]);

      const processedPlayer = processPlayerData(playerResponse, mmrResponse);
      setPlayerData(processedPlayer);

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

      // Cache data
      const cacheData = {
        player: playerResponse,
        mmr: mmrResponse,
        matches: matchesResponse,
        region: searchRegion,
      };

      valorantCache.setPlayerData(name, tag, searchRegion, cacheData);
      setDataFromCache(false);
    } catch (err: unknown) {
      console.error("❌ Search error:", err);
      setError(err instanceof Error ? err.message : "Error searching for player");
    } finally {
      setLoading(false);
    }
  };

  // Read URL params on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const nameParam = urlParams.get("name");
    const tagParam = urlParams.get("tag");
    const regionParam = urlParams.get("region");

    if (nameParam && tagParam) {
      setSearchInput(`${nameParam}#${tagParam}`);
      const effectiveRegion = regionParam || region;
      if (regionParam) setRegion(regionParam);
      
      performSearch(nameParam, tagParam, effectiveRegion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    const [name, tag] = searchInput.split("#");
    if (!name || !tag) {
      setError("Invalid format. Use: Name#TAG");
      return;
    }
    performSearch(name, tag, region);
  };

  const handleRefresh = () => {
    if (playerData) {
      valorantCache.clearAllCache();
      setDataFromCache(false);
      performSearch(playerData.name, playerData.tag, region);
    }
  };

  const handleClearCache = () => {
    valorantCache.clearAllCache();
    // Potentially trigger a visual feedback
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <AnimatePresence mode="wait">
        {!playerData ? (
          <motion.div
            key="search-hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="pt-20"
          >
            <SearchHero
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              region={region}
              setRegion={setRegion}
              handleSearch={handleSearch}
              loading={loading}
            />
            {error && (
              <div className="max-w-2xl mx-auto px-4 mt-4">
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-sm">
                  ❌ {error}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="player-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto px-6 pt-12 space-y-10"
          >
            {/* Minimal Search Bar for quick searches when already on profile */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="flex-1 w-full max-w-md">
                 <div className="relative group">
                    <input
                      type="text"
                      placeholder="Search another player..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="w-full h-10 rounded-full border border-border/60 bg-card/80 px-4 text-sm text-foreground transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button 
                      onClick={handleSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      🔍
                    </button>
                 </div>
               </div>
               <CacheStatus 
                 dataFromCache={dataFromCache}
                 onRefresh={handleRefresh}
                 onClearCache={handleClearCache}
               />
            </div>

            <PlayerStatsCard playerData={playerData} region={region} />

            <div className="space-y-6">
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
              
              <div className="min-h-[400px]">
                {activeTab === "overview" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {[
                      { label: "Rank", value: playerData.rank },
                      { label: "Elo", value: playerData.elo },
                      { label: "Level", value: playerData.level },
                      { label: "Region", value: region.toUpperCase() },
                    ].map((stat, i) => (
                      <div key={i} className="rounded-2xl border border-border/60 bg-card/70 p-6">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                        <p className="text-xl font-bold">{stat.value}</p>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "matches" && (
                  <MatchHistoryList
                    matches={matches}
                    playerData={playerData}
                    region={region}
                  />
                )}

                {activeTab === "stats" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                  >
                    <span className="text-4xl opacity-20 grayscale">📈</span>
                    <div className="space-y-1">
                       <h3 className="text-lg font-bold">Detailed Stats</h3>
                       <p className="text-muted-foreground">Coming soon to the ascension dashboard.</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center space-y-4 bg-background/85 backdrop-blur-sm">
          <LoadingSpinner />
          <p className="animate-pulse text-sm font-bold uppercase tracking-widest text-muted-foreground">Loading Data...</p>
        </div>
      )}
    </div>
  );
}
