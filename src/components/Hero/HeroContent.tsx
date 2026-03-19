import { cn } from "@/lib/utils";

interface HeroContentProps {
  children: React.ReactNode;
  className?: string;
}

export const HeroContent = ({ children, className }: HeroContentProps) => {
  return (
    <div
      className={cn("container relative z-10 mx-auto px-4 text-center", className)}
    >
      <div className="mx-auto max-w-4xl">{children}</div>
    </div>
  );
};
