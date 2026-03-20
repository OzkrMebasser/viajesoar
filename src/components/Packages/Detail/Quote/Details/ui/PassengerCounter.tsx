import { useState } from "react";

export function PassengerCounter({
  label,
  name,
  value,
  min = 0,
  onChange,
  optional = false,
}: {
  label: string;
  name: string;
  value: number;
  min?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  optional?: boolean;
}) {
  const [enabled, setEnabled] = useState(false);

  const dispatch = (next: number) => {
    const event = {
      target: { name, value: String(next), type: "number" },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  const handleToggle = () => {
    if (enabled) {
      dispatch(0); // reset a 0 al desactivar
    }
    setEnabled((prev) => !prev);
  };

  return (
    <div className="bg-white/5 border border-[var(--border)]/30 rounded-sm p-2 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[var(--text)]/50 text-xs leading-tight">{label}</p>
        {optional && (
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={handleToggle}
              className="accent-[var(--accent)]"
            />
            <span className="text-xs text-[var(--text)]/40">Sí</span>
          </label>
        )}
      </div>

      {(!optional || enabled) && (
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => dispatch(Math.max(min, value - 1))}
            className="w-7 h-7 rounded-sm bg-[var(--accent)]/10 text-[var(--accent)] font-bold text-base hover:bg-[var(--accent)]/20 transition-colors flex items-center justify-center"
          >
            −
          </button>
          <span className="text-[var(--accent)] font-bold text-lg min-w-[2ch] text-center">
            {value}
          </span>
          <button
            type="button"
            onClick={() => dispatch(Math.min(20, value + 1))}
            className="w-7 h-7 rounded-sm bg-[var(--accent)]/10 text-[var(--accent)] font-bold text-base hover:bg-[var(--accent)]/20 transition-colors flex items-center justify-center"
          >
            +
          </button>
        </div>
      )}

      {optional && !enabled && (
        <p className="text-[var(--text)]/25 text-xs">Sin menores</p>
      )}
    </div>
  );
}