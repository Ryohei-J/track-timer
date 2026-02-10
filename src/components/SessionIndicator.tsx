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
    const label = sessionType === "work" ? "Work" : "Break";
    text = `${label} ${currentCycle} / ${totalCycles}`;
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
