import { FaStar } from "react-icons/fa";

type Locale = "es" | "en";
const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

interface Props {
  locale: Locale;
}

export default function OptionalsTab({ locale }: Props) {
  return (
    <div>
      <h2 className="text-2xl sm:text-4xl font-bold text-theme-tittles uppercase mb-2">
        {t(locale, "Tours Opcionales", "Optional Tours")}
      </h2>
      <p className="text-[var(--text)]/80 text-sm mb-8">
        {t(
          locale,
          "Enriquece tu viaje con estas experiencias únicas.",
          "Enrich your trip with these unique experiences.",
        )}
      </p>
      <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-8 text-center">
        <FaStar className="text-[var(--text)]/60 text-3xl mx-auto mb-3 opacity-40" />
        <p className="text-[var(--text)]/60 text-sm">
          {t(
            locale,
            "Opcionales disponibles próximamente",
            "Optional tours coming soon",
          )}
        </p>
      </div>
    </div>
  );
}