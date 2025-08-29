import { Check, PlayCircle, Lock } from "lucide-react";
import styles from "./scss/LessonCard.module.scss";

interface LessonCardProps {
  number: number;
  title: string;
  duration: number;
  isCompleted: boolean;
  isActive: boolean;
  isLocked?: boolean;
  onClick: () => void;
}

const LessonCard = ({
  number,
  title,
  duration,
  isCompleted,
  isActive,
  isLocked = false,
  onClick,
}: LessonCardProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`group w-full rounded-xl p-4 text-left transition-all duration-300 ${
        isActive
          ? `gradient-border ${styles.containerAside}`
          : "border border-border/50 hover:border-primary/50"
      } ${
        isLocked
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:scale-[1.02] hover:transform"
      } `}
    >
      <div className={isActive ? "rounded-xl bg-[#160e1b] p-4" : ""}>
        <div className="flex items-start gap-3">
          {/* Lesson Number/Status */}
          <div className="relative flex-shrink-0">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                isCompleted
                  ? "bg-primary/20 text-primary"
                  : isActive
                    ? "bg-gradient-to-r from-primary to-secondary text-white"
                    : "bg-muted text-muted-foreground"
              } `}
            >
              {isCompleted ? (
                <Check className="h-5 w-5" />
              ) : isLocked ? (
                <Lock className="h-5 w-5" />
              ) : (
                <span>{number}</span>
              )}
            </div>
            {isActive && (
              <div className="absolute inset-0 animate-pulse rounded-full bg-primary/30 blur-xl" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3
              className={`mb-1 font-semibold transition-colors ${isActive ? "text-primary" : "text-foreground group-hover:text-primary"} `}
            >
              {title}
            </h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <PlayCircle className="h-4 w-4" />
                {duration} min
              </span>
              {isCompleted && <span className="text-primary">Concluída</span>}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default LessonCard;
