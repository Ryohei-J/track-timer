"use client";

interface CycleSettingsProps {
  totalCycles: number;
  onTotalCyclesChange: (cycles: number) => void;
  longBreakInterval: number;
  onLongBreakIntervalChange: (n: number) => void;
  disabled: boolean;
}

export function CycleSettings({
  totalCycles,
  onTotalCyclesChange,
  longBreakInterval,
  onLongBreakIntervalChange,
  disabled,
}: CycleSettingsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
      <div className="flex items-center gap-2">
        <label>Cycles</label>
        <input
          type="number"
          min={1}
          max={20}
          value={totalCycles}
          onChange={(e) => onTotalCyclesChange(Number(e.target.value))}
          disabled={disabled}
          className="w-14 rounded-lg bg-surface-alt p-1.5 text-center font-mono
            border border-divider focus:outline-none focus:border-accent
            disabled:opacity-50 disabled:cursor-not-allowed text-text-primary"
        />
      </div>
      <div className="flex items-center gap-2">
        <label>Long break every</label>
        <input
          type="number"
          min={1}
          max={10}
          value={longBreakInterval}
          onChange={(e) => onLongBreakIntervalChange(Number(e.target.value))}
          disabled={disabled}
          className="w-14 rounded-lg bg-surface-alt p-1.5 text-center font-mono
            border border-divider focus:outline-none focus:border-accent
            disabled:opacity-50 disabled:cursor-not-allowed text-text-primary"
        />
        <span>sessions</span>
      </div>
    </div>
  );
}
