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
      <div className={styles.headerGrid}>
        <div className={styles.matchTitle}>
          <p className={styles.eyebrow}>Mapa</p>
          <div className={styles.titleRow}>
            <h2>{matchDetails.metadata?.map?.name || "Mapa Desconhecido"}</h2>
            <span className={styles.matchMode}>
              {matchDetails.metadata?.queue?.name || "Modo Desconhecido"}
            </span>
          </div>
        </div>

        <div className={styles.matchScore} aria-label="Placar final">
          <p className={styles.eyebrow}>Placar final</p>
          <div className={styles.scoreRow}>
            <span className={styles.teamName}>Time A</span>
            <span className={styles.score}>
              {redTeamScore} : {blueTeamScore}
            </span>
            <span className={styles.teamName}>Time B</span>
          </div>
        </div>
      </div>

      <dl className={styles.matchDetails}>
        <div className={styles.detailItem}>
          <dt>Data</dt>
          <dd>
            {formatDate(
              matchDetails.metadata?.started_at || new Date().toISOString(),
            )}
          </dd>
        </div>
        <div className={styles.detailItem}>
          <dt>Duração</dt>
          <dd>
            {formatDuration(matchDetails.metadata?.game_length_in_ms || 0)}
          </dd>
        </div>
        <div className={styles.detailItem}>
          <dt>Rank</dt>
          <dd>Platinum II</dd>
        </div>
      </dl>

      <div className={styles.matchActions}>
        <button className={styles.ghostButton} onClick={handleClose}>
          Voltar
        </button>
        <button className={styles.actionButton} onClick={handleCopyLink}>
          Copiar Link
        </button>
        <button className={styles.actionButton} onClick={handleOpenNewTab}>
          Abrir em Nova Aba
        </button>
      </div>
    </div>
  );
}
