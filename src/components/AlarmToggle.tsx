"use client";

interface AlarmToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function AlarmToggle({ enabled, onToggle }: AlarmToggleProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-text-secondary">
      <span>Alarm</span>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={() => onToggle(!enabled)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full
          transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1
          ${enabled ? "bg-accent" : "bg-surface-alt border border-divider"}`}
        aria-label={enabled ? "Disable alarm" : "Enable alarm"}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow
            transform transition-transform
            ${enabled ? "translate-x-4.5" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}
