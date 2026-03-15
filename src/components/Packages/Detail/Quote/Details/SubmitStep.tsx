import { FaExclamationCircle } from "react-icons/fa";
import { type Locale, type QuoteStatus, t } from "@/types/quote";
import { Step } from "./ui/Step";

export function SubmitStep({
  locale,
  number,
  status,
  errorMsg,
  termsAccepted,
}: {
  locale: Locale;
  number: number;
  status: QuoteStatus;
  errorMsg: string;
  termsAccepted: boolean;
}) {
  return (
    <Step number={number} label={t(locale, "Enviar solicitud", "Send request")}>
      {status === "error" && (
        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
          <FaExclamationCircle className="flex-shrink-0" />
          <span>{errorMsg || t(locale, "Ocurrió un error.", "An error occurred.")}</span>
        </div>
      )}
      <button
        type="submit"
        disabled={status === "loading" || !termsAccepted}
        className="
          w-full py-3 px-6
          bg-[var(--accent)] text-[var(--bg)]
          font-bold text-sm uppercase tracking-widest
          rounded-sm transition-all duration-200
          hover:opacity-90 active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {status === "loading" ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {t(locale, "Enviando...", "Sending...")}
          </>
        ) : (
          t(locale, "Enviar", "Send")
        )}
      </button>
      <p className="text-[var(--text)]/30 text-[11px] text-center">
        {t(
          locale,
          "Revisaremos tu solicitud y te contactaremos a la brevedad",
          "We'll review your request and contact you shortly",
        )}
      </p>
    </Step>
  );
}