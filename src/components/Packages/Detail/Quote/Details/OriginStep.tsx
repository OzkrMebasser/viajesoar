import { FaGlobe, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { Country, State, City } from "country-state-city";
import { DatePickerField } from "../Details/ui/DatePickerField";
import { IoCalendar } from "react-icons/io5";


import {
  type Locale,
  type QuoteFormState,
  t,
  PRIORITY_CODES,
} from "@/types/quote";
import { Step } from "./ui/Step";
import { Field } from "./ui/Field";
import CustomSelect from "@/components/ui/CustomSelect";

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
  onMunicipalityChange,
  onTravelDateChange,
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
  onMunicipalityChange: (val: string) => void;
  onTravelDateChange: (val: string) => void;
  hasDepartures: boolean;
}) {
  const countries = getSortedCountries();
  const states = form.country ? State.getStatesOfCountry(form.country) : [];
  const cities =
    form.country && form.state
      ? City.getCitiesOfState(form.country, form.state)
      : [];

  const countryOptions = [
    ...countries.slice(0, PRIORITY_CODES.length).map((c) => ({
      value: c.isoCode,
      label: `${c.flag} ${c.name}`,
    })),
    ...countries.slice(PRIORITY_CODES.length).map((c) => ({
      value: c.isoCode,
      label: `${c.flag} ${c.name}`,
    })),
  ];

  const stateOptions = states.map((s) => ({
    value: s.isoCode,
    label: s.name,
  }));

  const cityOptions = cities.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  return (
    <Step
      number={number}
      label={t(locale, "Origen y fecha", "Origin & date")}
      completed={hasDepartures ? true : !!form.travel_date}
      locale={locale}
    >
      <Field icon={<FaGlobe />} label={t(locale, "País", "Country")}>
        <CustomSelect
          value={form.country}
          onChange={onCountryChange}
          placeholder={t(locale, "Seleccionar País", "Select Country")}
          options={countryOptions}
        />
      </Field>

      <Field
        icon={<FaMapMarkerAlt />}
        label={t(locale, "Estado / Provincia", "State / Province")}
      >
        <CustomSelect
          value={form.state}
          onChange={(val) => {
            onStateChange(val);
          }}
          placeholder={t(locale, "Seleccionar Estado", "Select State")}
          options={stateOptions}
          disabled={!form.country || states.length === 0}
        />
      </Field>

      <Field
        icon={<FaMapMarkerAlt />}
        label={t(locale, "Ciudad / Municipio", "City / Municipality")}
      >
        {cities.length > 0 ? (
          <CustomSelect
            value={form.municipality}
            onChange={onMunicipalityChange}
            placeholder={t(locale, "Seleccionar Ciudad", "Select City")}
            options={cityOptions}
            disabled={!form.state}
          />
        ) : (
          <input
            type="text"
            name="municipality"
            value={form.municipality}
            onChange={onChange}
            placeholder={t(locale, "Tu ciudad", "Your city")}
            className="input-base"
          />
        )}
      </Field>

      {!hasDepartures && (
        <Field
          icon={<IoCalendar />}
          label={t(locale, "Fecha estimada de viaje", "Estimated travel date")}
          required
        >
          <DatePickerField
            locale={locale}
            value={form.travel_date}
            onChange={onTravelDateChange}
          />
          <p className="text-xs text-[var(--text)]/40 mt-1">
            {t(
              locale,
              "Aproximada, no tiene que ser exacta",
              "Approximate, it doesn't have to be exact",
            )}
          </p>
        </Field>
      )}
      {/* {!hasDepartures && (
        <Field
          icon={<FaCalendarAlt />}
          label={t(locale, "Fecha estimada de viaje", "Estimated travel date")}
          required
        >
          <input
            placeholder={t(
              locale,
              "Selecciona tu salida",
              "Select your departure",
            )}
            type="date"
            name="travel_date"
            title="travel_date"
            onChange={onChange}
            min={new Date().toISOString().split("T")[0]}
            className="input-base"
          />
          <p className="text-xs text-[var(--text)]/40 mt-1">
            {t(
              locale,
              "Aproximada, no tiene que ser exacta",
              "Approximate, it doesn't have to be exact",
            )}
          </p>
        </Field>
      )} */}
    </Step>
  );
}
