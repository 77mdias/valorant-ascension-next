/**
 * LoadingState component
 * Displays a spinner and loading message while data is being fetched
 */

import LoadingSpinner from "@/components/LoadingSpinner";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Loading Data...",
}: LoadingStateProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center space-y-4 bg-background/85 backdrop-blur-sm">
      <LoadingSpinner />
      <p className="animate-pulse text-sm font-bold uppercase tracking-widest text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
