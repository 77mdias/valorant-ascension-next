"use client";

import React from "react";
import { MatchData, PlayerData } from "../types";
import { MatchHistoryItem } from "./MatchHistoryItem";
import { motion } from "framer-motion";

interface MatchHistoryListProps {
  matches: MatchData[];
  playerData: PlayerData;
  region: string;
}

export const MatchHistoryList: React.FC<MatchHistoryListProps> = ({
  matches,
  playerData,
  region,
}) => {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/70 px-6 py-12 text-center">
        <span className="text-4xl mb-4">🎮</span>
        <h3 className="text-lg font-bold">No competitive matches found.</h3>
        <p className="mx-auto max-w-xs text-muted-foreground">
          This player might not have played competitive matches in their last 5 games.
        </p>
      </div>
    );
  }

  const wins = matches.filter((m) => m.result === "win").length;
  const losses = matches.filter((m) => m.result === "loss").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-2">
        <h3 className="text-xl font-bold tracking-tight">Recent Matches</h3>
        <div className="flex gap-4 text-sm font-bold">
          <span className="text-emerald-600 dark:text-emerald-400">
            {wins} W
          </span>
          <span className="text-rose-600 dark:text-rose-400">
            {losses} L
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {matches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <MatchHistoryItem
              match={match}
              playerData={playerData}
              region={region}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
