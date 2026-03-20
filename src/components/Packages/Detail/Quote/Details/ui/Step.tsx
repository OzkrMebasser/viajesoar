import { type Locale, t } from "@/types/quote";


export function Step({
  number,
  label,
  children,
  // completed = false,
  // showStatus = true,
   locale = "es",
}: {
  number: number;
  label: string;
  children: React.ReactNode;
  completed?: boolean;
  showStatus?: boolean;
  locale?: Locale;
}) {
  return (
    <div className="space-y-2">
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
      <div className="space-y-3 p-2 lg:p-4">{children}</div>
{/* {showStatus && (
  <div className={`flex items-center justify-center gap-2 text-xs px-2 transition-colors duration-300 ${
    completed ? "text-[var(--accent)]/70" : "text-[var(--text)]/30"
  }`}>
    {completed ? (
      <>
        {t(locale, "Sección", "Section")}
        <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--accent)] text-white text-[9px] font-bold">
          {number}
        </span>
        {t(locale, "completada", "completed")}
      </>
    ) : (
      t(locale, "· Faltan campos por llenar", "· Missing required fields")
    )}
  </div>
)} */}
    </div>
  );
}