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
  shortBreakDurationMinutes: number;
  longBreakDurationMinutes: number;
  longBreakInterval: number;
  isComplete: boolean;

  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setWorkDuration: (minutes: number) => void;
  setShortBreakDuration: (minutes: number) => void;
  setLongBreakDuration: (minutes: number) => void;
  setTotalCycles: (cycles: number) => void;
  setLongBreakInterval: (n: number) => void;
}

const DEFAULT_WORK_MINUTES = 25;
const DEFAULT_SHORT_BREAK_MINUTES = 5;
const DEFAULT_LONG_BREAK_MINUTES = 15;
const DEFAULT_CYCLES = 4;
const DEFAULT_LONG_BREAK_INTERVAL = 4;
const TICK_INTERVAL_MS = 250;

export function useTimer(): UseTimerReturn {
  const [workDurationMinutes, setWorkDurationMinutes] = useLocalStorage("pomotimerx:workMinutes", DEFAULT_WORK_MINUTES);
  const [shortBreakDurationMinutes, setShortBreakDurationMinutes] = useLocalStorage("pomotimerx:shortBreakMinutes", DEFAULT_SHORT_BREAK_MINUTES);
  const [longBreakDurationMinutes, setLongBreakDurationMinutes] = useLocalStorage("pomotimerx:longBreakMinutes", DEFAULT_LONG_BREAK_MINUTES);
  const [totalCycles, setTotalCyclesState] = useLocalStorage("pomotimerx:totalCycles", DEFAULT_CYCLES);
  const [longBreakInterval, setLongBreakIntervalState] = useLocalStorage("pomotimerx:longBreakInterval", DEFAULT_LONG_BREAK_INTERVAL);

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
  const shortBreakMinutesRef = useRef(DEFAULT_SHORT_BREAK_MINUTES);
  const longBreakMinutesRef = useRef(DEFAULT_LONG_BREAK_MINUTES);
  const longBreakIntervalRef = useRef(DEFAULT_LONG_BREAK_INTERVAL);

  // Keep refs in sync with state
  sessionTypeRef.current = sessionType;
  currentCycleRef.current = currentCycle;
  totalCyclesRef.current = totalCycles;
  workMinutesRef.current = workDurationMinutes;
  shortBreakMinutesRef.current = shortBreakDurationMinutes;
  longBreakMinutesRef.current = longBreakDurationMinutes;
  longBreakIntervalRef.current = longBreakInterval;

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
    const lbInterval = longBreakIntervalRef.current;

    if (curSession === "work") {
      // Work just ended — check if all cycles are done
      if (curCycle >= maxCycles) {
        stopInterval();
        setStatus("idle");
        setIsComplete(true);
        setRemainingSeconds(0);
        return;
      }
      // Determine which break to use
      if (curCycle % lbInterval === 0) {
        const sec = longBreakMinutesRef.current * 60;
        setSessionType("longBreak");
        setRemainingSeconds(sec);
        anchorRemainingRef.current = sec;
        anchorTimestampRef.current = Date.now();
      } else {
        const sec = shortBreakMinutesRef.current * 60;
        setSessionType("shortBreak");
        setRemainingSeconds(sec);
        anchorRemainingRef.current = sec;
        anchorTimestampRef.current = Date.now();
      }
    } else {
      // Break (short or long) just ended — move to next work session
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
      let seconds: number;
      if (sessionType === "work") {
        seconds = workDurationMinutes * 60;
      } else if (sessionType === "shortBreak") {
        seconds = shortBreakDurationMinutes * 60;
      } else {
        seconds = longBreakDurationMinutes * 60;
      }
      setRemainingSeconds(seconds);
      anchorRemainingRef.current = seconds;
    }
  }, [workDurationMinutes, shortBreakDurationMinutes, longBreakDurationMinutes, status, sessionType, isComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopInterval();
  }, [stopInterval]);

  const setWorkDuration = useCallback((minutes: number) => {
    setWorkDurationMinutes(Math.max(1, Math.min(90, Math.floor(minutes) || 1)));
  }, []);

  const setShortBreakDuration = useCallback((minutes: number) => {
    setShortBreakDurationMinutes(Math.max(1, Math.min(30, Math.floor(minutes) || 1)));
  }, []);

  const setLongBreakDuration = useCallback((minutes: number) => {
    setLongBreakDurationMinutes(Math.max(1, Math.min(60, Math.floor(minutes) || 1)));
  }, []);

  const setTotalCycles = useCallback((cycles: number) => {
    setTotalCyclesState(Math.max(1, Math.min(20, Math.floor(cycles) || 1)));
  }, []);

  const setLongBreakInterval = useCallback((n: number) => {
    setLongBreakIntervalState(Math.max(1, Math.min(10, Math.floor(n) || 1)));
  }, []);

  return {
    remainingSeconds,
    sessionType,
    status,
    currentCycle,
    totalCycles,
    workDurationMinutes,
    shortBreakDurationMinutes,
    longBreakDurationMinutes,
    longBreakInterval,
    isComplete,
    start,
    pause,
    resume,
    reset,
    setWorkDuration,
    setShortBreakDuration,
    setLongBreakDuration,
    setTotalCycles,
    setLongBreakInterval,
  };
}
