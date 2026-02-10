"use client";

import type { SessionType, TimerStatus } from "@/types/timer";

interface TimerDisplayProps {
  remainingSeconds: number;
  sessionType: SessionType;
  status: TimerStatus;
  isComplete: boolean;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function TimerDisplay({
  remainingSeconds,
  sessionType,
  status,
  isComplete,
}: TimerDisplayProps) {
  const color =
    isComplete
      ? "text-text-secondary"
      : sessionType === "work"
        ? "text-work"
        : "text-break";

  return (
    <div className="flex flex-col items-center gap-2">
      {status !== "idle" && !isComplete && (
        <span
          className={`text-sm font-medium uppercase tracking-widest ${color}`}
        >
          {sessionType === "work" ? "Work" : "Break"}
        </span>
      )}
      <div className={`text-6xl md:text-8xl font-mono font-bold tabular-nums ${color}`}>
        {isComplete ? "00:00" : formatTime(remainingSeconds)}
      </div>
    </div>
  );
}
