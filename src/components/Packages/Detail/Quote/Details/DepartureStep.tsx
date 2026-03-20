import { type Locale, type Departure, t, formatDate } from "@/types/quote";
import { Step } from "./ui/Step";

export function DepartureStep({
  locale,
  number,
  departures,
  selectedDeparture,
  onSelect,
}: {
  locale: Locale;
  number: number;
  departures: Departure[];
  selectedDeparture: Departure | null;
  onSelect: (d: Departure) => void;
}) {
  const dep = selectedDeparture;
  const total = dep
    ? dep.price_base + dep.price_taxes + (dep.price_supplement ?? 0)
    : null;

  return (
    <Step number={number} label={t(locale, "Selecciona tu salida", "Select your departure")}  >
      <div className="space-y-2">
        {departures.map((d) => {
          const isSelected = selectedDeparture?.id === d.id;
          const depTotal = d.price_base + d.price_taxes + (d.price_supplement ?? 0);
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelect(d)}
              className={`
                w-full text-left rounded-sm border px-4 py-3 transition-all duration-150
                ${isSelected
                  ? "border-[var(--accent)]/60 bg-[var(--accent)]/5"
                  : "border-[var(--border)]/30 bg-white/5 hover:border-[var(--accent)]/30"}
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <p className="text-[var(--text)]/80 text-xs font-medium">
                    {t(locale, "Del", "From")}{" "}
                    <span className="text-[var(--accent)]">{formatDate(d.date_start, locale)}</span>{" "}
                    {t(locale, "al", "to")}{" "}
                    <span className="text-[var(--accent)]">{formatDate(d.date_end, locale)}</span>
                  </p>
                  <p className="text-[var(--text)]/40 text-[11px]">{d.departure_city}</p>
                  {d.availability === "last_spots" && (
                    <span className="inline-block text-amber-400 bg-amber-400/10 text-[10px] px-2 py-0.5 rounded-sm">
                      {t(locale, "Últimos espacios", "Last spots")}
                    </span>
                  )}
                </div>
                <div className="text-right flex-shrink-0 space-y-1">
                  <p className="text-[var(--text)]/40 text-[10px] uppercase tracking-wider">
                    {t(locale, "Total", "Total")}
                  </p>
                  <p className="text-[var(--accent)] font-bold text-sm">
                    ${depTotal.toLocaleString()}
                  </p>
                  <p className="text-[var(--text)]/30 text-[10px]">
                    {t(locale, "por persona", "per person")}
                  </p>
                </div>
              </div>
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-[var(--border)]/20 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[var(--text)]/30 text-[10px] uppercase tracking-wider">
                      {t(locale, "Tarifa base", "Base fare")}
                    </p>
                    <p className="text-[var(--text)]/70 text-xs font-medium">
                      ${d.price_base.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--text)]/30 text-[10px] uppercase tracking-wider">
                      {t(locale, "Impuestos", "Taxes")}
                    </p>
                    <p className="text-[var(--text)]/70 text-xs font-medium">
                      ${d.price_taxes.toLocaleString()}
                    </p>
                  </div>
                  {d.price_supplement != null && (
                    <div>
                      <p className="text-[var(--text)]/30 text-[10px] uppercase tracking-wider">
                        {t(locale, "Suplemento", "Supplement")}
                      </p>
                      <p className="text-[var(--text)]/70 text-xs font-medium">
                        ${d.price_supplement.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
      {dep && total != null && (
        <div className="flex justify-between items-baseline pt-2 border-t border-[var(--border)]/20">
          <span className="text-[var(--text)]/40 text-xs uppercase tracking-wider">
            {t(locale, "Total", "Total")}
          </span>
          <span className="text-[var(--accent)] font-bold text-base">
            ${total.toLocaleString()}{" "}
            <span className="text-[var(--text)]/40 text-[10px] font-normal uppercase tracking-wider">
              {t(locale, "por persona", "per person")}
            </span>
          </span>
        </div>
      )}
    </Step>
  );
}