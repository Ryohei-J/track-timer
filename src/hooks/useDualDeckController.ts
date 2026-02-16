"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { SessionType, TimerStatus, AudioSource } from "@/types/timer";
import { useYouTubePlayer } from "./useYouTubePlayer";
import { useLibraryPlayer } from "./useLibraryPlayer";
import { useLocalStorage } from "./useLocalStorage";
import { extractVideoId } from "@/lib/youtube";
import { getTrackById, DEFAULT_LIBRARY_TRACK_ID } from "@/lib/libraryTracks";

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

  workAudioSource: AudioSource;
  shortBreakAudioSource: AudioSource;
  longBreakAudioSource: AudioSource;
  setWorkAudioSource: (source: AudioSource) => void;
  setShortBreakAudioSource: (source: AudioSource) => void;
  setLongBreakAudioSource: (source: AudioSource) => void;

  workLibraryTrackId: string;
  shortBreakLibraryTrackId: string;
  longBreakLibraryTrackId: string;
  setWorkLibraryTrackId: (id: string) => void;
  setShortBreakLibraryTrackId: (id: string) => void;
  setLongBreakLibraryTrackId: (id: string) => void;
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

  // Audio source state (persisted)
  const [workAudioSource, setWorkAudioSource] = useLocalStorage<AudioSource>("pomotimerx:workAudioSource", "youtube");
  const [shortBreakAudioSource, setShortBreakAudioSource] = useLocalStorage<AudioSource>("pomotimerx:shortBreakAudioSource", "youtube");
  const [longBreakAudioSource, setLongBreakAudioSource] = useLocalStorage<AudioSource>("pomotimerx:longBreakAudioSource", "youtube");

  // Library track selection (persisted)
  const [workLibraryTrackId, setWorkLibraryTrackId] = useLocalStorage("pomotimerx:workLibraryTrack", DEFAULT_LIBRARY_TRACK_ID);
  const [shortBreakLibraryTrackId, setShortBreakLibraryTrackId] = useLocalStorage("pomotimerx:shortBreakLibraryTrack", DEFAULT_LIBRARY_TRACK_ID);
  const [longBreakLibraryTrackId, setLongBreakLibraryTrackId] = useLocalStorage("pomotimerx:longBreakLibraryTrack", DEFAULT_LIBRARY_TRACK_ID);

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

  // YouTube Players
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

  // Library Players
  const workLibPlayer = useLibraryPlayer();
  const shortBreakLibPlayer = useLibraryPlayer();
  const longBreakLibPlayer = useLibraryPlayer();

  // Refs for audio source to use in callbacks without stale closures
  const workAudioSourceRef = useRef(workAudioSource);
  workAudioSourceRef.current = workAudioSource;
  const shortBreakAudioSourceRef = useRef(shortBreakAudioSource);
  shortBreakAudioSourceRef.current = shortBreakAudioSource;
  const longBreakAudioSourceRef = useRef(longBreakAudioSource);
  longBreakAudioSourceRef.current = longBreakAudioSource;

  const getAudioSource = useCallback((type: SessionType): AudioSource => {
    if (type === "work") return workAudioSourceRef.current;
    if (type === "shortBreak") return shortBreakAudioSourceRef.current;
    return longBreakAudioSourceRef.current;
  }, []);

  const getActivePlayer = useCallback((type: SessionType) => {
    const source = getAudioSource(type);
    if (source === "library") {
      if (type === "work") return workLibPlayer;
      if (type === "shortBreak") return shortBreakLibPlayer;
      return longBreakLibPlayer;
    }
    if (type === "work") return workPlayer;
    if (type === "shortBreak") return shortBreakPlayer;
    return longBreakPlayer;
  }, [getAudioSource, workLibPlayer, shortBreakLibPlayer, longBreakLibPlayer, workPlayer, shortBreakPlayer, longBreakPlayer]);

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

  // Load library tracks when track selection changes
  useEffect(() => {
    const track = getTrackById(workLibraryTrackId);
    if (track) workLibPlayer.loadTrack(track.src);
  }, [workLibraryTrackId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const track = getTrackById(shortBreakLibraryTrackId);
    if (track) shortBreakLibPlayer.loadTrack(track.src);
  }, [shortBreakLibraryTrackId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const track = getTrackById(longBreakLibraryTrackId);
    if (track) longBreakLibPlayer.loadTrack(track.src);
  }, [longBreakLibraryTrackId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-create YouTube players when URLs are set and API is ready
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
    // YouTube: create players if needed
    if (ytApiReady) {
      if (workVideoId && !workPlayer.isReady) {
        workPlayer.createPlayer(workVideoId);
      }
      if (shortBreakVideoId && !shortBreakPlayer.isReady) {
        shortBreakPlayer.createPlayer(shortBreakVideoId);
      }
      if (longBreakVideoId && !longBreakPlayer.isReady) {
        longBreakPlayer.createPlayer(longBreakVideoId);
      }
    }

    // Library: load selected tracks
    const workTrack = getTrackById(workLibraryTrackId);
    if (workTrack) workLibPlayer.loadTrack(workTrack.src);
    const shortBreakTrack = getTrackById(shortBreakLibraryTrackId);
    if (shortBreakTrack) shortBreakLibPlayer.loadTrack(shortBreakTrack.src);
    const longBreakTrack = getTrackById(longBreakLibraryTrackId);
    if (longBreakTrack) longBreakLibPlayer.loadTrack(longBreakTrack.src);

    // Start the work deck (always first session)
    if (workAudioSourceRef.current === "library") {
      workLibPlayer.setVolume(100);
      workLibPlayer.play();
    } else if (workVideoId) {
      setTimeout(() => {
        workPlayer.setVolume(100);
        workPlayer.play();
      }, 100);
    }

    setPlayersInitialized(true);
  }, [ytApiReady, workVideoId, shortBreakVideoId, longBreakVideoId,
      workPlayer, shortBreakPlayer, longBreakPlayer,
      workLibPlayer, shortBreakLibPlayer, longBreakLibPlayer,
      workLibraryTrackId, shortBreakLibraryTrackId, longBreakLibraryTrackId]);

  // Update or remove video when URL changes while player exists
  useEffect(() => {
    if (!workPlayer.isReady) return;
    if (workVideoId) {
      workPlayer.loadVideo(workVideoId);
    } else {
      workPlayer.destroy();
    }
  }, [workVideoId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!shortBreakPlayer.isReady) return;
    if (shortBreakVideoId) {
      shortBreakPlayer.loadVideo(shortBreakVideoId);
    } else {
      shortBreakPlayer.destroy();
    }
  }, [shortBreakVideoId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!longBreakPlayer.isReady) return;
    if (longBreakVideoId) {
      longBreakPlayer.loadVideo(longBreakVideoId);
    } else {
      longBreakPlayer.destroy();
    }
  }, [longBreakVideoId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fade-out: last 5 seconds of session
  useEffect(() => {
    if (status !== "running") return;

    const activePlayer = getActivePlayer(sessionType);

    if (remainingSeconds <= FADE_DURATION && remainingSeconds > 0) {
      const volume = Math.round((remainingSeconds / FADE_DURATION) * 100);
      activePlayer.setVolume(Math.max(0, Math.min(100, volume)));
    } else if (remainingSeconds > FADE_DURATION) {
      activePlayer.setVolume(100);
    }
  }, [remainingSeconds, status, sessionType, getActivePlayer]);

  // Session transition: fade-in new deck
  useEffect(() => {
    if (status !== "running") return;
    if (sessionType === prevSessionTypeRef.current) return;

    const prevType = prevSessionTypeRef.current;
    prevSessionTypeRef.current = sessionType;

    // Pause outgoing deck
    const outgoing = getActivePlayer(prevType);
    outgoing.setVolume(0);
    outgoing.pause();

    // Start incoming deck with fade-in
    const incoming = getActivePlayer(sessionType);
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
  }, [sessionType, status, getActivePlayer, clearFadeIn]);

  // Pause/Resume sync
  useEffect(() => {
    if (status === "paused") {
      clearFadeIn();
      // Pause all players (both YouTube and Library)
      workPlayer.pause();
      shortBreakPlayer.pause();
      longBreakPlayer.pause();
      workLibPlayer.pause();
      shortBreakLibPlayer.pause();
      longBreakLibPlayer.pause();
    } else if (status === "running" && playersInitialized) {
      const active = getActivePlayer(sessionType);
      active.play();
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset / Complete: pause all and reset position to start
  useEffect(() => {
    if (status === "idle") {
      clearFadeIn();
      // Pause all players
      workPlayer.pause();
      shortBreakPlayer.pause();
      longBreakPlayer.pause();
      workLibPlayer.pause();
      shortBreakLibPlayer.pause();
      longBreakLibPlayer.pause();
      // Seek all to start
      workPlayer.seekToStart();
      shortBreakPlayer.seekToStart();
      longBreakPlayer.seekToStart();
      workLibPlayer.seekToStart();
      shortBreakLibPlayer.seekToStart();
      longBreakLibPlayer.seekToStart();
      // seekTo can trigger playback on YouTube, so pause again after a short delay
      setTimeout(() => {
        workPlayer.pause();
        shortBreakPlayer.pause();
        longBreakPlayer.pause();
      }, 100);
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
      workLibPlayer.destroy();
      shortBreakLibPlayer.destroy();
      longBreakLibPlayer.destroy();
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

    workAudioSource,
    shortBreakAudioSource,
    longBreakAudioSource,
    setWorkAudioSource,
    setShortBreakAudioSource,
    setLongBreakAudioSource,

    workLibraryTrackId,
    shortBreakLibraryTrackId,
    longBreakLibraryTrackId,
    setWorkLibraryTrackId,
    setShortBreakLibraryTrackId,
    setLongBreakLibraryTrackId,
  };
}
