declare namespace YT {
  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }

  interface PlayerOptions {
    width?: number | string;
    height?: number | string;
    videoId?: string;
    playerVars?: Record<string, unknown>;
    events?: {
      onReady?: (event: { target: Player }) => void;
      onStateChange?: (event: { target: Player; data: PlayerState }) => void;
      onError?: (event: { target: Player; data: number }) => void;
    };
  }

  class Player {
    constructor(elementId: string | HTMLElement, options: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead?: boolean): void;
    setVolume(volume: number): void;
    getVolume(): number;
    getPlayerState(): PlayerState;
    loadVideoById(videoId: string): void;
    cueVideoById(videoId: string): void;
    destroy(): void;
  }
}

interface Window {
  YT: typeof YT;
  onYouTubeIframeAPIReady?: () => void;
}
