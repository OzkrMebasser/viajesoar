import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHeart,
  FaWhatsapp,
} from "react-icons/fa";
import { type Locale, type QuoteFormState, t, inputClass } from "@/types/quote";
import { Step } from "./ui/Step";
import { Field } from "./ui/Field";

export function ContactStep({
  locale,
  number,
  form,
  onChange,
  onPhoneChange,
  onWhatsappChange,
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
  onWhatsappChange: (val: string) => void;
}) {
  const [useSameWhatsapp, setUseSameWhatsapp] = useState(true);

  useEffect(() => {
    if (useSameWhatsapp) {
      onWhatsappChange(form.phone);
    }
  }, [useSameWhatsapp, form.phone]);

  return (
    <Step
      number={number}
      label={t(locale, "Datos de contacto", "Contact details")}
     
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
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
         
        >
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={onChange}
            placeholder={t(locale, "Apellidos", "Last name")}
            className={inputClass}
            autoComplete="off"
            
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          icon={<FaEnvelope />}
          label={t(locale, "Email", "Email")}
         required
        >
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="correo@ejemplo.com"
            className={inputClass}
            autoComplete="off"
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
            autoComplete="off"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          icon={<FaPhone />}
          label={t(locale, "Teléfono", "Phone")}
          required
        >
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
        <Field icon={<FaWhatsapp />} label={t(locale, "WhatsApp", "WhatsApp")}>
          <PhoneInput
            country="mx"
            value={form.whatsapp}
            onChange={onWhatsappChange}
            disabled={useSameWhatsapp}
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
              opacity: useSameWhatsapp ? 0.4 : 1,
            }}
            buttonStyle={{
              background: "transparent",
              border:
                "1px solid color-mix(in srgb, var(--border) 30%, transparent)",
              borderRadius: "2px 0 0 2px",
              opacity: useSameWhatsapp ? 0.4 : 1,
            }}
            dropdownStyle={{
              background: "var(--bg)",
              color: "var(--text)",
              border:
                "1px solid color-mix(in srgb, var(--border) 30%, transparent)",
            }}
          />
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useSameWhatsapp}
              onChange={() => setUseSameWhatsapp((prev) => !prev)}
              className="accent-[var(--accent)]"
            />
            <span className="text-xs text-[var(--text)]/50">
              {t(locale, "Mismo número que teléfono", "Same as phone number")}
            </span>
          </label>
        </Field>
        {/* <Field icon={<FaWhatsapp />} label={t(locale, "WhatsApp", "WhatsApp")}>
          <PhoneInput
            country="mx"
            value={form.whatsapp}
            onChange={onWhatsappChange}
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
          />{" "}
          <p className="text-xs text-[var(--text)]/40 mt-1">
            {t(
              locale,
              "Opcional • Si es diferente a tu teléfono",
              "Optional • If different from your phone",
            )}
          </p>
        </Field> */}
      </div>
    </Step>
  );
}
