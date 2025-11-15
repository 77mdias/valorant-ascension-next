/**
 * ErrorState component
 * Displays error messages with a back button
 */

import styles from "./ErrorState.module.scss";

interface ErrorStateProps {
  title?: string;
  message: string;
  onBack?: () => void;
}

export default function ErrorState({
  title = "❌ Erro",
  message,
  onBack,
}: ErrorStateProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className={styles.error}>
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={handleBack}>Voltar</button>
    </div>
  );
}
