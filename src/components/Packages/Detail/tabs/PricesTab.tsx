import type { PackageDetail, Supplement } from "@/types/packages";

type Locale = "es" | "en";
const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

type PricesPkg = Pick<
  PackageDetail,
  | "price_from"
  | "price_triple"
  | "price_single"
  | "price_child"
  | "price_infant"
  | "taxes"
  | "deposit_amount"
  | "prices_valid_until"
  | "supplements"
  | "currency"
  | "notes"
>;

interface Props {
  pkg: PricesPkg;
  locale: Locale;
}

export default function PricesTab({ pkg, locale }: Props) {
  const supplements: Supplement[] = Array.isArray(pkg.supplements)
    ? pkg.supplements
    : [];

  return (
    <div>
      <h2 className="text-2xl sm:text-4xl font-bold text-theme-tittles uppercase mb-2">
        {t(locale, "Tarifas", "Prices")}
      </h2>
      <p className="text-[var(--text)]/80 text-sm mb-8">
        {t(
          locale,
          "Precios por persona en USD. Sujetos a cambio sin previo aviso.",
          "Prices per person in USD. Subject to change without notice.",
        )}
      </p>

      {/* ── Price grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Double */}
        <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 flex justify-between items-center hover:border-[var(--accent)]/30 transition-colors">
          <span className="text-[var(--text)]/60 text-sm font-semibold">
            {t(locale, "Doble", "Double")}
          </span>
          <span className="text-[var(--accent)] font-bold text-2xl">
            ${Number(pkg.price_from).toLocaleString()}
          </span>
        </div>

        {pkg.price_triple && (
          <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 flex justify-between items-center hover:border-[var(--accent)]/30 transition-colors">
            <span className="text-[var(--text)]/60 text-sm font-semibold">
              {t(locale, "Triple", "Triple")}
            </span>
            <span className="text-[var(--accent)] font-bold text-2xl">
              ${Number(pkg.price_triple).toLocaleString()}
            </span>
          </div>
        )}

        {pkg.price_single && (
          <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 flex justify-between items-center hover:border-[var(--accent)]/30 transition-colors">
            <span className="text-[var(--text)]/60 text-sm font-semibold">
              {t(locale, "Sencilla", "Single")}
            </span>
            <span className="text-[var(--accent)] font-bold text-2xl">
              ${Number(pkg.price_single).toLocaleString()}
            </span>
          </div>
        )}

        {pkg.price_child && (
          <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 flex justify-between items-center hover:border-[var(--accent)]/30 transition-colors">
            <span className="text-[var(--text)]/60 text-sm font-semibold">
              {t(locale, "Menor", "Child")}
            </span>
            <span className="text-[var(--accent)] font-bold text-2xl">
              ${Number(pkg.price_child).toLocaleString()}
            </span>
          </div>
        )}

        {pkg.price_infant && (
          <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 flex justify-between items-center hover:border-[var(--accent)]/30 transition-colors">
            <span className="text-[var(--text)]/60 text-sm font-semibold">
              {t(locale, "Infante", "Infant")}
            </span>
            <span className="text-[var(--accent)] font-bold text-2xl">
              ${Number(pkg.price_infant).toLocaleString()}
            </span>
          </div>
        )}

        {pkg.taxes && (
          <div className="sm:col-span-2 bg-white/10 border border-[var(--border)]/40 rounded-sm p-5 flex justify-between items-center">
            <span className="text-[var(--text)]/60 text-sm">
              {t(locale, "Impuestos aéreos (por adulto)", "Air taxes (per adult)")}
            </span>
            <span className="text-[var(--accent)]/80 font-bold text-2xl">
              + ${Number(pkg.taxes).toLocaleString()}
            </span>
          </div>
        )}

        {pkg.prices_valid_until && (
          <div className="sm:col-span-2 text-center text-[var(--text)]/60 text-xs pt-2">
            {t(locale, "Precios vigentes hasta el", "Prices valid until")}{" "}
            {new Date(pkg.prices_valid_until).toLocaleDateString(
              locale === "es" ? "es-MX" : "en-US",
              { day: "2-digit", month: "long", year: "numeric" },
            )}
          </div>
        )}
      </div>

      {/* ── Deposit ── */}
      {pkg.deposit_amount && (
        <div className="mt-6 bg-[var(--accent)]/10 border-l-2 border-[var(--border)]/40 px-5 py-4 rounded-sm">
          <p className="text-[var(--text)]/60 text-xs tracking-widest uppercase font-semibold mb-1">
            {t(locale, "Anticipo requerido", "Deposit required")}
          </p>
          <p className="text-white/60 text-sm">
            ${Number(pkg.deposit_amount).toLocaleString()} USD{" "}
            {t(locale, "por persona, no reembolsable.", "per person, non-refundable.")}
          </p>
        </div>
      )}

      {/* ── Supplements ── */}
      {supplements.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] flex-1 bg-[var(--border)]/40" />
            {/* text-theme  text-center uppercase text-lg font-bold mb-3 tracking-wider */}
            <span className=" tracking-[0.25em] uppercase text-lg font-bold mb-3 tracking-wider text-[var(--accent)]/80">
              {t(locale, "Suplementos por fecha de salida", "Departure date supplements")}
            </span>
            <div className="h-[1px] flex-1 bg-[var(--border)]/40" />
          </div>

          <div className="space-y-3">
            {supplements.map((sup, i) => {
              const byMonth: Record<string, number[]> = {};
              sup.dates.forEach((d) => {
                const dt = new Date(d + "T00:00:00");
                const key = dt.toLocaleDateString(
                  locale === "es" ? "es-MX" : "en-US",
                  { month: "long", year: "numeric" },
                );
                if (!byMonth[key]) byMonth[key] = [];
                byMonth[key].push(dt.getDate());
              });

              return (
                <div
                  key={i}
                  className="bg-white/5 border border-[var(--border)]/40 rounded-sm px-5 py-4 hover:border-[var(--accent)]/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      {Object.entries(byMonth).map(([month, days]) => (
                        <p key={month} className="text-sm text-[var(--text)]/80 text-sm leading-relaxed  capitalize">
                          <span className="text-[var(--text)]/80  font-semibold">{month}:</span>{" "}
                          <span className="ml-2">{days.sort((a, b) => a - b).join(", ")}</span>
                        </p>
                      ))}
                    </div>
                    <div className="shrink-0 flex flex-col items-end">
                      <span className="text-[10px] tracking-[0.15em] uppercase text-[var(--accent)]/50 mb-0.5">
                        {t(locale, "suplemento", "supplement")}
                      </span>
                      <span className="text-[var(--accent)] font-bold text-xl">
                        +${sup.amount}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-white/30 mt-3 leading-relaxed">
            {t(
              locale,
              "* El suplemento se suma al precio base según la fecha de salida elegida. Consulta disponibilidad con tu ejecutivo.",
              "* Supplement is added to the base price based on the selected departure date. Check availability with your agent.",
            )}
          </p>
{/* 
          aqui quiero las notas */}
        </div>
      )}
    </div>
  );
}