"use client";

import type { SessionType } from "@/types/timer";
import { UrlInput } from "./UrlInput";
import { YouTubeEmbed } from "./YouTubeEmbed";

interface DeckPanelProps {
  type: SessionType;
  durationMinutes: number;
  onDurationChange: (minutes: number) => void;
  isActive: boolean;
  disabled: boolean;
  youtubeUrl: string;
  onYoutubeUrlChange: (url: string) => void;
  youtubeElementId: string;
  urlError: string | null;
}

const LABELS: Record<SessionType, string> = {
  work: "Work",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

const MAX_MINUTES: Record<SessionType, number> = {
  work: 90,
  shortBreak: 30,
  longBreak: 60,
};

export function DeckPanel({
  type,
  durationMinutes,
  onDurationChange,
  isActive,
  disabled,
  youtubeUrl,
  onYoutubeUrlChange,
  youtubeElementId,
  urlError,
}: DeckPanelProps) {
  return (
    <div className="p-5 flex flex-col gap-4">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full inline-block"
          style={{ backgroundColor: isActive ? "var(--c-accent)" : "var(--c-text-secondary)" }}
        />
        {LABELS[type]}
      </h2>

      <div>
        <label className="block text-sm text-text-secondary mb-1">Time (min)</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={MAX_MINUTES[type]}
            value={durationMinutes}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            disabled={disabled}
            className="flex-1"
            aria-label={`${LABELS[type]} duration in minutes`}
          />
          <input
            type="number"
            min={1}
            max={MAX_MINUTES[type]}
            value={durationMinutes}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            disabled={disabled}
            className="w-10 text-sm font-mono text-right text-text-primary underline
              bg-transparent border-none outline-none
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <UrlInput
        url={youtubeUrl}
        onUrlChange={onYoutubeUrlChange}
        disabled={disabled}
        error={urlError}
      />

      <div className="flex justify-center">
        <YouTubeEmbed elementId={youtubeElementId} />
      </div>
    </div>
  );
}
