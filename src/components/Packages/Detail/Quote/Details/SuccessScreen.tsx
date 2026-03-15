import { FaCheckCircle } from "react-icons/fa";
import { type Locale, t } from "@/types/quote";

export function SuccessScreen({
  locale,
  onReset,
}: {
  locale: Locale;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center gap-4">
      <FaCheckCircle className="text-[var(--accent)] text-5xl" />
      <h4 className="text-[var(--accent)] font-bold text-xl uppercase tracking-wider">
        {t(locale, "¡Solicitud enviada!", "Request sent!")}
      </h4>
      <p className="text-[var(--text)]/60 text-sm leading-relaxed max-w-xs">
        {t(
          locale,
          "Revisaremos tu solicitud y te contactaremos a la brevedad.",
          "We'll review your request and contact you shortly.",
        )}
      </p>
      <button
        onClick={onReset}
        className="mt-2 text-xs text-[var(--accent)]/50 hover:text-[var(--accent)] underline transition-colors"
      >
        {t(locale, "Enviar otra solicitud", "Send another request")}
      </button>
    </div>
  );
}