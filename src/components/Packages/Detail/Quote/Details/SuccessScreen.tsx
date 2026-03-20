import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import ButtonArrow from "@/components/ui/ButtonArrow";
import { type Locale, t } from "@/types/quote";

export function SuccessScreen({
  locale,
  onReset,
}: {
  locale: Locale;
  onReset: () => void;
}) {
  const [seconds, setSeconds] = useState(10);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Pequeño delay para que el CSS transition tenga efecto
    const show = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(show);
  }, []);

useEffect(() => {
  const interval = setInterval(() => {
    setSeconds((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        setTimeout(() => onReset(), 0);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(interval);
}, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[var(--accent)]/20 backdrop-blur-sm transition-all duration-300 `}>
      <div className={`bg-gradient-theme border border-[var(--border)]/30 rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center text-center gap-4 max-w-sm w-full mx-4 transition-all duration-500 ${
        visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-6"
      }`}>
        <FaCheckCircle className="text-[var(--accent)] text-5xl" />
        <h4 className="text-[var(--accent)] font-bold text-xl uppercase tracking-wider">
          {t(locale, "¡Solicitud enviada!", "Request sent!")}
        </h4>
        <p className="text-[var(--text)]/60 text-sm leading-relaxed">
          {t(
            locale,
            "Revisaremos tu solicitud y te contactaremos a la brevedad.",
            "We'll review your request and contact you shortly.",
          )}
        </p>
        <p className="text-[var(--text)]/30 text-xs">
          {t(locale, `Cerrando en ${seconds}s...`, `Closing in ${seconds}s...`)}
        </p>
        <ButtonArrow
          title={t(locale, "Volver", "Go back")}
          onClick={onReset}
          className="mt-4"
        />
      </div>
    </div>
  );
}