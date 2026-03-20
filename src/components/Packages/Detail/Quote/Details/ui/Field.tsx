export function Field({
  icon,
  label,
  required,
  className,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1  ${className ?? ""}`}>
      <label className="flex items-center gap-2 text-[var(--text)]/50 text-xs uppercase tracking-wider mb-2">
        <span className="text-[var(--accent)]">{icon}</span>
        {label}
        {required && <span className="text-[var(--accent)]">*</span>}
      </label>
      {children}
    </div>
  );
}