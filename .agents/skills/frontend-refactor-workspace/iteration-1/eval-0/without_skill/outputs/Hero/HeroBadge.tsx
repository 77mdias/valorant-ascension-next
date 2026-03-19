import { cn } from "@/lib/utils";

interface HeroBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const HeroBadge = ({ children, className }: HeroBadgeProps) => {
  return (
    <div
      className={cn(
        "glass-card mb-8 inline-flex items-center rounded-full px-4 py-2",
        className
      )}
    >
      <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-primary" />
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
};
