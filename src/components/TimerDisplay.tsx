"use client";

import type { SessionType, TimerStatus } from "@/types/timer";

interface TimerDisplayProps {
  remainingSeconds: number;
  sessionType: SessionType;
  status: TimerStatus;
  isComplete: boolean;
}

const SESSION_LABELS: Record<SessionType, string> = {
  work: "Work",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

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
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-medium uppercase tracking-widest text-accent h-4">
        {isComplete ? "Complete" : SESSION_LABELS[sessionType]}
      </span>
      <div
        className={`text-6xl md:text-8xl font-mono font-bold tabular-nums ${
          isComplete ? "text-text-secondary" : "text-text-primary"
        }`}
      >
        {isComplete ? "00:00" : formatTime(remainingSeconds)}
      </div>
    </div>
  );
}
