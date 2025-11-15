"use client";

import { Check, Gauge } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { PlaybackSpeed, PLAYBACK_SPEEDS } from "@/hooks/usePlaybackSpeed";
import styles from "./SpeedControl.module.scss";
import { cn } from "@/lib/utils";

interface SpeedControlProps {
  /** Velocidade atual de reprodução */
  currentSpeed: PlaybackSpeed;
  /** Callback quando a velocidade é alterada */
  onSpeedChange: (speed: PlaybackSpeed) => void;
  /** Classe CSS adicional */
  className?: string;
}

/**
 * Componente de controle de velocidade de reprodução
 *
 * Features:
 * - Dropdown com velocidades disponíveis
 * - Indicador visual da velocidade atual
 * - Acessível via teclado (Tab, Enter, Esc, Setas)
 * - Fecha automaticamente ao clicar fora
 * - Badge visual quando velocidade diferente de 1x
 *
 * @example
 * ```tsx
 * <SpeedControl
 *   currentSpeed={1.5}
 *   onSpeedChange={(speed) => console.log(speed)}
 * />
 * ```
 */
export default function SpeedControl({
  currentSpeed,
  onSpeedChange,
  className,
}: SpeedControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const handleSpeedSelect = (speed: PlaybackSpeed) => {
    onSpeedChange(speed);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const isNormalSpeed = currentSpeed === 1;

  return (
    <div ref={dropdownRef} className={cn(styles.container, className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={styles.trigger}
        aria-label="Controle de velocidade de reprodução"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`Velocidade: ${currentSpeed}x`}
      >
        <Gauge className="h-4 w-4" />
        {!isNormalSpeed && (
          <span className={styles.badge}>{currentSpeed}x</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownHeader}>
            <span className="text-xs font-semibold">Velocidade</span>
          </div>
          <div className={styles.dropdownContent}>
            {PLAYBACK_SPEEDS.map((speed) => {
              const isActive = speed === currentSpeed;
              return (
                <button
                  key={speed}
                  type="button"
                  onClick={() => handleSpeedSelect(speed)}
                  className={cn(styles.option, {
                    [styles.optionActive]: isActive,
                  })}
                  role="menuitem"
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className={styles.optionLabel}>
                    {speed === 1 ? "Normal" : `${speed}x`}
                  </span>
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
