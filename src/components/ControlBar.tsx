"use client";

import { motion } from "motion/react";
import type { TimerStatus } from "@/types/timer";

interface ControlBarProps {
  status: TimerStatus;
  isComplete: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-semibold text-lg transition-colors
        disabled:opacity-40 disabled:cursor-not-allowed
        ${
          variant === "primary"
            ? "bg-work text-white hover:bg-work/80"
            : "bg-surface-alt text-text-primary hover:bg-surface-alt/80"
        }`}
    >
      {children}
    </motion.button>
  );
}

export function ControlBar({
  status,
  isComplete,
  onStart,
  onPause,
  onResume,
  onReset,
}: ControlBarProps) {
  return (
    <div className="flex gap-4">
      {status === "idle" && (
        <Button onClick={onStart}>
          {isComplete ? "Restart" : "Start"}
        </Button>
      )}
      {status === "running" && (
        <Button onClick={onPause}>Pause</Button>
      )}
      {status === "paused" && (
        <Button onClick={onResume}>Resume</Button>
      )}
      <Button
        onClick={onReset}
        variant="secondary"
        disabled={status === "idle" && !isComplete}
      >
        Reset
      </Button>
    </div>
  );
}
