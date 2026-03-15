import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { type Locale, type QuoteFormState, t, inputClass } from "@/types/quote";
import { Step } from "./ui/Step";
import { Field } from "./ui/Field";

export function ContactStep({
  locale,
  number,
  form,
  onChange,
  onPhoneChange,
}: {
  locale: Locale;
  number: number;
  form: QuoteFormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onPhoneChange: (val: string) => void;
}) {
  return (
    <Step number={number} label={t(locale, "Datos de contacto", "Contact details")}>
      <div className="grid grid-cols-2 gap-3">
        <Field icon={<FaUser />} label={t(locale, "Nombres", "First name")} required>
          <input
            type="text" name="first_name" value={form.first_name}
            onChange={onChange} required
            placeholder={t(locale, "Nombres", "First name")}
            className={inputClass}
          />
        </Field>
        <Field icon={<FaUser />} label={t(locale, "Apellidos", "Last name")} required>
          <input
            type="text" name="last_name" value={form.last_name}
            onChange={onChange} required
            placeholder={t(locale, "Apellidos", "Last name")}
            className={inputClass}
          />
        </Field>
      </div>
      <Field icon={<FaEnvelope />} label={t(locale, "Email", "Email")} required>
        <input
          type="email" name="email" value={form.email}
          onChange={onChange} required
          placeholder="correo@ejemplo.com"
          className={inputClass}
        />
      </Field>
      <Field icon={<FaPhone />} label={t(locale, "Teléfono", "Phone")}>
        <PhoneInput
          country="mx"
          value={form.phone}
          onChange={onPhoneChange}
          preferredCountries={["mx", "us", "ca"]}
          enableSearch
          searchPlaceholder={t(locale, "Buscar país...", "Search country...")}
          inputStyle={{
            width: "100%",
            background: "transparent",
            border: "1px solid color-mix(in srgb, var(--border) 30%, transparent)",
            borderRadius: "2px",
            color: "var(--text)",
            fontSize: "0.875rem",
            paddingTop: "8px",
            paddingBottom: "8px",
          }}
          buttonStyle={{
            background: "transparent",
            border: "1px solid color-mix(in srgb, var(--border) 30%, transparent)",
            borderRadius: "2px 0 0 2px",
          }}
          dropdownStyle={{
            background: "var(--bg)",
            color: "var(--text)",
            border: "1px solid color-mix(in srgb, var(--border) 30%, transparent)",
          }}
        />
      </Field>
    </Step>
  );
}