import { FaCommentDots } from "react-icons/fa";
import { type Locale, type QuoteFormState, t } from "@/types/quote";
import { Step } from "./ui/Step";
import { Field } from "./ui/Field";

export function ConsentStep({
  locale,
  number,
  form,
  onChange,
}: {
  locale: Locale;
  number: number;
  form: QuoteFormState;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}) {
  return (
    <Step
      number={number}
      label={t(locale, "Comentarios y consentimiento", "Comments & consent")}
      completed={form.terms}
      locale={locale}
    >
      <Field
        icon={<FaCommentDots />}
        label={t(locale, "Comentarios", "Comments")}
      >
        <textarea
          name="message"
          value={form.message}
          onChange={onChange}
          rows={3}
          placeholder={t(
            locale,
            "¿Alguna solicitud especial?",
            "Any special requests?",
          )}
          className={`input-base !h-auto min-h-[80px] resize-none`}
        />
      </Field>
      <div className="space-y-2 pt-1">
        <label className="flex items-start gap-2 cursor-pointer group">
          <input
            type="checkbox"
            name="terms"
            checked={form.terms}
            onChange={onChange}
            required
            className="mt-0.5 accent-[var(--accent)]"
          />
          <span className="text-[var(--text)]/50 text-xs leading-relaxed group-hover:text-[var(--text)]/70 transition-colors">
            {t(
              locale,
              "Acepto términos y condiciones",
              "I accept terms and conditions",
            )}
            <span className="text-[var(--accent)]"> *</span>
          </span>
        </label>
        <label className="flex items-start gap-2 cursor-pointer group">
          <input
            type="checkbox"
            name="newsletter"
            checked={form.newsletter}
            onChange={onChange}
            className="mt-0.5 accent-[var(--accent)]"
          />
          <span className="text-[var(--text)]/50 text-xs leading-relaxed group-hover:text-[var(--text)]/70 transition-colors">
            {t(
              locale,
              "Quiero recibir ofertas en mi email",
              "I want to receive offers by email",
            )}
          </span>
        </label>
      </div>
    </Step>
  );
}
