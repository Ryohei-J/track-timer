"use client";

import type { AudioSource } from "@/types/timer";

interface AudioSourceToggleProps {
  value: AudioSource;
  onChange: (source: AudioSource) => void;
  disabled: boolean;
}

export function AudioSourceToggle({ value, onChange, disabled }: AudioSourceToggleProps) {
  return (
    <div
      className="flex rounded-lg overflow-hidden border border-divider text-sm"
      role="group"
      aria-label="Audio source"
    >
      {(["library", "youtube"] as const).map((source) => {
        const isActive = value === source;
        return (
          <button
            key={source}
            onClick={() => onChange(source)}
            disabled={disabled}
            aria-pressed={isActive}
            className={`flex-1 px-3 py-1.5 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isActive
                ? "bg-accent text-white font-semibold"
                : "bg-surface-alt text-text-secondary hover:text-text-primary"
              }`}
          >
            {source === "library" ? "Library" : "YouTube"}
          </button>
        );
      })}
    </div>
  );
}
