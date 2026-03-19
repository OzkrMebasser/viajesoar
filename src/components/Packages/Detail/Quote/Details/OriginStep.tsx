import { FaGlobe, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { Country, State, City } from "country-state-city";
import {
  type Locale,
  type QuoteFormState,
  t,
  inputClass,
  PRIORITY_CODES,
} from "@/types/quote";
import { Step } from "./ui/Step";
import { Field } from "./ui/Field";

function getSortedCountries() {
  const all = Country.getAllCountries();
  const priority = PRIORITY_CODES.map((code) =>
    all.find((c) => c.isoCode === code),
  ).filter(Boolean);
  const rest = all.filter((c) => !PRIORITY_CODES.includes(c.isoCode));
  return [...priority, ...rest] as ReturnType<typeof Country.getAllCountries>;
}

export function OriginStep({
  locale,
  number,
  form,
  onChange,
  onCountryChange,
  onStateChange,
  hasDepartures,
}: {
  locale: Locale;
  number: number;
  form: QuoteFormState;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onCountryChange: (val: string) => void;
  onStateChange: (val: string) => void;
  hasDepartures: boolean;
}) {
  const countries = getSortedCountries();
  const states = form.country ? State.getStatesOfCountry(form.country) : [];
  const cities =
    form.country && form.state
      ? City.getCitiesOfState(form.country, form.state)
      : [];

  return (
    <Step number={number} label={t(locale, "Origen y fecha", "Origin & date")}>
      <Field icon={<FaGlobe />} label={t(locale, "País", "Country")}>
        <select
          name="country"
          value={form.country}
          title="contry"
          onChange={(e) => onCountryChange(e.target.value)}
          className={inputClass}
        >
          <option value="">
            {t(locale, "Seleccionar País", "Select Country")}
          </option>
          {countries.slice(0, PRIORITY_CODES.length).map((c) => (
            <option key={c.isoCode} value={c.isoCode}>
              {c.flag} {c.name}
            </option>
          ))}
          <option disabled>──────────────</option>
          {countries.slice(PRIORITY_CODES.length).map((c) => (
            <option key={c.isoCode} value={c.isoCode}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field
        icon={<FaMapMarkerAlt />}
        label={t(locale, "Estado / Provincia", "State / Province")}
      >
        <select
          name="state"
          title="state"
          value={form.state}
          onChange={(e) => onStateChange(e.target.value)}
          disabled={!form.country || states.length === 0}
          className={inputClass}
        >
          <option value="">
            {t(locale, "Seleccionar Estado", "Select State")}
          </option>
          {states.map((s) => (
            <option key={s.isoCode} value={s.isoCode}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>

      <Field
        icon={<FaMapMarkerAlt />}
        label={t(locale, "Ciudad / Municipio", "City / Municipality")}
      >
        {cities.length > 0 ? (
          <select
            name="municipality"
            title="municipality"
            value={form.municipality}
            onChange={onChange}
            disabled={!form.state}
            className={inputClass}
          >
            <option value="">
              {t(locale, "Seleccionar Ciudad", "Select City")}
            </option>
            {cities.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name="municipality"
            value={form.municipality}
            onChange={onChange}
            placeholder={t(locale, "Tu ciudad", "Your city")}
            className={inputClass}
          />
        )}
      </Field>

      {!hasDepartures && (
        <Field
          icon={<FaCalendarAlt />}
          label={t(locale, "Fecha de salida", "Departure date")}
        >
          <input
            placeholder=""
            type="date"
            name="travel_date"
            title="travel_date"
            onChange={onChange}
            min={new Date().toISOString().split("T")[0]}
            className={inputClass}
          />
        </Field>
      )}
    </Step>
  );
}
