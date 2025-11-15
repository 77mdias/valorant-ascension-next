/**
 * MatchPageHeader component
 * Header with breadcrumb navigation and page title
 */

import Breadcrumb from "./Breadcrumb";
import styles from "./MatchPageHeader.module.scss";

interface MatchPageHeaderProps {
  playerContext: string | null;
  region: string;
  title?: string;
}

export default function MatchPageHeader({
  playerContext,
  region,
  title = "Detalhes da Partida",
}: MatchPageHeaderProps) {
  return (
    <div className={styles.header}>
      <Breadcrumb playerContext={playerContext} region={region} />
      <h1>{title}</h1>
    </div>
  );
}
