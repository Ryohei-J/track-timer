"use client";

import { useRef, useEffect, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { TimerStatus, SessionType } from "@/types/timer";

const ALARM_TRIGGER_SECONDS = 3;
const ALARM_SRC = "/audio/alarm.mp3";

export interface UseAlarmReturn {
  alarmEnabled: boolean;
  setAlarmEnabled: (enabled: boolean) => void;
}

export function useAlarm(
  remainingSeconds: number,
  status: TimerStatus,
  sessionType: SessionType,
): UseAlarmReturn {
  const [alarmEnabled, setAlarmEnabled] = useLocalStorage<boolean>(
    "pomotimerx:alarmEnabled",
    true,
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRef = useRef(false);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(ALARM_SRC);
      audioRef.current.volume = 1;
    }
    return audioRef.current;
  }, []);

  // Reset the "has played" flag when session type changes (new session)
  useEffect(() => {
    hasPlayedRef.current = false;
  }, [sessionType]);

  // Trigger alarm at 3 seconds remaining
  useEffect(() => {
    if (!alarmEnabled) return;
    if (status !== "running") return;
    if (hasPlayedRef.current) return;

    if (remainingSeconds <= ALARM_TRIGGER_SECONDS && remainingSeconds > 0) {
      hasPlayedRef.current = true;
      const audio = getAudio();
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, [remainingSeconds, status, alarmEnabled, getAudio]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return { alarmEnabled, setAlarmEnabled };
}
