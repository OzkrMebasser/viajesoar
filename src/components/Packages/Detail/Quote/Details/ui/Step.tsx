export function Step({
  number,
  label,
  children,
}: {
  number: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="
          w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
          bg-[var(--accent)]/15 text-[var(--accent)] text-[10px] font-bold
        ">
          {number}
        </span>
        <span className="text-[var(--text)]/50 text-xs uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="space-y-3 pl-7">{children}</div>
    </div>
  );
}