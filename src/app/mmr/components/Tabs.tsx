"use client";

import React from "react";
import { motion } from "framer-motion";

interface TabsProps {
  activeTab: "overview" | "matches" | "stats";
  setActiveTab: (tab: "overview" | "matches" | "stats") => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "matches", label: "Matches" },
    { id: "stats", label: "Stats" },
  ];

  return (
    <div className="flex items-center gap-8 border-b border-zinc-800 w-full mb-8">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative pb-3 text-sm font-bold uppercase tracking-widest transition-colors ${
              isActive ? "text-white" : "text-zinc-500 hover:text-zinc-200"
            }`}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
