"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { SessionType, TimerStatus } from "@/types/timer";
import { useYouTubePlayer } from "./useYouTubePlayer";
import { useLocalStorage } from "./useLocalStorage";
import { extractVideoId } from "@/lib/youtube";

const FADE_DURATION = 5; // seconds for fade-out
const FADE_IN_STEPS = 20;
const FADE_IN_INTERVAL_MS = 50; // 20 steps * 50ms = 1 second

function getYouTubeErrorMessage(code: number): string {
  switch (code) {
    case 2:
      return "Invalid video URL parameter.";
    case 5:
      return "This video cannot be played. Please try another.";
    case 100:
      return "Video not found. It may be private or deleted.";
    case 101:
    case 150:
      return "This video cannot be embedded. Please try a different URL.";
    default:
      return "An unknown playback error occurred.";
  }
}

export interface TripleDeckState {
  workUrl: string;
  shortBreakUrl: string;
  longBreakUrl: string;
  workVideoId: string | null;
  shortBreakVideoId: string | null;
  longBreakVideoId: string | null;
  workUrlError: string | null;
  shortBreakUrlError: string | null;
  longBreakUrlError: string | null;
  playerError: string | null;
  setWorkUrl: (url: string) => void;
  setShortBreakUrl: (url: string) => void;
  setLongBreakUrl: (url: string) => void;
  clearPlayerError: () => void;
  initializePlayers: () => void;
  playersInitialized: boolean;
}

