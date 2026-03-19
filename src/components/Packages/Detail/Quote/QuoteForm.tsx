"use client";

import { useState } from "react";
import { z } from "zod";
import { Country, State } from "country-state-city";
import { submitQuote } from "@/lib/data/quotes/action/quotes";
import {
  type QuoteFormProps,
  type Departure,
  type QuoteStatus,
  type QuoteFormState,
  EMPTY_FORM,
} from "@/types/quote";
import { SuccessScreen } from "./Details/SuccessScreen";
import { DepartureStep } from "./Details/DepartureStep";
import { ContactStep } from "./Details/ContactStep";
import { OriginStep } from "./Details/OriginStep";
import { PassengersStep } from "./Details/PassengersStep";
import { ConsentStep } from "./Details/ConsentStep";
import { SubmitStep } from "./Details/SubmitStep";

const quoteSchema = (locale: string, hasDepartures: boolean) =>
  z.object({
    first_name: z
      .string()
      .min(
        1,
        locale === "es" ? "El nombre es obligatorio" : "First name is required",
      ),
    last_name: z
      .string()
      .min(
        1,
        locale === "es"
          ? "El apellido es obligatorio"
          : "Last name is required",
      ),
    email: z
      .string()
      .min(1, locale === "es" ? "El email es obligatorio" : "Email is required")
      .email(locale === "es" ? "El email no es válido" : "Email is not valid"),
    phone: z
      .string()
      .min(
        1,
        locale === "es" ? "El teléfono es obligatorio" : "Phone is required",
      ),
    travel_date: hasDepartures
      ? z.string().optional()
      : z
          .string()
          .min(
            1,
            locale === "es"
              ? "La fecha de salida es obligatoria"
              : "Departure date is required",
          ),
    trip_purpose: z
      .string()
      .min(
        1,
        locale === "es"
          ? "El motivo del viaje es obligatorio"
          : "Trip purpose is required",
      ),
    terms: z.literal(true, {
      errorMap: () => ({
        message:
          locale === "es"
            ? "Debes aceptar los términos"
            : "You must accept the terms",
      }),
    }),
  });

export default function QuoteForm({
  locale,
  packageName,
  internalPkgId,
  packageSlug,
  priceFrom,
  priceSingle,
  departures = [],
}: QuoteFormProps) {
  const [selectedDeparture, setSelectedDeparture] = useState<Departure | null>(
    departures[0] ?? null,
  );
  const [form, setForm] = useState<QuoteFormState>(EMPTY_FORM);
  const [status, setStatus] = useState<QuoteStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setStatus("error");
    setTimeout(() => {
      setErrorMsg("");
      setStatus("idle");
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "adults" || name === "children"
            ? Number(value)
            : value,
    }));
  };

  const dep = selectedDeparture;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.terms) return;

    const schema = quoteSchema(locale, departures.length > 0);

    const result = schema.safeParse({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      travel_date: dep?.date_start ?? form.travel_date,
      trip_purpose: form.trip_purpose,
      terms: form.terms,
    });

    if (!result.success) {
      showError(result.error.errors[0]?.message ?? "Error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const countryName =
        Country.getCountryByCode(form.country)?.name ?? form.country;
      const stateName =
        form.country && form.state
          ? (State.getStateByCodeAndCountry(form.state, form.country)?.name ??
            form.state)
          : form.state;

      await submitQuote({
        package_name: packageName,
        internal_pkg_id: internalPkgId ?? null,
        package_slug: packageSlug ?? null,
        full_name: `${form.first_name} ${form.last_name}`.trim(),
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone || null,
        trip_purpose: form.trip_purpose || null,
        country: countryName || null,
        state: stateName || null,
        municipality: form.municipality || null,
        adults: form.adults,
        children: form.children,
        message: form.message || null,
        newsletter: form.newsletter,
        departure_id: dep?.id ?? null,
        departure_date: dep?.date_start ?? null,
        travel_date: dep?.date_start ?? form.travel_date ?? null,
        locale: locale,
      });

      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
    }
  };
  const stepOffset = departures.length > 0 ? 1 : 0;

  if (status === "success") {
    return (
      <SuccessScreen
        locale={locale}
        onReset={() => {
          setStatus("idle");
          setForm(EMPTY_FORM);
        }}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="px-6 py-6 space-y-6"
      id="quote-form"
    >
      <div className="border-b border-[var(--border)]/40 pb-4">
        <h3 className="text-[var(--accent)] font-bold text-base uppercase tracking-wider">
          {locale === "es"
            ? `¡Cotizar ${internalPkgId ?? ""} ${packageName}!`
            : `Quote ${internalPkgId ?? ""} ${packageName}!`}
        </h3>
      </div>

      {departures.length > 0 && (
        <DepartureStep
          locale={locale}
          number={1}
          departures={departures}
          selectedDeparture={selectedDeparture}
          onSelect={setSelectedDeparture}
        />
      )}

      <ContactStep
        locale={locale}
        number={1 + stepOffset}
        form={form}
        onChange={handleChange}
        onPhoneChange={(val) => setForm((prev) => ({ ...prev, phone: val }))}
      />

      <OriginStep
        locale={locale}
        number={2 + stepOffset}
        form={form}
        onChange={handleChange}
        onCountryChange={(val) =>
          setForm((prev) => ({
            ...prev,
            country: val,
            state: "",
            municipality: "",
          }))
        }
        onStateChange={(val) =>
          setForm((prev) => ({ ...prev, state: val, municipality: "" }))
        }
        hasDepartures={departures.length > 0}
      />

      <PassengersStep
        locale={locale}
        number={3 + stepOffset}
        form={form}
        onChange={handleChange}
      />

      <ConsentStep
        locale={locale}
        number={4 + stepOffset}
        form={form}
        onChange={handleChange}
      />

      <SubmitStep
        locale={locale}
        number={5 + stepOffset}
        status={status}
        errorMsg={errorMsg}
        termsAccepted={form.terms}
      />
    </form>
  );
}
// "use client";

