"use client";

import { useRef, useCallback, useState, useEffect } from "react";

export interface UseLibraryPlayerReturn {
  isReady: boolean;
  loadTrack: (src: string) => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  seekToStart: () => void;
  destroy: () => void;
}

export function useLibraryPlayer(): UseLibraryPlayerReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 1;
    audioRef.current = audio;
    setIsReady(true);

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const loadTrack = useCallback((src: string) => {
    if (!audioRef.current) return;
    audioRef.current.src = src;
    audioRef.current.load();
  }, []);

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {});
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(100, volume)) / 100;
    }
  }, []);

  const seekToStart = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, []);

  const destroy = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      setIsReady(false);
    }
  }, []);

  return { isReady, loadTrack, play, pause, setVolume, seekToStart, destroy };
}
