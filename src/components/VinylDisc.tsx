"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useAnimationFrame } from "motion/react";

interface VinylDiscProps {
  isPlaying: boolean;
  isActive: boolean;
}

const RPM = 33.3;
const DEGREES_PER_MS = (RPM * 360) / 60_000;

export function VinylDisc({ isPlaying, isActive }: VinylDiscProps) {
  const rotate = useMotionValue(0);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  useAnimationFrame((_, delta) => {
    if (!isPlayingRef.current) return;
    rotate.set(rotate.get() + DEGREES_PER_MS * delta);
  });

  useEffect(() => {
    if (!isActive && !isPlaying) {
      rotate.set(0);
    }
  }, [isActive, isPlaying, rotate]);

  return (
    <div className="flex justify-center">
      <motion.div
        className="w-32 h-32 rounded-full"
        style={{
          rotate,
          background: `
            radial-gradient(circle,
              #d0d0d0 0%, #d0d0d0 3.5%,
              #1a1a1a 4%, #0d0d0d 76%,
              #a0a0a0 76.5%, #c8c8c8 84%,
              #b0b0b0 84.5%, #909090 100%
            )
          `,
          filter: isActive
            ? "drop-shadow(0 0 12px color-mix(in srgb, var(--c-accent) 35%, transparent))"
            : "none",
          transition: "filter 0.3s ease",
        }}
      />
    </div>
  );
}
