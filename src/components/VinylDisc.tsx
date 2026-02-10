"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useAnimationFrame } from "motion/react";
import type { SessionType } from "@/types/timer";

interface VinylDiscProps {
  isPlaying: boolean;
  sessionType: SessionType;
  isActive: boolean;
}

const RPM = 33.3;
const DEGREES_PER_MS = (RPM * 360) / 60_000;

export function VinylDisc({ isPlaying, sessionType, isActive }: VinylDiscProps) {
  const rotate = useMotionValue(0);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  useAnimationFrame((_, delta) => {
    if (!isPlayingRef.current) return;
    rotate.set(rotate.get() + DEGREES_PER_MS * delta);
  });

  // Reset rotation when not active and not playing
  useEffect(() => {
    if (!isActive && !isPlaying) {
      rotate.set(0);
    }
  }, [isActive, isPlaying, rotate]);

  const isWork = sessionType === "work";
  const labelColor = isWork ? "var(--c-work)" : "var(--c-break)";
  const glowColor = isWork
    ? "drop-shadow(0 0 16px color-mix(in srgb, var(--c-work) 50%, transparent))"
    : "drop-shadow(0 0 16px color-mix(in srgb, var(--c-break) 50%, transparent))";

  return (
    <div className="flex justify-center">
      <motion.div
        className="w-40 h-40 rounded-full relative"
        style={{
          rotate,
          background: `
            radial-gradient(circle,
              #c0c0c0 0%, #c0c0c0 4%,
              ${labelColor} 4.5%, ${labelColor} 15%,
              var(--c-vinyl-groove) 15.5%, var(--c-vinyl-groove-alt) 18%,
              var(--c-vinyl-groove) 18.5%, var(--c-vinyl-groove-alt) 22%,
              var(--c-vinyl-groove) 22.5%, var(--c-vinyl-groove-alt) 28%,
              var(--c-vinyl-groove) 28.5%, var(--c-vinyl-groove-alt) 34%,
              var(--c-vinyl-groove) 34.5%, var(--c-vinyl-groove-alt) 42%,
              var(--c-vinyl-groove) 42.5%, var(--c-vinyl-groove-alt) 52%,
              var(--c-vinyl-groove) 52.5%, var(--c-vinyl-groove-alt) 64%,
              var(--c-vinyl-groove) 64.5%, var(--c-vinyl-groove-alt) 78%,
              var(--c-vinyl-groove) 78.5%, var(--c-vinyl-groove-alt) 92%,
              var(--c-vinyl-groove) 92.5%, var(--c-vinyl-groove-alt) 100%
            )
          `,
          filter: isActive ? glowColor : "none",
          transition: "filter 0.3s ease",
        }}
      >
        {/* Highlight reflection for realism */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
          }}
        />
      </motion.div>
    </div>
  );
}
