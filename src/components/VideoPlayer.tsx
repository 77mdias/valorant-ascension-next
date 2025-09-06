import { Play, SkipBack, SkipForward, Volume2, Maximize } from "lucide-react";
import { useState } from "react";
import styles from "./scss/VideoPlayer.module.scss";

interface VideoPlayerProps {
  videoUrl?: string;
  thumbnailUrl?: string;
  title: string;
  description: string;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

const VideoPlayer = ({
  videoUrl,
  thumbnailUrl,
  title,
  description,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-6">
      {/* Video Container */}
      <div className="gradient-border relative aspect-video overflow-hidden rounded-2xl">
        <div className="h-full w-full bg-card">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-background">
              {/* Placeholder Background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-primary/30 blur-3xl" />
                <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-secondary/30 blur-3xl" />
              </div>

              {/* Play Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="group relative"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary transition-transform group-hover:scale-110">
                  <Play className="ml-1 h-10 w-10 text-white" fill="white" />
                </div>
                <div className="absolute inset-0 rounded-full bg-primary/50 blur-2xl transition-all group-hover:blur-3xl" />
              </button>

              {/* Custom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-4">
                <div className="flex items-center gap-4">
                  <button className="text-white/80 transition-colors hover:text-white">
                    <Play className="h-5 w-5" />
                  </button>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-primary to-secondary" />
                  </div>
                  <span className="text-sm text-white/80">00:00 / 15:30</span>
                  <button className="text-white/80 transition-colors hover:text-white">
                    <Volume2 className="h-5 w-5" />
                  </button>
                  <button className="text-white/80 transition-colors hover:text-white">
                    <Maximize className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Info */}
      <div className="space-y-4">
        <h2 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">
          {title}
        </h2>
        <p className="leading-relaxed text-muted-foreground">{description}</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={`${styles.gamingButton} flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold ${!hasPrevious ? "cursor-not-allowed opacity-50" : ""} `}
        >
          <SkipBack className="h-5 w-5" />
          Aula Anterior
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`${styles.gamingButton} flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold ${!hasNext ? "cursor-not-allowed opacity-50" : ""} `}
        >
          Próxima Aula
          <SkipForward className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
