"use client";

import { useRef, useCallback, useState } from "react";

interface UseYouTubePlayerOptions {
  elementId: string;
  onError?: (errorCode: number) => void;
}

export interface UseYouTubePlayerReturn {
  isReady: boolean;
  createPlayer: (videoId: string) => void;
  loadVideo: (videoId: string) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  seekToStart: () => void;
  destroy: () => void;
}

export function useYouTubePlayer({
  elementId,
  onError,
}: UseYouTubePlayerOptions): UseYouTubePlayerReturn {
  const playerRef = useRef<YT.Player | null>(null);
  const [isReady, setIsReady] = useState(false);
  const loopEnabledRef = useRef(true);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const createPlayer = useCallback(
    (videoId: string) => {
      // Destroy existing player if any
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
        playerRef.current = null;
        setIsReady(false);
      }

      if (!window.YT?.Player) return;

      playerRef.current = new YT.Player(elementId, {
        width: "100%",
        height: "100%",
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            setIsReady(true);
          },
          onStateChange: (event) => {
            if (
              event.data === YT.PlayerState.ENDED &&
              loopEnabledRef.current
            ) {
              event.target.seekTo(0, true);
              event.target.playVideo();
            }
          },
          onError: (event) => {
            onErrorRef.current?.(event.data);
          },
        },
      });
    },
    [elementId],
  );

  const loadVideo = useCallback((videoId: string) => {
    if (playerRef.current) {
      playerRef.current.cueVideoById(videoId);
    }
  }, []);

  const play = useCallback(() => {
    playerRef.current?.playVideo();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  const stop = useCallback(() => {
    playerRef.current?.stopVideo();
  }, []);

  const setVolume = useCallback((volume: number) => {
    playerRef.current?.setVolume(Math.max(0, Math.min(100, volume)));
  }, []);

  const seekToStart = useCallback(() => {
    playerRef.current?.seekTo(0, true);
  }, []);

  const destroy = useCallback(() => {
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch {
        // ignore
      }
      playerRef.current = null;
      setIsReady(false);
    }
  }, []);

  return {
    isReady,
    createPlayer,
    loadVideo,
    play,
    pause,
    stop,
    setVolume,
    seekToStart,
    destroy,
  };
}
