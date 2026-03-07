import type { Note } from "@/types/packages";

type Locale = "es" | "en";
const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

interface NotesProps {
  notes: Note[] | null;
  locale: Locale;
  className?: string;
  showDisclaimer?: boolean;
}

export default function PackageNotes({ 
  notes, 
  locale, 
  className = "",
  showDisclaimer = true 
}: NotesProps) {
  if (!notes || notes.length === 0) return null;

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-[1px] flex-1 bg-[var(--border)]/40" />
        <span className="tracking-[0.25em] uppercase text-lg font-bold text-[var(--accent)]/80">
          {t(locale, "Notas importantes", "Important notes")}
        </span>
        <div className="h-[1px] flex-1 bg-[var(--border)]/40" />
      </div>

      <div className="space-y-4">
        {notes.map((note, index) => (
          <div 
            key={index}
            className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 hover:border-[var(--accent)]/20 transition-colors"
          >
            <h3 className="text-[var(--accent)] font-semibold text-sm uppercase tracking-wider mb-2">
              {note.title}
            </h3>
            <div 
              className="text-[var(--text)]/70 text-sm leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ 
                __html: note.content.replace(/\n/g, '<br />') 
              }}
            />
          </div>
        ))}
      </div>

      {showDisclaimer && (
        <p className="text-[11px] text-white/30 mt-4 leading-relaxed">
          {t(
            locale,
            "* Estas notas son importantes para tu reservación. Por favor, léelas cuidadosamente.",
            "* These notes are important for your booking. Please read them carefully.",
          )}
        </p>
      )}
    </div>
  );
}

// También puedes exportar una versión agrupada por tipo si lo necesitas
export function GroupedPackageNotes({ 
  notes, 
  locale, 
  className = "",
  showDisclaimer = true 
}: NotesProps) {
  if (!notes || notes.length === 0) return null;

  // Agrupar notas por tipo
  const groupedNotes = notes.reduce((acc, note) => {
    const type = note.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  // Mapeo de tipos a títulos en español/inglés
  const typeTitles: Record<string, { es: string; en: string }> = {
    importantes: { es: "NOTAS IMPORTANTES", en: "IMPORTANT NOTES" },
    tarifas: { es: "NOTAS DE LAS TARIFAS", en: "RATE NOTES" },
    hoteles: { es: "NOTAS DE HOTELES", en: "HOTEL NOTES" },
    generales: { es: "NOTAS GENERALES", en: "GENERAL NOTES" }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-[1px] flex-1 bg-[var(--border)]/40" />
        <span className="tracking-[0.25em] uppercase text-lg font-bold text-[var(--accent)]/80">
          {t(locale, "Notas importantes", "Important notes")}
        </span>
        <div className="h-[1px] flex-1 bg-[var(--border)]/40" />
      </div>

      <div className="space-y-6">
        {Object.entries(groupedNotes).map(([type, typeNotes]) => (
          <div key={type} className="space-y-3">
            <h3 className="text-[var(--accent)] font-bold text-base uppercase tracking-wider border-l-2 border-[var(--accent)] pl-3">
              {typeTitles[type]?.[locale] || typeNotes[0].title}
            </h3>
            {typeNotes.map((note, index) => (
              <div 
                key={index}
                className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 hover:border-[var(--accent)]/20 transition-colors"
              >
                <div 
                  className="text-[var(--text)]/70 text-sm leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ 
                    __html: note.content.replace(/\n/g, '<br />') 
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {showDisclaimer && (
        <p className="text-[11px] text-white/30 mt-4 leading-relaxed">
          {t(
            locale,
            "* Estas notas son importantes para tu reservación. Por favor, léelas cuidadosamente.",
            "* These notes are important for your booking. Please read them carefully.",
          )}
        </p>
      )}
    </div>
  );
}