"use client";

import { useCallback } from "react";
import Image from "next/image";
import { useTimer } from "@/hooks/useTimer";
import { useYouTubeApi } from "@/hooks/useYouTubeApi";
import { useDualDeckController } from "@/hooks/useDualDeckController";
import { useAlarm } from "@/hooks/useAlarm";
import { DeckPanel } from "@/components/DeckPanel";
import { TimerDisplay } from "@/components/TimerDisplay";
import { ControlBar } from "@/components/ControlBar";
import { CycleSettings } from "@/components/CycleSettings";
import { SessionIndicator } from "@/components/SessionIndicator";
import { ErrorModal } from "@/components/ErrorModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AlarmToggle } from "@/components/AlarmToggle";
import { Footer } from "@/components/Footer";

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
  const alarm = useAlarm(timer.remainingSeconds, timer.status, timer.sessionType);

  const isRunning = timer.status !== "idle";

  const handleStart = useCallback(() => {
    deck.initializePlayers();
    timer.start();
  }, [deck, timer]);

  return (
    <main className="min-h-screen bg-background text-text-primary p-4 md:p-8 font-sans flex flex-col items-center">
      <div className="w-full max-w-6xl bg-surface rounded-2xl overflow-hidden shadow-xl">
        {/* Header: 3-column grid matching deck layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 p-6 pb-4 items-start">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="PomotimerX logo" width={36} height={36} />
            <h1 className="text-2xl md:text-3xl font-bold">PomotimerX</h1>
          </div>

          {/* Center: Timer + Controls */}
          <div className="flex flex-col items-center gap-2">
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
            <SessionIndicator
              sessionType={timer.sessionType}
              currentCycle={timer.currentCycle}
              totalCycles={timer.totalCycles}
              status={timer.status}
              isComplete={timer.isComplete}
            />
          </div>

          {/* Right: Settings + Theme */}
          <div className="flex flex-col items-end gap-3">
            <ThemeToggle />
            <CycleSettings
              totalCycles={timer.totalCycles}
              onTotalCyclesChange={timer.setTotalCycles}
              longBreakInterval={timer.longBreakInterval}
              onLongBreakIntervalChange={timer.setLongBreakInterval}
              disabled={isRunning}
            />
            <AlarmToggle
              enabled={alarm.alarmEnabled}
              onToggle={alarm.setAlarmEnabled}
            />
          </div>
        </div>

        {/* 3-Deck Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-divider border-t border-divider">
          {/* Work Deck */}
          <DeckPanel
            type="work"
            durationMinutes={timer.workDurationMinutes}
            onDurationChange={timer.setWorkDuration}
            isActive={isRunning && timer.sessionType === "work"}
            disabled={isRunning}
            youtubeUrl={deck.workUrl}
            onYoutubeUrlChange={deck.setWorkUrl}
            youtubeElementId="yt-player-work"
            urlError={deck.workUrlError}
            audioSource={deck.workAudioSource}
            onAudioSourceChange={deck.setWorkAudioSource}
            libraryTrackId={deck.workLibraryTrackId}
            onLibraryTrackChange={deck.setWorkLibraryTrackId}
          />

          {/* Short Break Deck */}
          <DeckPanel
            type="shortBreak"
            durationMinutes={timer.shortBreakDurationMinutes}
            onDurationChange={timer.setShortBreakDuration}
            isActive={isRunning && timer.sessionType === "shortBreak"}
            disabled={isRunning}
            youtubeUrl={deck.shortBreakUrl}
            onYoutubeUrlChange={deck.setShortBreakUrl}
            youtubeElementId="yt-player-short-break"
            urlError={deck.shortBreakUrlError}
            audioSource={deck.shortBreakAudioSource}
            onAudioSourceChange={deck.setShortBreakAudioSource}
            libraryTrackId={deck.shortBreakLibraryTrackId}
            onLibraryTrackChange={deck.setShortBreakLibraryTrackId}
          />

          {/* Long Break Deck */}
          <DeckPanel
            type="longBreak"
            durationMinutes={timer.longBreakDurationMinutes}
            onDurationChange={timer.setLongBreakDuration}
            isActive={isRunning && timer.sessionType === "longBreak"}
            disabled={isRunning}
            youtubeUrl={deck.longBreakUrl}
            onYoutubeUrlChange={deck.setLongBreakUrl}
            youtubeElementId="yt-player-long-break"
            urlError={deck.longBreakUrlError}
            audioSource={deck.longBreakAudioSource}
            onAudioSourceChange={deck.setLongBreakAudioSource}
            libraryTrackId={deck.longBreakLibraryTrackId}
            onLibraryTrackChange={deck.setLongBreakLibraryTrackId}
          />
        </div>
      </div>

      <div className="flex-1" />
      <Footer />

      <ErrorModal
        isOpen={!!deck.playerError}
        message={deck.playerError || ""}
        onClose={deck.clearPlayerError}
      />
    </main>
  );
}
