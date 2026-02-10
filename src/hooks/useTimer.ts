"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { SessionType, TimerStatus } from "@/types/timer";
import { useLocalStorage } from "./useLocalStorage";

export interface UseTimerReturn {
  remainingSeconds: number;
  sessionType: SessionType;
  status: TimerStatus;
  currentCycle: number;
  totalCycles: number;
  workDurationMinutes: number;
  breakDurationMinutes: number;
  isComplete: boolean;

  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setWorkDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;
  setTotalCycles: (cycles: number) => void;
}

const DEFAULT_WORK_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;
const DEFAULT_CYCLES = 4;
const TICK_INTERVAL_MS = 250;

export function useTimer(): UseTimerReturn {
  const [workDurationMinutes, setWorkDurationMinutes] = useLocalStorage("pomodisc:workMinutes", DEFAULT_WORK_MINUTES);
  const [breakDurationMinutes, setBreakDurationMinutes] = useLocalStorage("pomodisc:breakMinutes", DEFAULT_BREAK_MINUTES);
  const [totalCycles, setTotalCyclesState] = useLocalStorage("pomodisc:totalCycles", DEFAULT_CYCLES);

  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_WORK_MINUTES * 60);
  const [sessionType, setSessionType] = useState<SessionType>("work");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  const anchorTimestampRef = useRef<number | null>(null);
  const anchorRemainingRef = useRef<number>(DEFAULT_WORK_MINUTES * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs to access latest state in tick without re-creating the interval
  const sessionTypeRef = useRef<SessionType>("work");
  const currentCycleRef = useRef(1);
  const totalCyclesRef = useRef(DEFAULT_CYCLES);
  const workMinutesRef = useRef(DEFAULT_WORK_MINUTES);
  const breakMinutesRef = useRef(DEFAULT_BREAK_MINUTES);

  // Keep refs in sync with state
  sessionTypeRef.current = sessionType;
  currentCycleRef.current = currentCycle;
  totalCyclesRef.current = totalCycles;
  workMinutesRef.current = workDurationMinutes;
  breakMinutesRef.current = breakDurationMinutes;

  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const transitionToNextSession = useCallback(() => {
    const curSession = sessionTypeRef.current;
    const curCycle = currentCycleRef.current;
    const maxCycles = totalCyclesRef.current;

    if (curSession === "work") {
      // Switch to break
      const breakSec = breakMinutesRef.current * 60;
      setSessionType("break");
      setRemainingSeconds(breakSec);
      anchorRemainingRef.current = breakSec;
      anchorTimestampRef.current = Date.now();
    } else {
      // Break just ended
      if (curCycle >= maxCycles) {
        // All cycles complete
        stopInterval();
        setStatus("idle");
        setIsComplete(true);
        setRemainingSeconds(0);
        return;
      }
      // Switch to next work session
      const nextCycle = curCycle + 1;
      const workSec = workMinutesRef.current * 60;
      setCurrentCycle(nextCycle);
      setSessionType("work");
      setRemainingSeconds(workSec);
      anchorRemainingRef.current = workSec;
      anchorTimestampRef.current = Date.now();
    }
  }, [stopInterval]);

  const tick = useCallback(() => {
    if (anchorTimestampRef.current === null) return;

    const elapsed = (Date.now() - anchorTimestampRef.current) / 1000;
    const newRemaining = anchorRemainingRef.current - elapsed;

    if (newRemaining <= 0) {
      setRemainingSeconds(0);
      transitionToNextSession();
    } else {
      setRemainingSeconds(Math.ceil(newRemaining));
    }
  }, [transitionToNextSession]);

  const startInterval = useCallback(() => {
    stopInterval();
    intervalRef.current = setInterval(tick, TICK_INTERVAL_MS);
  }, [tick, stopInterval]);

  const start = useCallback(() => {
    const seconds = workDurationMinutes * 60;
    setIsComplete(false);
    setSessionType("work");
    setCurrentCycle(1);
    setRemainingSeconds(seconds);
    setStatus("running");
    anchorRemainingRef.current = seconds;
    anchorTimestampRef.current = Date.now();
    startInterval();
  }, [workDurationMinutes, startInterval]);

  const pause = useCallback(() => {
    if (anchorTimestampRef.current === null) return;
    const elapsed = (Date.now() - anchorTimestampRef.current) / 1000;
    const paused = Math.max(0, anchorRemainingRef.current - elapsed);
    anchorRemainingRef.current = paused;
    anchorTimestampRef.current = null;
    setRemainingSeconds(Math.ceil(paused));
    setStatus("paused");
    stopInterval();
  }, [stopInterval]);

  const resume = useCallback(() => {
    anchorTimestampRef.current = Date.now();
    setStatus("running");
    startInterval();
  }, [startInterval]);

  const reset = useCallback(() => {
    stopInterval();
    anchorTimestampRef.current = null;
    const seconds = workDurationMinutes * 60;
    anchorRemainingRef.current = seconds;
    setRemainingSeconds(seconds);
    setSessionType("work");
    setCurrentCycle(1);
    setStatus("idle");
    setIsComplete(false);
  }, [workDurationMinutes, stopInterval]);

  // Sync display when duration changes while idle
  useEffect(() => {
    if (status === "idle" && !isComplete) {
      const seconds =
        sessionType === "work"
          ? workDurationMinutes * 60
          : breakDurationMinutes * 60;
      setRemainingSeconds(seconds);
      anchorRemainingRef.current = seconds;
    }
  }, [workDurationMinutes, breakDurationMinutes, status, sessionType, isComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopInterval();
  }, [stopInterval]);

  const setWorkDuration = useCallback((minutes: number) => {
    setWorkDurationMinutes(Math.max(1, Math.min(120, Math.floor(minutes) || 1)));
  }, []);

  const setBreakDuration = useCallback((minutes: number) => {
    setBreakDurationMinutes(Math.max(1, Math.min(60, Math.floor(minutes) || 1)));
  }, []);

  const setTotalCycles = useCallback((cycles: number) => {
    setTotalCyclesState(Math.max(1, Math.min(20, Math.floor(cycles) || 1)));
  }, []);

  return {
    remainingSeconds,
    sessionType,
    status,
    currentCycle,
    totalCycles,
    workDurationMinutes,
    breakDurationMinutes,
    isComplete,
    start,
    pause,
    resume,
    reset,
    setWorkDuration,
    setBreakDuration,
    setTotalCycles,
  };
}
