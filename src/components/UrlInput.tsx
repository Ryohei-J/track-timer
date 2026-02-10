"use client";

import type { SessionType } from "@/types/timer";

interface UrlInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  disabled: boolean;
  error: string | null;
  type: SessionType;
}

export function UrlInput({
  url,
  onUrlChange,
  disabled,
  error,
  type,
}: UrlInputProps) {
  const focusColor = type === "work" ? "focus:border-work" : "focus:border-break";

  return (
    <div>
      <label className="block text-sm text-text-secondary mb-2">
        YouTube URL
      </label>
      <input
        type="url"
        placeholder="https://youtube.com/watch?v=..."
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        disabled={disabled}
        className={`w-full rounded-lg bg-surface p-3 text-sm
          border border-surface-alt focus:outline-none ${focusColor}
          disabled:opacity-50 disabled:cursor-not-allowed
          placeholder:text-text-secondary/50`}
      />
      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
