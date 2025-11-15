/**
 * TabNavigation component
 * Tab navigation system for match details sections
 */

import type { TabType } from "../../types/match.types";
import styles from "./TabNavigation.module.scss";

interface Tab {
  id: TabType;
  label: string;
  disabled?: boolean;
}

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  tabs?: Tab[];
}

const defaultTabs: Tab[] = [
  { id: "scoreboard", label: "Scoreboard" },
  { id: "performance", label: "Performance", disabled: true },
  { id: "economy", label: "Economy", disabled: true },
  { id: "rounds", label: "Rounds" },
  { id: "duels", label: "Duels", disabled: true },
];

export default function TabNavigation({
  activeTab,
  onTabChange,
  tabs = defaultTabs,
}: TabNavigationProps) {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""} ${tab.disabled ? styles.disabled : ""}`}
          onClick={() => !tab.disabled && onTabChange(tab.id)}
          disabled={tab.disabled}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