export function useDualDeckController(
  sessionType: SessionType,
  status: TimerStatus,
  remainingSeconds: number,
  isComplete: boolean,
  ytApiReady: boolean,
): TripleDeckState {
  // URL state (persisted)
  const [workUrl, setWorkUrlState] = useLocalStorage("pomotimerx:workUrl", "");
  const [shortBreakUrl, setShortBreakUrlState] = useLocalStorage("pomotimerx:shortBreakUrl", "");
  const [longBreakUrl, setLongBreakUrlState] = useLocalStorage("pomotimerx:longBreakUrl", "");
  const [workVideoId, setWorkVideoId] = useState<string | null>(() => extractVideoId(workUrl));
  const [shortBreakVideoId, setShortBreakVideoId] = useState<string | null>(() => extractVideoId(shortBreakUrl));
  const [longBreakVideoId, setLongBreakVideoId] = useState<string | null>(() => extractVideoId(longBreakUrl));
  const [workUrlError, setWorkUrlError] = useState<string | null>(null);
  const [shortBreakUrlError, setShortBreakUrlError] = useState<string | null>(null);
  const [longBreakUrlError, setLongBreakUrlError] = useState<string | null>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [playersInitialized, setPlayersInitialized] = useState(false);

  // Migrate old breakUrl to shortBreakUrl on first load
  useEffect(() => {
    const oldBreakUrl = localStorage.getItem("pomotimerx:breakUrl");
    const existingShortBreak = localStorage.getItem("pomotimerx:shortBreakUrl");
    if (oldBreakUrl && !existingShortBreak) {
      try {
        const parsed = JSON.parse(oldBreakUrl);
        if (parsed) {
          setShortBreakUrlState(parsed);
        }
      } catch {
        // ignore parse errors
      }
      localStorage.removeItem("pomotimerx:breakUrl");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-derive video IDs when URLs are hydrated from localStorage
  useEffect(() => {
    if (!workUrl) return;
    const id = extractVideoId(workUrl);
    setWorkVideoId(id);
    if (!id) setWorkUrlError("Invalid YouTube URL");
  }, [workUrl]);

  useEffect(() => {
    if (!shortBreakUrl) return;
    const id = extractVideoId(shortBreakUrl);
    setShortBreakVideoId(id);
    if (!id) setShortBreakUrlError("Invalid YouTube URL");
  }, [shortBreakUrl]);

  useEffect(() => {
    if (!longBreakUrl) return;
    const id = extractVideoId(longBreakUrl);
    setLongBreakVideoId(id);
    if (!id) setLongBreakUrlError("Invalid YouTube URL");
  }, [longBreakUrl]);

  // Players
  const workPlayer = useYouTubePlayer({
    elementId: "yt-player-work",
    onError: (code) => setPlayerError(getYouTubeErrorMessage(code)),
  });
  const shortBreakPlayer = useYouTubePlayer({
    elementId: "yt-player-short-break",
    onError: (code) => setPlayerError(getYouTubeErrorMessage(code)),
  });
  const longBreakPlayer = useYouTubePlayer({
    elementId: "yt-player-long-break",
    onError: (code) => setPlayerError(getYouTubeErrorMessage(code)),
  });

  const getPlayer = useCallback((type: SessionType) => {
    if (type === "work") return workPlayer;
    if (type === "shortBreak") return shortBreakPlayer;
    return longBreakPlayer;
  }, [workPlayer, shortBreakPlayer, longBreakPlayer]);

  // Refs for fade-in interval and session transition detection
  const fadeInIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevSessionTypeRef = useRef<SessionType>(sessionType);
  const statusRef = useRef<TimerStatus>(status);
  statusRef.current = status;

  // Cleanup fade-in interval
  const clearFadeIn = useCallback(() => {
    if (fadeInIntervalRef.current) {
      clearInterval(fadeInIntervalRef.current);
      fadeInIntervalRef.current = null;
    }
  }, []);

  // URL setters with validation
  const setWorkUrl = useCallback((url: string) => {
    setWorkUrlState(url);
    if (!url.trim()) {
      setWorkVideoId(null);
      setWorkUrlError(null);
      return;
    }
    const id = extractVideoId(url);
    if (id) {
      setWorkVideoId(id);
      setWorkUrlError(null);
    } else {
      setWorkVideoId(null);
      setWorkUrlError("Invalid YouTube URL");
    }
  }, []);

  const setShortBreakUrl = useCallback((url: string) => {
    setShortBreakUrlState(url);
    if (!url.trim()) {
      setShortBreakVideoId(null);
      setShortBreakUrlError(null);
      return;
    }
    const id = extractVideoId(url);
    if (id) {
      setShortBreakVideoId(id);
      setShortBreakUrlError(null);
    } else {
      setShortBreakVideoId(null);
      setShortBreakUrlError("Invalid YouTube URL");
    }
  }, []);

  const setLongBreakUrl = useCallback((url: string) => {
    setLongBreakUrlState(url);
    if (!url.trim()) {
      setLongBreakVideoId(null);
      setLongBreakUrlError(null);
      return;
    }
    const id = extractVideoId(url);
    if (id) {
      setLongBreakVideoId(id);
      setLongBreakUrlError(null);
    } else {
      setLongBreakVideoId(null);
      setLongBreakUrlError("Invalid YouTube URL");
    }
  }, []);

  // Pre-create players when URLs are set and API is ready
  useEffect(() => {
    if (!ytApiReady || playersInitialized) return;
    if (workVideoId && !workPlayer.isReady) {
      workPlayer.createPlayer(workVideoId);
    }
  }, [ytApiReady, workVideoId, workPlayer, playersInitialized]);

  useEffect(() => {
    if (!ytApiReady || playersInitialized) return;
    if (shortBreakVideoId && !shortBreakPlayer.isReady) {
      shortBreakPlayer.createPlayer(shortBreakVideoId);
    }
  }, [ytApiReady, shortBreakVideoId, shortBreakPlayer, playersInitialized]);

  useEffect(() => {
    if (!ytApiReady || playersInitialized) return;
    if (longBreakVideoId && !longBreakPlayer.isReady) {
      longBreakPlayer.createPlayer(longBreakVideoId);
    }
  }, [ytApiReady, longBreakVideoId, longBreakPlayer, playersInitialized]);

  // Initialize players on Start (user gesture context)
  const initializePlayers = useCallback(() => {
    if (!ytApiReady) return;

    if (workVideoId) {
      if (!workPlayer.isReady) {
        workPlayer.createPlayer(workVideoId);
      }
      setTimeout(() => {
        workPlayer.setVolume(100);
        workPlayer.play();
      }, 100);
    }

    if (shortBreakVideoId && !shortBreakPlayer.isReady) {
      shortBreakPlayer.createPlayer(shortBreakVideoId);
    }

    if (longBreakVideoId && !longBreakPlayer.isReady) {
      longBreakPlayer.createPlayer(longBreakVideoId);
    }

    setPlayersInitialized(true);
  }, [ytApiReady, workVideoId, shortBreakVideoId, longBreakVideoId, workPlayer, shortBreakPlayer, longBreakPlayer]);

  // Update video when URL changes while player exists
  useEffect(() => {
    if (!workPlayer.isReady || !workVideoId) return;
    workPlayer.loadVideo(workVideoId);
  }, [workVideoId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!shortBreakPlayer.isReady || !shortBreakVideoId) return;
    shortBreakPlayer.loadVideo(shortBreakVideoId);
  }, [shortBreakVideoId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!longBreakPlayer.isReady || !longBreakVideoId) return;
    longBreakPlayer.loadVideo(longBreakVideoId);
  }, [longBreakVideoId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fade-out: last 5 seconds of session
  useEffect(() => {
    if (status !== "running") return;

    const activePlayer = getPlayer(sessionType);

    if (remainingSeconds <= FADE_DURATION && remainingSeconds > 0) {
      const volume = Math.round((remainingSeconds / FADE_DURATION) * 100);
      activePlayer.setVolume(Math.max(0, Math.min(100, volume)));
    } else if (remainingSeconds > FADE_DURATION) {
      activePlayer.setVolume(100);
    }
  }, [remainingSeconds, status, sessionType, getPlayer]);

  // Session transition: fade-in new deck
  useEffect(() => {
    if (status !== "running") return;
    if (sessionType === prevSessionTypeRef.current) return;

    const prevType = prevSessionTypeRef.current;
    prevSessionTypeRef.current = sessionType;

    // Pause outgoing deck
    const outgoing = getPlayer(prevType);
    outgoing.setVolume(0);
    outgoing.pause();

    // Start incoming deck with fade-in
    const incoming = getPlayer(sessionType);
    incoming.setVolume(0);
    incoming.play();

    clearFadeIn();
    let step = 0;
    fadeInIntervalRef.current = setInterval(() => {
      step++;
      const volume = Math.round((step / FADE_IN_STEPS) * 100);
      incoming.setVolume(Math.min(100, volume));
      if (step >= FADE_IN_STEPS) {
        clearFadeIn();
      }
    }, FADE_IN_INTERVAL_MS);
  }, [sessionType, status, getPlayer, clearFadeIn]);

  // Pause/Resume sync
  useEffect(() => {
    if (status === "paused") {
      clearFadeIn();
      workPlayer.pause();
      shortBreakPlayer.pause();
      longBreakPlayer.pause();
    } else if (status === "running" && playersInitialized) {
      const active = getPlayer(sessionType);
      active.play();
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset / Complete: stop all and reset position to start
  useEffect(() => {
    if (status === "idle") {
      clearFadeIn();
      workPlayer.stop();
      shortBreakPlayer.stop();
      longBreakPlayer.stop();
      workPlayer.seekToStart();
      shortBreakPlayer.seekToStart();
      longBreakPlayer.seekToStart();
      if (isComplete) {
        setPlayersInitialized(false);
      }
    }
  }, [status, isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearFadeIn();
      workPlayer.destroy();
      shortBreakPlayer.destroy();
      longBreakPlayer.destroy();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    workUrl,
    shortBreakUrl,
    longBreakUrl,
    workVideoId,
    shortBreakVideoId,
    longBreakVideoId,
    workUrlError,
    shortBreakUrlError,
    longBreakUrlError,
    playerError,
    setWorkUrl,
    setShortBreakUrl,
    setLongBreakUrl,
    clearPlayerError: () => setPlayerError(null),
    initializePlayers,
    playersInitialized,
  };
}
