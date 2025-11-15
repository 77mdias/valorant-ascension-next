/**
 * MatchHeader component
 * Displays match information including map, mode, score, date, and actions
 */

import type { MatchDetails } from "../../types/match.types";
import styles from "./MatchHeader.module.scss";

interface MatchHeaderProps {
  matchDetails: MatchDetails;
  redTeamScore: number;
  blueTeamScore: number;
  formatDate: (dateString: string) => string;
  formatDuration: (ms: number) => string;
  matchId: string;
}

export default function MatchHeader({
  matchDetails,
  redTeamScore,
  blueTeamScore,
  formatDate,
  formatDuration,
  matchId,
}: MatchHeaderProps) {
  const handleOpenNewTab = () => {
    window.open(window.location.href, "_blank");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    } catch (err) {
      console.error("Erro ao copiar link:", err);
    }
  };

  const handleClose = () => {
    window.history.back();
  };

  return (
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
      <div className={styles.matchActions}>
        <button className={styles.actionButton} onClick={handleOpenNewTab}>
          Abrir em Nova Aba
        </button>
        <button className={styles.actionButton} onClick={handleCopyLink}>
          Copiar Link
        </button>
        <button className={styles.closeButton} onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
}
