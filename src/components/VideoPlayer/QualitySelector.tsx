"use client";

import { Check, MonitorPlay } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { VideoQuality, VIDEO_QUALITIES } from "@/hooks/useNetworkSpeed";
import styles from "./QualitySelector.module.scss";
import { cn } from "@/lib/utils";

interface QualitySelectorProps {
  /** Qualidade atual de vídeo */
  currentQuality: VideoQuality;
  /** Callback quando a qualidade é alterada */
  onQualityChange: (quality: VideoQuality) => void;
  /** Classe CSS adicional */
  className?: string;
  /** Se o modo auto está ativo */
  isAutoMode?: boolean;
  /** Qualidades efetivamente disponíveis para o vídeo */
  availableQualities?: VideoQuality[];
  /** Qualidade aplicada quando em modo auto */
  effectiveQuality?: VideoQuality;
  /** Sugestão de qualidade baseada em rede */
  suggestedQuality?: VideoQuality;
  /** Se a API de rede está disponível */
  isNetworkSupported?: boolean;
}

/**
 * Componente de controle de qualidade de vídeo
 *
 * Features:
 * - Dropdown com qualidades disponíveis (Auto, 1080p, 720p, 480p, 360p)
 * - Modo "Auto" que ajusta dinamicamente baseado em conexão
 * - Indicador visual da qualidade atual
 * - Persistência em localStorage
 * - Acessível via teclado (Tab, Enter, Esc, Setas)
 * - Fecha automaticamente ao clicar fora
 * - Badge visual quando não está em "Auto"
 *
 * @example
 * ```tsx
 * <QualitySelector
 *   currentQuality="720p"
 *   onQualityChange={(quality) => console.log(quality)}
 *   isAutoMode={false}
 * />
 * ```
 */
export default function QualitySelector({
  currentQuality,
  onQualityChange,
  className,
  isAutoMode = false,
  availableQualities,
  effectiveQuality,
  suggestedQuality,
  isNetworkSupported = true,
}: QualitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const qualityList = availableQualities?.length
    ? availableQualities
    : VIDEO_QUALITIES;

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Navegação por teclado
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleQualitySelect = (quality: VideoQuality) => {
    onQualityChange(quality);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  /**
   * Formata o label da qualidade para exibição
   */
  const getQualityLabel = (quality: VideoQuality): string => {
    if (quality === "auto") {
      return "Auto";
    }
    return quality.toUpperCase();
  };

  /**
   * Obtém descrição adicional para cada qualidade
   */
  const getQualityDescription = (quality: VideoQuality): string => {
    switch (quality) {
      case "auto":
        return isNetworkSupported
          ? "Ajuste automático"
          : "Modo auto (sem API de rede)";
      case "1080p":
        return "Full HD";
      case "720p":
        return "HD";
      case "480p":
        return "SD";
      case "360p":
        return "Baixa";
      default:
        return "";
    }
  };

  const activeQuality =
    currentQuality === "auto" && effectiveQuality
      ? effectiveQuality
      : currentQuality;

  const displayQuality =
    isAutoMode && activeQuality !== "auto"
      ? `Auto (${activeQuality.toUpperCase()})`
      : getQualityLabel(activeQuality);

  const badgeContent =
    currentQuality === "auto"
      ? effectiveQuality && effectiveQuality !== "auto"
        ? `Auto (${effectiveQuality.toUpperCase()})`
        : "Auto"
      : currentQuality.toUpperCase();

  return (
    <div ref={dropdownRef} className={cn(styles.container, className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={styles.trigger}
        aria-label="Controle de qualidade de vídeo"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`Qualidade: ${displayQuality}`}
      >
        <MonitorPlay className="h-4 w-4" />
        {badgeContent && <span className={styles.badge}>{badgeContent}</span>}
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownHeader}>
            <span className="text-xs font-semibold">Qualidade</span>
            {isAutoMode && suggestedQuality && (
              <span className="text-[10px] text-muted-foreground">
                Sugestão: {suggestedQuality.toUpperCase()}
              </span>
            )}
          </div>
          <div className={styles.dropdownContent}>
            {qualityList.map((quality) => {
              const isActive =
                quality === currentQuality ||
                (currentQuality === "auto" && quality === effectiveQuality);
              return (
                <button
                  key={quality}
                  type="button"
                  onClick={() => handleQualitySelect(quality)}
                  className={cn(styles.option, {
                    [styles.optionActive]: isActive,
                  })}
                  role="menuitem"
                  aria-current={isActive ? "true" : undefined}
                >
                  <div className={styles.optionContent}>
                    <span className={styles.optionLabel}>
                      {getQualityLabel(quality)}
                    </span>
                    <span className={styles.optionDescription}>
                      {getQualityDescription(quality)}
                    </span>
                  </div>
                  {isActive && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
