"use client";

import { useState, useRef, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TruncatedTextProps {
  text: string;
  maxLength: number;
  className?: string;
}

const TruncatedText = ({
  text,
  maxLength,
  className = "",
}: TruncatedTextProps) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(text.length > maxLength);
    }
  }, [text, maxLength]);

  const truncatedText = isTruncated ? `${text.slice(0, maxLength)}...` : text;

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip && isTruncated} onOpenChange={setShowTooltip}>
        <TooltipTrigger asChild>
          <p
            ref={textRef}
            className={`cursor-default ${className}`}
            onMouseEnter={() => isTruncated && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {truncatedText}
          </p>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs border border-border bg-background p-3 text-sm shadow-lg"
        >
          <p className="text-foreground">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TruncatedText;
