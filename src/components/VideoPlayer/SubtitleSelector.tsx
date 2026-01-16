"use client";

import { Captions, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./SubtitleSelector.module.scss";
import { cn } from "@/lib/utils";

interface SubtitleOption {
  language: string;
  label: string;
  isDefault?: boolean;
}

interface SubtitleSelectorProps {
  currentSelection: string;
  options: SubtitleOption[];
  onChange: (language: string) => void;
  className?: string;
}

const OFF_VALUE = "off";

export default function SubtitleSelector({
  currentSelection,
  options,
  onChange,
  className,
}: SubtitleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    if (!isOpen) return;

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

  // Fechar com tecla ESC
  useEffect(() => {
    if (!isOpen) return;

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

  const sortedOptions = [...options].sort((first, second) => {
    if (first.isDefault && !second.isDefault) return -1;
    if (!first.isDefault && second.isDefault) return 1;
    return first.label.localeCompare(second.label);
  });

  const activeOption = sortedOptions.find(
    (option) => option.language === currentSelection,
  );

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const badgeContent =
    currentSelection === OFF_VALUE
      ? "OFF"
      : (activeOption?.language?.toUpperCase() ?? "CC");

  const displayLabel =
    currentSelection === OFF_VALUE
      ? "Desativadas"
      : (activeOption?.label ?? "Legendas");

  return (
    <div ref={dropdownRef} className={cn(styles.container, className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={styles.trigger}
        aria-label="Controle de legendas"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`Legendas: ${displayLabel}`}
        disabled={!sortedOptions.length}
      >
        <Captions className="h-4 w-4" />
        <span className={styles.badge}>{badgeContent}</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownHeader}>
            <span className="text-xs font-semibold">Legendas</span>
          </div>
          <div className={styles.dropdownContent}>
            <button
              type="button"
              onClick={() => handleSelect(OFF_VALUE)}
              className={cn(styles.option, {
                [styles.optionActive]: currentSelection === OFF_VALUE,
              })}
              role="menuitem"
              aria-current={currentSelection === OFF_VALUE ? "true" : undefined}
            >
              <div className={styles.optionContent}>
                <span className={styles.optionLabel}>Desativadas</span>
                <span className={styles.optionDescription}>
                  Ocultar legendas
                </span>
              </div>
              {currentSelection === OFF_VALUE && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>

            {sortedOptions.map((option) => {
              const isActive = option.language === currentSelection;
              return (
                <button
                  key={option.language}
                  type="button"
                  onClick={() => handleSelect(option.language)}
                  className={cn(styles.option, {
                    [styles.optionActive]: isActive,
                  })}
                  role="menuitem"
                  aria-current={isActive ? "true" : undefined}
                >
                  <div className={styles.optionContent}>
                    <span className={styles.optionLabel}>{option.label}</span>
                    <span className={styles.optionDescription}>
                      {option.language.toUpperCase()}
                      {option.isDefault ? " • Padrão" : ""}
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
