"use client";

interface CycleSettingsProps {
  totalCycles: number;
  onTotalCyclesChange: (cycles: number) => void;
  disabled: boolean;
}

export function CycleSettings({
  totalCycles,
  onTotalCyclesChange,
  disabled,
}: CycleSettingsProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-text-secondary">Cycles</label>
      <input
        type="number"
        min={1}
        max={20}
        value={totalCycles}
        onChange={(e) => onTotalCyclesChange(Number(e.target.value))}
        disabled={disabled}
        className="w-16 rounded-lg bg-surface p-2 text-center font-mono text-lg
          border border-surface-alt focus:outline-none focus:border-work
          disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
