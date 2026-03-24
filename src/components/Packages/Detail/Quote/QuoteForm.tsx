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
import { FaAsterisk } from "react-icons/fa";

const quoteSchema = (locale: string, hasDepartures: boolean) =>
  z.object({
    first_name: z
      .string()
      .min(
        1,
        locale === "es"
          ? "Por favor, indícanos tu nombre para poder contactarte"
          : "Please tell us your name so we can contact you",
      ),

    email: z
      .string()
      .min(
        1,
        locale === "es"
          ? "Necesitamos tu correo para enviarte los detalles de tu cotización"
          : "We need your email to send you your quote details",
      )
      .email(
        locale === "es"
          ? "Revisa tu correo, parece que no es válido"
          : "Please check your email, it doesn't look valid",
      ),

    phone: z
      .string()
      .min(
        8,
        locale === "es"
          ? "Compártenos un número para poder darte seguimiento a tu solicitud"
          : "Share a phone number so we can follow up on your request",
      ),

    adults: z
      .number()
      .min(
        1,
        locale === "es"
          ? "Indica cuántas personas viajan para calcular tu experiencia"
          : "Tell us how many people are traveling to calculate your experience",
      ),

    travel_date: hasDepartures
      ? z.string().optional()
      : z
          .string()
          .min(
            1,
            locale === "es"
              ? "Selecciona una fecha aproximada para proponerte las mejores opciones"
              : "Select an approximate date so we can suggest the best options",
          ),

    terms: z.literal(true, {
      errorMap: () => ({
        message:
          locale === "es"
            ? "Para continuar, es necesario aceptar los términos y condiciones"
            : "To continue, you need to accept the terms and conditions",
      }),
    }),
  });

export default function QuoteForm({
  locale,
  packageName,
  internalPkgId,
  packageSlug,
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

  // — Lógica de estado —
  const updateField = <K extends keyof QuoteFormState>(
    key: K,
    value: QuoteFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateCountry = (val: string) =>
    setForm((prev) => ({ ...prev, country: val, state: "", municipality: "" }));

  const updateState = (val: string) =>
    setForm((prev) => ({ ...prev, state: val, municipality: "" }));

  // — Evento del DOM (solo para inputs nativos con name+type) —
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const parsed =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    updateField(name as keyof QuoteFormState, parsed as never);
  };

  const dep = selectedDeparture;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.terms) return;

    const schema = quoteSchema(locale, departures.length > 0);

    const result = schema.safeParse({
      first_name: form.first_name,
      email: form.email,
      phone: form.phone,
      adults: form.adults,
      travel_date: dep?.date_start ?? form.travel_date,
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
        whatsapp: form.whatsapp || null,
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
      className="px-2 lg:px-4 pt-8 space-y-10 bg-[var(--accent)]/3 "
      id="quote-form"
      autoComplete="off"
    >
      <div className="border-b border-[var(--border)]/40 pb-7 ">
        <h3 className="text-[var(--accent)] font-bold text-base uppercase tracking-wider">
          {locale === "es"
            ? `¡Cotizar ${internalPkgId ?? ""} ${packageName}!`
            : `Quote ${internalPkgId ?? ""} ${packageName}!`}
        </h3>
      </div>
      <p className="text-[var(--text)]/70 text-[12px] -mt-6">
        {locale ? "Los campos marcados con " : "Fields marked with "}
        <span className="">
          <FaAsterisk className="inline text-(--accent) text-[10px]" />
        </span>
        {locale
          ? " son necesarios para procesar tu cotización."
          : " are required to process your quote."}
      </p>
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
        onPhoneChange={(val) => updateField("phone", val)}
        onWhatsappChange={(val) => updateField("whatsapp", val)}
        onTripPurposeChange={(val) => updateField("trip_purpose", val)}
      />

      <OriginStep
        locale={locale}
        number={2 + stepOffset}
        form={form}
        onChange={handleChange}
        onCountryChange={updateCountry}
        onMunicipalityChange={(val) => updateField("municipality", val)}
        onStateChange={updateState}
        hasDepartures={departures.length > 0}
        onTravelDateChange={(val) => updateField("travel_date", val)}
      />

      <PassengersStep
        locale={locale}
        number={3 + stepOffset}
        form={form}
        onChange={(field, value) =>
          updateField(field as "adults" | "children", value)
        }
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