// import { useState } from "react";
// import { Country, State } from "country-state-city";
// import { submitQuote } from "@/lib/data/quotes/action/quotes";
// import {
//   type QuoteFormProps,
//   type Departure,
//   type QuoteStatus,
//   type QuoteFormState,
//   EMPTY_FORM,
// } from "@/types/quote";
// import { SuccessScreen } from "./Details/SuccessScreen";
// import { DepartureStep } from "./Details/DepartureStep";
// import { ContactStep } from "./Details/ContactStep";
// import { OriginStep } from "./Details/OriginStep";
// import { PassengersStep } from "./Details/PassengersStep";
// import { ConsentStep } from "./Details/ConsentStep";
// import { SubmitStep } from "./Details/SubmitStep";

// export default function QuoteForm({
//   locale,
//   packageName,
//   internalPkgId,
//   packageSlug,
//   priceFrom,
//   priceSingle,
//   departures = [],
// }: QuoteFormProps) {
//   const [selectedDeparture, setSelectedDeparture] = useState<Departure | null>(
//     departures[0] ?? null,
//   );
//   const [form, setForm] = useState<QuoteFormState>(EMPTY_FORM);
//   const [status, setStatus] = useState<QuoteStatus>("idle");
//   const [errorMsg, setErrorMsg] = useState("");

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >,
//   ) => {
//     const { name, value, type } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox"
//           ? (e.target as HTMLInputElement).checked
//           : name === "adults" || name === "children"
//             ? Number(value)
//             : value,
//     }));
//   };

//   const dep = selectedDeparture;

//  const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!form.terms) return;
//   if (!form.phone) {
//     setErrorMsg(locale === "es" ? "El teléfono es obligatorio" : "Phone is required");
//     setStatus("error");
//     return;
//   }
//   if (!dep && departures.length === 0 && !form.travel_date) {
//     setErrorMsg(locale === "es" ? "La fecha de salida es obligatoria" : "Departure date is required");
//     setStatus("error");
//     return;
//   }
//   setStatus("loading");
//   setErrorMsg("");

//     try {
//       const countryName =
//         Country.getCountryByCode(form.country)?.name ?? form.country;
//       const stateName =
//         form.country && form.state
//           ? (State.getStateByCodeAndCountry(form.state, form.country)?.name ??
//             form.state)
//           : form.state;

//       await submitQuote({
//         package_name: packageName,
//         internal_pkg_id: internalPkgId ?? null,
//         package_slug: packageSlug ?? null,
//         full_name: `${form.first_name} ${form.last_name}`.trim(),
//         first_name: form.first_name,
//         last_name: form.last_name,
//         email: form.email,
//         phone: form.phone || null,
//         agency: form.agency || null,
//         country: countryName || null,
//         state: stateName || null,
//         municipality: form.municipality || null,
//         adults: form.adults,
//         children: form.children,
//         message: form.message || null,
//         newsletter: form.newsletter,
//         departure_id: dep?.id ?? null,
//         departure_date: dep?.date_start ?? null,
//         travel_date: dep?.date_start ?? null,
//       });

//       setStatus("success");
//     } catch (err: unknown) {
//       setStatus("error");
//       setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
//     }
//   };
//   const stepOffset = departures.length > 0 ? 1 : 0;

//   if (status === "success") {
//     return (
//       <SuccessScreen
//         locale={locale}
//         onReset={() => {
//           setStatus("idle");
//           setForm(EMPTY_FORM);
//         }}
//       />
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6" id="quote-form">
//       <div className="border-b border-[var(--border)]/40 pb-4">
//         <h3 className="text-[var(--accent)] font-bold text-base uppercase tracking-wider">
//           {locale === "es"
//             ? `¡Cotizar ${internalPkgId ?? ""} ${packageName}!`
//             : `Quote ${internalPkgId ?? ""} ${packageName}!`}
//         </h3>
//       </div>

//       {departures.length > 0 && (
//         <DepartureStep
//           locale={locale}
//           number={1}
//           departures={departures}
//           selectedDeparture={selectedDeparture}
//           onSelect={setSelectedDeparture}
//         />
//       )}

//       <ContactStep
//         locale={locale}
//         number={1 + stepOffset}
//         form={form}
//         onChange={handleChange}
//         onPhoneChange={(val) => setForm((prev) => ({ ...prev, phone: val }))}
//       />

//       <OriginStep
//         locale={locale}
//         number={2 + stepOffset}
//         form={form}
//         onChange={handleChange}
//         onCountryChange={(val) =>
//           setForm((prev) => ({
//             ...prev,
//             country: val,
//             state: "",
//             municipality: "",
//           }))
//         }
//         onStateChange={(val) =>
//           setForm((prev) => ({ ...prev, state: val, municipality: "" }))
//         }
//         hasDepartures={departures.length > 0}
//       />

//       <PassengersStep
//         locale={locale}
//         number={3 + stepOffset}
//         form={form}
//         onChange={handleChange}
//       />

//       <ConsentStep
//         locale={locale}
//         number={4 + stepOffset}
//         form={form}
//         onChange={handleChange}
//       />

//       <SubmitStep
//         locale={locale}
//         number={5 + stepOffset}
//         status={status}
//         errorMsg={errorMsg}
//         termsAccepted={form.terms}
//       />
//     </form>
//   );
// }
