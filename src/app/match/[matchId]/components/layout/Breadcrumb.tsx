/**
 * Breadcrumb component
 * Navigation breadcrumb for match details page
 * Shows: Busca → Player → Partida (if playerContext exists)
 * Shows: ← Voltar (if no playerContext)
 */

import styles from "./Breadcrumb.module.scss";

interface BreadcrumbProps {
  playerContext: string | null;
  region: string;
}

export default function Breadcrumb({ playerContext, region }: BreadcrumbProps) {
  if (playerContext) {
    return (
      <div className={styles.navigation}>
        <button
          onClick={() => (window.location.href = "/mmr")}
          className={styles.backButton}
        >
          ← Busca
        </button>
        <span className={styles.navigationSeparator}>/</span>
        <button
          onClick={() => {
            const [name, tag] = playerContext.split("#");
            if (name && tag) {
              window.location.href = `/mmr?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}&region=${region}`;
            }
          }}
          className={styles.backButton}
        >
          {playerContext}
        </button>
        <span className={styles.navigationSeparator}>/</span>
        <span className={styles.currentPage}>Partida</span>
      </div>
    );
  }

  return (
    <div className={styles.navigation}>
      <button
        onClick={() => window.history.back()}
        className={styles.backButton}
      >
        ← Voltar
      </button>
    </div>
  );
}
