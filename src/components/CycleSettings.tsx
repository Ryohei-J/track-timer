"use client";

interface CycleSettingsProps {
  totalCycles: number;
  onTotalCyclesChange: (cycles: number) => void;
  longBreakEnabled: boolean;
  onLongBreakEnabledChange: (enabled: boolean) => void;
  disabled: boolean;
}

export function CycleSettings({
  totalCycles,
  onTotalCyclesChange,
  longBreakEnabled,
  onLongBreakEnabledChange,
  disabled,
}: CycleSettingsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-4 text-sm text-text-secondary">
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
        <span>Long break</span>
        <button
          role="switch"
          aria-checked={longBreakEnabled}
          onClick={() => onLongBreakEnabledChange(!longBreakEnabled)}
          disabled={disabled}
          className={`relative inline-flex h-5 w-9 items-center rounded-full
            transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1
            disabled:opacity-50 disabled:cursor-not-allowed
            ${longBreakEnabled ? "bg-accent" : "bg-surface-alt border border-divider"}`}
          aria-label={longBreakEnabled ? "Disable long break" : "Enable long break"}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow
              transform transition-transform
              ${longBreakEnabled ? "translate-x-4.5" : "translate-x-0.5"}`}
          />
        </button>
      </div>
    </div>
  );
}
