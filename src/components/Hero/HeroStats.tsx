import { cn } from "@/lib/utils";

export interface StatItemProps {
  label: string;
  value: string;
  colorClassName: string;
}

const StatItem = ({ label, value, colorClassName }: StatItemProps) => (
  <div className="text-center">
    <div className={cn("mb-2 text-3xl font-bold", colorClassName)}>{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

interface HeroStatsProps {
  stats: StatItemProps[];
  className?: string;
}

export const HeroStats = ({ stats, className }: HeroStatsProps) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-2xl grid-cols-2 gap-8 md:grid-cols-4",
        className
      )}
    >
      {stats.map((stat, index) => (
        <StatItem key={index} {...stat} />
      ))}
    </div>
  );
};
