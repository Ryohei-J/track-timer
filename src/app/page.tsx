"use client";

import { useCallback } from "react";
import { useTimer } from "@/hooks/useTimer";
import { useYouTubeApi } from "@/hooks/useYouTubeApi";
import { useDualDeckController } from "@/hooks/useDualDeckController";
import { DeckPanel } from "@/components/DeckPanel";
import { TimerDisplay } from "@/components/TimerDisplay";
import { ControlBar } from "@/components/ControlBar";
import { CycleSettings } from "@/components/CycleSettings";
import { SessionIndicator } from "@/components/SessionIndicator";
import { ErrorModal } from "@/components/ErrorModal";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const timer = useTimer();
  const ytApiReady = useYouTubeApi();
  const deck = useDualDeckController(
    timer.sessionType,
    timer.status,
    timer.remainingSeconds,
    timer.isComplete,
    ytApiReady,
  );

  const isRunning = timer.status !== "idle";

  const handleStart = useCallback(() => {
    deck.initializePlayers();
    timer.start();
  }, [deck, timer]);

  return (
    <main className="min-h-screen bg-surface text-text-primary p-4 md:p-8 font-sans">
      <div className="flex items-center justify-center mb-8 md:mb-12 relative">
        <h1 className="text-2xl md:text-3xl font-bold text-center">PomoDisc</h1>
        <div className="absolute right-0">
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-8 items-start">
        {/* Left: Work Deck */}
        <DeckPanel
          type="work"
          durationMinutes={timer.workDurationMinutes}
          onDurationChange={timer.setWorkDuration}
          isActive={isRunning && timer.sessionType === "work"}
          isPlaying={timer.status === "running" && timer.sessionType === "work"}
          disabled={isRunning}
          youtubeUrl={deck.workUrl}
          onYoutubeUrlChange={deck.setWorkUrl}
          youtubeElementId="yt-player-work"
          urlError={deck.workUrlError}
        />

        {/* Center: Timer + Controls */}
        <div className="flex flex-col items-center gap-6">
          <TimerDisplay
            remainingSeconds={timer.remainingSeconds}
            sessionType={timer.sessionType}
            status={timer.status}
            isComplete={timer.isComplete}
          />
          <ControlBar
            status={timer.status}
            isComplete={timer.isComplete}
            onStart={handleStart}
            onPause={timer.pause}
            onResume={timer.resume}
            onReset={timer.reset}
          />
          <CycleSettings
            totalCycles={timer.totalCycles}
            onTotalCyclesChange={timer.setTotalCycles}
            disabled={isRunning}
          />
          <SessionIndicator
            sessionType={timer.sessionType}
            currentCycle={timer.currentCycle}
            totalCycles={timer.totalCycles}
            status={timer.status}
            isComplete={timer.isComplete}
          />
        </div>

        {/* Right: Break Deck */}
        <DeckPanel
          type="break"
          durationMinutes={timer.breakDurationMinutes}
          onDurationChange={timer.setBreakDuration}
          isActive={isRunning && timer.sessionType === "break"}
          isPlaying={timer.status === "running" && timer.sessionType === "break"}
          disabled={isRunning}
          youtubeUrl={deck.breakUrl}
          onYoutubeUrlChange={deck.setBreakUrl}
          youtubeElementId="yt-player-break"
          urlError={deck.breakUrlError}
        />
      </div>

      <ErrorModal
        isOpen={!!deck.playerError}
        message={deck.playerError || ""}
        onClose={deck.clearPlayerError}
      />
    </main>
  );
}
