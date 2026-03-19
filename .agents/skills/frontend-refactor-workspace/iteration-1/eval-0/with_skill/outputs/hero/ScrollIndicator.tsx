import { cn } from "@/lib/utils";

interface ScrollIndicatorProps {
  className?: string;
}

export const ScrollIndicator = ({ className }: ScrollIndicatorProps) => {
  return (
    <div
      className={cn(
        "absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce",
        className
      )}
    >
      <div className="flex h-10 w-6 justify-center rounded-full border-2 border-primary/50">
        <div className="mt-2 h-3 w-1 rounded-full bg-primary" />
      </div>
    </div>
  );
};
