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

export interface DualDeckState {
  workUrl: string;
  breakUrl: string;
  workVideoId: string | null;
  breakVideoId: string | null;
  workUrlError: string | null;
  breakUrlError: string | null;
  playerError: string | null;
  setWorkUrl: (url: string) => void;
  setBreakUrl: (url: string) => void;
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
): DualDeckState {
  // URL state (persisted)
  const [workUrl, setWorkUrlState] = useLocalStorage("pomodisc:workUrl", "");
  const [breakUrl, setBreakUrlState] = useLocalStorage("pomodisc:breakUrl", "");
  const [workVideoId, setWorkVideoId] = useState<string | null>(() => extractVideoId(workUrl));
  const [breakVideoId, setBreakVideoId] = useState<string | null>(() => extractVideoId(breakUrl));
  const [workUrlError, setWorkUrlError] = useState<string | null>(null);
  const [breakUrlError, setBreakUrlError] = useState<string | null>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [playersInitialized, setPlayersInitialized] = useState(false);

  // Re-derive video IDs when URLs are hydrated from localStorage
  useEffect(() => {
    if (!workUrl) return;
    const id = extractVideoId(workUrl);
    setWorkVideoId(id);
    if (!id) setWorkUrlError("Invalid YouTube URL");
  }, [workUrl]);

  useEffect(() => {
    if (!breakUrl) return;
    const id = extractVideoId(breakUrl);
    setBreakVideoId(id);
    if (!id) setBreakUrlError("Invalid YouTube URL");
  }, [breakUrl]);

  // Players
  const workPlayer = useYouTubePlayer({
    elementId: "yt-player-work",
    onError: (code) => setPlayerError(getYouTubeErrorMessage(code)),
  });
  const breakPlayer = useYouTubePlayer({
    elementId: "yt-player-break",
    onError: (code) => setPlayerError(getYouTubeErrorMessage(code)),
  });

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

  const setBreakUrl = useCallback((url: string) => {
    setBreakUrlState(url);
    if (!url.trim()) {
      setBreakVideoId(null);
      setBreakUrlError(null);
      return;
    }
    const id = extractVideoId(url);
    if (id) {
      setBreakVideoId(id);
      setBreakUrlError(null);
    } else {
      setBreakVideoId(null);
      setBreakUrlError("Invalid YouTube URL");
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
    if (breakVideoId && !breakPlayer.isReady) {
      breakPlayer.createPlayer(breakVideoId);
    }
  }, [ytApiReady, breakVideoId, breakPlayer, playersInitialized]);

  // Initialize players on Start (user gesture context)
  const initializePlayers = useCallback(() => {
    if (!ytApiReady) return;

    if (workVideoId) {
      if (!workPlayer.isReady) {
        workPlayer.createPlayer(workVideoId);
      }
      // Play work deck immediately (within user gesture)
      // Slight delay to ensure player is ready after creation
      setTimeout(() => {
        workPlayer.setVolume(100);
        workPlayer.play();
      }, 100);
    }

    if (breakVideoId && !breakPlayer.isReady) {
      breakPlayer.createPlayer(breakVideoId);
    }

    setPlayersInitialized(true);
  }, [ytApiReady, workVideoId, breakVideoId, workPlayer, breakPlayer]);

  // Update video when URL changes while player exists
  useEffect(() => {
    if (!workPlayer.isReady || !workVideoId) return;
    workPlayer.loadVideo(workVideoId);
  }, [workVideoId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!breakPlayer.isReady || !breakVideoId) return;
    breakPlayer.loadVideo(breakVideoId);
  }, [breakVideoId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fade-out: last 5 seconds of session
  useEffect(() => {
    if (status !== "running") return;

    const activePlayer = sessionType === "work" ? workPlayer : breakPlayer;

    if (remainingSeconds <= FADE_DURATION && remainingSeconds > 0) {
      const volume = Math.round((remainingSeconds / FADE_DURATION) * 100);
      activePlayer.setVolume(Math.max(0, Math.min(100, volume)));
    } else if (remainingSeconds > FADE_DURATION) {
      activePlayer.setVolume(100);
    }
  }, [remainingSeconds, status, sessionType, workPlayer, breakPlayer]);

  // Session transition: fade-in new deck
  useEffect(() => {
    if (status !== "running") return;
    if (sessionType === prevSessionTypeRef.current) return;
    prevSessionTypeRef.current = sessionType;

    // Stop outgoing deck
    const outgoing = sessionType === "work" ? breakPlayer : workPlayer;
    outgoing.stop();

    // Start incoming deck with fade-in
    const incoming = sessionType === "work" ? workPlayer : breakPlayer;
    incoming.setVolume(0);
    incoming.seekToStart();
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
  }, [sessionType, status, workPlayer, breakPlayer, clearFadeIn]);

  // Pause/Resume sync
  useEffect(() => {
    if (status === "paused") {
      clearFadeIn();
      workPlayer.pause();
      breakPlayer.pause();
    } else if (status === "running" && playersInitialized) {
      // Resume the active deck
      const active = sessionType === "work" ? workPlayer : breakPlayer;
      active.play();
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset / Complete: stop both
  useEffect(() => {
    if (status === "idle") {
      clearFadeIn();
      workPlayer.stop();
      breakPlayer.stop();
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
      breakPlayer.destroy();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    workUrl,
    breakUrl,
    workVideoId,
    breakVideoId,
    workUrlError,
    breakUrlError,
    playerError,
    setWorkUrl,
    setBreakUrl,
    clearPlayerError: () => setPlayerError(null),
    initializePlayers,
    playersInitialized,
  };
}
