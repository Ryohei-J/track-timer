"use client";

import { useState, useEffect } from "react";

export function useYouTubeApi(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already loaded
    if (window.YT?.Player) {
      setReady(true);
      return;
    }

    // Set up the callback
    const existing = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      existing?.();
      setReady(true);
    };

    // Inject script if not already present
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return ready;
}
