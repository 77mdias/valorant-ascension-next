/**
 * LoadingState component
 * Displays a spinner and loading message while data is being fetched
 */

import styles from "./LoadingState.module.scss";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Carregando detalhes da partida...",
}: LoadingStateProps) {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>{message}</p>
    </div>
  );
}
