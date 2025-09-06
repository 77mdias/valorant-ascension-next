"use client";

import LoadingSpinner from "./LoadingSpinner";

interface LoadingScreenProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingScreen = ({
  message = "Carregando...",
  size = "lg",
}: LoadingScreenProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size={size} />
        <p className="text-lg text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
