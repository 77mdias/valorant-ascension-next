"use client";

import React from "react";

interface SearchHeroProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  region: string;
  setRegion: (value: string) => void;
  handleSearch: () => void;
  loading: boolean;
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  searchInput,
  setSearchInput,
  region,
  setRegion,
  handleSearch,
  loading,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          🔍 Player Search
        </h1>
        <p className="text-lg text-muted-foreground">
          Detailed stats for any Valorant player.
        </p>
      </div>

      <div className="w-full max-w-2xl flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Name#TAG (e.g. TenZ#1337)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="h-12 w-full rounded-lg border border-border/60 bg-card/80 px-4 text-foreground transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="h-12 cursor-pointer rounded-lg border border-border/60 bg-card/80 px-4 text-foreground transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="na">North America</option>
          <option value="eu">Europe</option>
          <option value="ap">Asia-Pacific</option>
          <option value="kr">Korea</option>
          <option value="br">Brazil</option>
          <option value="latam">Latin America</option>
        </select>
        <button
          onClick={handleSearch}
          disabled={loading || !searchInput.trim()}
          className="h-12 rounded-lg bg-primary px-8 font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
};
