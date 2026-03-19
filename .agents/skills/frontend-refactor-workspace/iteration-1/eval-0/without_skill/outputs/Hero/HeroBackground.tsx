import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

interface HeroBackgroundProps {
  image: string | StaticImageData;
  className?: string;
}

export const HeroBackground = ({ image, className }: HeroBackgroundProps) => {
  return (
    <div className={cn("absolute inset-0 z-0", className)}>
      <Image
        src={image}
        alt="Valorant Academy BR Training Facility"
        className="h-full w-full object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
    </div>
  );
};
