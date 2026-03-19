import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string;
  colorClass: string;
}

interface HeroStatsProps {
  stats: StatItem[];
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
        <div key={index} className="text-center">
          <div className={cn("mb-2 text-3xl font-bold", stat.colorClass)}>
            {stat.value}
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
