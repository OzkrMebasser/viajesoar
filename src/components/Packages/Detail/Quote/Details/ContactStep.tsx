import { useState, useEffect } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import CustomSelect from "@/components/ui/CustomSelect";

import "react-phone-input-2/lib/style.css";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHeart,
  FaWhatsapp,
} from "react-icons/fa";
import { type Locale, type QuoteFormState, t } from "@/types/quote";
import { Step } from "./ui/Step";
import { Field } from "./ui/Field";

export function ContactStep({
  locale,
  number,
  form,
  onChange,
  onTripPurposeChange,
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
  onTripPurposeChange: (val: string) => void;
}) {
  const [useSameWhatsapp, setUseSameWhatsapp] = useState(true);

  useEffect(() => {
    if (useSameWhatsapp) {
      onWhatsappChange(form.phone);
    }
  }, [useSameWhatsapp, form.phone]);

  return (
    <>
      <Step
        number={number}
        label={t(locale, "Datos de contacto", "Contact details")}
        completed={!!form.first_name && !!form.email && !!form.phone}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
          {/*Nombres*/}
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
              className={"input-base"}
            />
          </Field>
          {/*Apellidos */}
          <Field icon={<FaUser />} label={t(locale, "Apellidos", "Last name")}>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={onChange}
              placeholder={t(locale, "Apellidos", "Last name")}
              className={"input-base"}
              autoComplete="off"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/*Email*/}
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
              className={"input-base"}
              autoComplete="off"
            />
          </Field>
          {/*Motivo del viaje*/}
          <Field
            icon={<FaHeart />}
            label={t(locale, "Motivo del viaje", "Trip purpose")}
          >
            <CustomSelect
              name="trip_purpose"
              value={form.trip_purpose}
              onChange={onTripPurposeChange}
              placeholder={t(locale, "Seleccionar motivo", "Select purpose")}
              options={[
                {
                  value: "vacaciones",
                  label: t(locale, "Vacaciones", "Vacation"),
                },
                {
                  value: "luna_de_miel",
                  label: t(locale, "Luna de miel", "Honeymoon"),
                },
                {
                  value: "aniversario",
                  label: t(locale, "Aniversario", "Anniversary"),
                },
                {
                  value: "cumpleanos",
                  label: t(locale, "Cumpleaños", "Birthday"),
                },
                {
                  value: "negocios",
                  label: t(locale, "Viaje de negocios", "Business trip"),
                },
                {
                  value: "familia",
                  label: t(locale, "Viaje en familia", "Family trip"),
                },
                {
                  value: "graduacion",
                  label: t(locale, "Graduación", "Graduation trip"),
                },
                { value: "otro", label: t(locale, "Otro", "Other") },
              ]}
            />
            {/* <select
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
          </select> */}
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/*Teléfono*/}
          <Field
            icon={<FaPhone />}
            label={t(locale, "Teléfono", "Phone")}
            required
          >
            <PhoneInput
              defaultCountry="mx"
              value={form.phone}
              onChange={(phone) => onPhoneChange(phone)}
              preferredCountries={["mx", "us", "ca"]}
              className="phone-input-base"
              inputClassName="phone-input-field"
            />
          </Field>
          {/*WhatsApp*/}
          <Field
            icon={<FaWhatsapp />}
            label={t(locale, "WhatsApp", "WhatsApp")}
          >
            <PhoneInput
              defaultCountry="mx"
              value={form.whatsapp}
              onChange={(phone) => onWhatsappChange(phone)}
              preferredCountries={["mx", "us", "ca"]}
              disabled={useSameWhatsapp}
              className="phone-input-base"
              inputClassName="phone-input-field"
              style={
                { opacity: useSameWhatsapp ? 0.4 : 1 } as React.CSSProperties
              }
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
        </div>
      </Step>
    </>
  );
}
