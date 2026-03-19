import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaUser, FaEnvelope, FaPhone, FaHeart } from "react-icons/fa";
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
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onPhoneChange: (val: string) => void;
}) {
  return (
    <Step
      number={number}
      label={t(locale, "Datos de contacto", "Contact details")}
    >
      <div className="grid grid-cols-2 gap-3">
        <Field
          icon={<FaUser />}
          label={t(locale, "Nombres", "First name")}
          required
        >
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={onChange}
            placeholder={t(locale, "Nombres", "First name")}
            className={inputClass}
          />
        </Field>
        <Field
          icon={<FaUser />}
          label={t(locale, "Apellidos", "Last name")}
          required
        >
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={onChange}
            placeholder={t(locale, "Apellidos", "Last name")}
            className={inputClass}
          />
        </Field>
      </div>
      <Field icon={<FaEnvelope />} label={t(locale, "Email", "Email")} required>
        <input
          type="text"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="correo@ejemplo.com"
          className={inputClass}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
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
              border:
                "1px solid color-mix(in srgb, var(--border) 30%, transparent)",
              borderRadius: "2px",
              color: "var(--text)",
              fontSize: "0.875rem",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
            buttonStyle={{
              background: "transparent",
              border:
                "1px solid color-mix(in srgb, var(--border) 30%, transparent)",
              borderRadius: "2px 0 0 2px",
            }}
            dropdownStyle={{
              background: "var(--bg)",
              color: "var(--text)",
              border:
                "1px solid color-mix(in srgb, var(--border) 30%, transparent)",
            }}
          />
        </Field>
        <Field
          icon={<FaHeart />}
          label={t(locale, "Motivo del viaje", "Trip purpose")}
        >
          <select
            name="trip_purpose"
            value={form.trip_purpose}
            title="trip_purpose"
            onChange={onChange}
            className={inputClass}
          >
            <option value="">
              {t(locale, "Seleccionar motivo", "Select purpose")}
            </option>
            <option value="vacaciones">
              {t(locale, "Vacaciones", "Vacation")}
            </option>
            <option value="luna_de_miel">
              {t(locale, "Luna de miel", "Honeymoon")}
            </option>
            <option value="aniversario">
              {t(locale, "Aniversario", "Anniversary")}
            </option>
            <option value="cumpleanos">
              {t(locale, "Cumpleaños", "Birthday")}
            </option>
            <option value="negocios">
              {t(locale, "Viaje de negocios", "Business trip")}
            </option>
            <option value="familia">
              {t(locale, "Viaje en familia", "Family trip")}
            </option>
            <option value="graduacion">
              {t(locale, "Graduación", "Graduation trip")}
            </option>
            <option value="otro">{t(locale, "Otro", "Other")}</option>
          </select>
        </Field>
      </div>
    </Step>
  );
}
