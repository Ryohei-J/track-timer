"use client";

import { useId } from "react";

interface UrlInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  disabled: boolean;
  error: string | null;
}

export function UrlInput({
  url,
  onUrlChange,
  disabled,
  error,
}: UrlInputProps) {
  const errorId = useId();

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
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className="w-full rounded-lg bg-surface-alt p-3 text-sm
          border border-divider focus:outline-none focus:border-accent
          disabled:opacity-50 disabled:cursor-not-allowed
          placeholder:text-text-secondary/50"
      />
      {error && (
        <p id={errorId} role="alert" className="text-red-400 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
