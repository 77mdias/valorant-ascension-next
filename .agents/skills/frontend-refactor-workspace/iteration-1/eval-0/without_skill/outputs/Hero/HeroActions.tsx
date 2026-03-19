import { cn } from "@/lib/utils";

interface HeroActionsProps {
  children: React.ReactNode;
  className?: string;
}

export const HeroActions = ({ children, className }: HeroActionsProps) => {
  return (
    <div
      className={cn(
        "mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row",
        className
      )}
    >
      {children}
    </div>
  );
};
