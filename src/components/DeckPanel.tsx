"use client";

import type { SessionType } from "@/types/timer";
import { VinylDisc } from "./VinylDisc";
import { UrlInput } from "./UrlInput";
import { YouTubeEmbed } from "./YouTubeEmbed";

interface DeckPanelProps {
  type: SessionType;
  durationMinutes: number;
  onDurationChange: (minutes: number) => void;
  isActive: boolean;
  isPlaying: boolean;
  disabled: boolean;
  youtubeUrl: string;
  onYoutubeUrlChange: (url: string) => void;
  youtubeElementId: string;
  urlError: string | null;
}

export function DeckPanel({
  type,
  durationMinutes,
  onDurationChange,
  isActive,
  isPlaying,
  disabled,
  youtubeUrl,
  onYoutubeUrlChange,
  youtubeElementId,
  urlError,
}: DeckPanelProps) {
  const isWork = type === "work";
  const label = isWork ? "Work Deck" : "Break Deck";
  const max = isWork ? 120 : 60;

  return (
    <div
      className={`rounded-2xl p-6 border-2 transition-colors ${
        isActive
          ? isWork
            ? "border-work bg-work/10"
            : "border-break bg-break/10"
          : "border-surface-alt bg-surface-alt"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">{label}</h2>
      <div className="mb-4">
        <VinylDisc
          isPlaying={isPlaying}
          sessionType={type}
          isActive={isActive}
        />
      </div>
      <label className="block text-sm text-text-secondary mb-2">
        Duration (minutes)
      </label>
      <input
        type="number"
        min={1}
        max={max}
        value={durationMinutes}
        onChange={(e) => onDurationChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full rounded-lg bg-surface p-3 text-2xl text-center font-mono
          border border-surface-alt focus:outline-none focus:border-work
          disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <div className="mt-4">
        <UrlInput
          url={youtubeUrl}
          onUrlChange={onYoutubeUrlChange}
          disabled={disabled}
          error={urlError}
          type={type}
        />
      </div>

      <div className="mt-4 flex justify-center">
        <YouTubeEmbed elementId={youtubeElementId} />
      </div>
    </div>
  );
}
