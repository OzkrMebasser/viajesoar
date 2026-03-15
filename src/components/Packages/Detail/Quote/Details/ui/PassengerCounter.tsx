export function PassengerCounter({
  label,
  name,
  value,
  min = 0,
  onChange,
}: {
  label: string;
  name: string;
  value: number;
  min?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="bg-white/5 border border-[var(--border)]/30 rounded-sm p-2 space-y-1">
      <p className="text-[var(--text)]/50 text-xs leading-tight">{label}</p>
      <input
        type="number" name={name} value={value}
        onChange={onChange} min={min} max={20}
        className="
          w-full bg-transparent text-[var(--accent)]
          font-bold text-lg text-center
          focus:outline-none border-b border-[var(--border)]/20
          focus:border-[var(--accent)]/40 transition-colors
        "
        placeholder="0"
      />
    </div>
  );
}