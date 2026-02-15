"use client";

import { AnimatePresence, motion } from "motion/react";
import type { SessionType, TimerStatus } from "@/types/timer";

interface SessionIndicatorProps {
  sessionType: SessionType;
  currentCycle: number;
  totalCycles: number;
  status: TimerStatus;
  isComplete: boolean;
}

const SESSION_LABELS: Record<SessionType, string> = {
  work: "Work",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export function SessionIndicator({
  sessionType,
  currentCycle,
  totalCycles,
  status,
  isComplete,
}: SessionIndicatorProps) {
  let text: string;
  if (isComplete) {
    text = "Complete!";
  } else if (status === "idle") {
    text = "Ready";
  } else {
    text = `${SESSION_LABELS[sessionType]} ${currentCycle} / ${totalCycles}`;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className="text-sm text-text-secondary font-medium"
      >
        {text}
      </motion.div>
    </AnimatePresence>
  );
}
