"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client"; // cliente del lado del cliente
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaUsers,
  FaCommentDots,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

type Locale = "es" | "en";
const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

interface QuoteFormProps {
  locale: Locale;
  packageName: string;
  internalPkgId?: string | null;
  packageSlug?: string;
  priceFrom?: number | null;
  priceSingle?: number | null;
}

type Status = "idle" | "loading" | "success" | "error";

export default function QuoteForm({
  locale,
  packageName,
  internalPkgId,
  packageSlug,
  priceFrom,
  priceSingle,
}: QuoteFormProps) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    travel_date: "",
    passengers_double: 1,
    passengers_single: 0,
    message: "",
  });

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "passengers_double" || name === "passengers_single"
          ? Number(value)
          : value,
    }));
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {

          const { data: { session } } = await supabase.auth.getSession();
console.log("session:", session);
console.log("role:", session?.user?.role ?? "anon");

      const { error } = await supabase.from("quotes").insert({
        package_name: packageName,
        internal_pkg_id: internalPkgId ?? null,
        package_slug: packageSlug ?? null,
        ...form,
        travel_date: form.travel_date || null,
      });

      if (error) throw new Error(error.message);

      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Error desconocido"
      );
    }
  };

  // ── Success state ──
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center gap-4">
        <FaCheckCircle className="text-[var(--accent)] text-5xl" />
        <h4 className="text-[var(--accent)] font-bold text-xl uppercase tracking-wider">
          {t(locale, "¡Solicitud enviada!", "Request sent!")}
        </h4>
        <p className="text-[var(--text)]/60 text-sm leading-relaxed max-w-xs">
          {t(
            locale,
            "Nos pondremos en contacto contigo pronto para confirmar tu cotización.",
            "We'll get back to you soon to confirm your quote."
          )}
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setForm({
              full_name: "",
              email: "",
              phone: "",
              travel_date: "",
              passengers_double: 1,
              passengers_single: 0,
              message: "",
            });
          }}
          className="mt-2 text-xs text-[var(--accent)]/50 hover:text-[var(--accent)] underline transition-colors"
        >
          {t(locale, "Enviar otra solicitud", "Send another request")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
      {/* Title */}
      <div className="border-b border-[var(--border)]/40 pb-4 mb-2">
        <h3 className="text-[var(--accent)] font-bold text-base uppercase tracking-wider">
          {t(locale, "Cotiza tu viaje", "Get your quote")}
        </h3>
        <p className="text-[var(--text)]/40 text-xs mt-1">
          {packageName}
        </p>
      </div>

      {/* Full name */}
      <Field
        icon={<FaUser />}
        label={t(locale, "Nombre completo", "Full name")}
        required
      >
        <input
          type="text"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
          placeholder={t(locale, "Tu nombre", "Your name")}
          className={inputClass}
        />
      </Field>

      {/* Email */}
      <Field icon={<FaEnvelope />} label={t(locale, "Correo", "Email")} required>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="correo@ejemplo.com"
          className={inputClass}
        />
      </Field>

      {/* Phone */}
      <Field icon={<FaPhone />} label={t(locale, "Teléfono", "Phone")}>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="+52 000 000 0000"
          className={inputClass}
        />
      </Field>

      {/* Travel date */}
      <Field
        icon={<FaCalendarAlt />}
        label={t(locale, "Fecha tentativa", "Estimated date")}
      >
        <input
          type="date"
          name="travel_date"
          value={form.travel_date}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          className={inputClass}
            title={t(locale, "Fecha tentativa de viaje", "Estimated travel date")}

        />
      </Field>

      {/* Passengers */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[var(--text)]/50 text-xs uppercase tracking-wider">
          <FaUsers className="text-[var(--accent)]" />
          <span>{t(locale, "Pasajeros", "Passengers")}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <PassengerCounter
            label={t(locale, "Hab. Doble", "Double room")}
            sublabel={
              priceFrom
                ? `$${Number(priceFrom).toLocaleString()}/pp`
                : undefined
            }
            name="passengers_double"
            value={form.passengers_double}
            onChange={handleChange}
          />
          <PassengerCounter
            label={t(locale, "Hab. Sencilla", "Single room")}
            sublabel={
              priceSingle
                ? `$${Number(priceSingle).toLocaleString()}/pp`
                : undefined
            }
            name="passengers_single"
            value={form.passengers_single}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Message */}
      <Field
        icon={<FaCommentDots />}
        label={t(locale, "Mensaje (opcional)", "Message (optional)")}
      >
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={3}
          placeholder={t(
            locale,
            "¿Alguna solicitud especial?",
            "Any special requests?"
          )}
          className={`${inputClass} resize-none`}
        />
      </Field>

      {/* Error */}
      {status === "error" && (
        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
          <FaExclamationCircle className="flex-shrink-0" />
          <span>{errorMsg || t(locale, "Ocurrió un error.", "An error occurred.")}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
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
          t(locale, "Cotizar ahora", "Get a quote")
        )}
      </button>
    </form>
  );
}

// ── Helpers ──

const inputClass = `
  w-full bg-white/5 border border-[var(--border)]/30 
  text-[var(--text)] text-sm
  rounded-sm px-3 py-2
  placeholder:text-[var(--text)]/25
  focus:outline-none focus:border-[var(--accent)]/60
  transition-colors duration-150
`;

function Field({
  icon,
  label,
  required,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-2 text-[var(--text)]/50 text-xs uppercase tracking-wider">
        <span className="text-[var(--accent)]">{icon}</span>
        {label}
        {required && <span className="text-[var(--accent)]">*</span>}
      </label>
      {children}
    </div>
  );
}

function PassengerCounter({
  label,
  sublabel,
  name,
  value,
  onChange,
}: {
  label: string;
  sublabel?: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="bg-white/5 border border-[var(--border)]/30 rounded-sm p-2 space-y-1">
      <p className="text-[var(--text)]/50 text-xs leading-tight">{label}</p>
      {sublabel && (
        <p className="text-[var(--accent)]/60 text-[10px]">{sublabel}</p>
      )}
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        min={0}
        max={20}
        className="
          w-full bg-transparent text-[var(--accent)] 
          font-bold text-lg text-center
          focus:outline-none border-b border-[var(--border)]/20
          focus:border-[var(--accent)]/40 transition-colors
        "  placeholder="0"
      />
    </div>
  );
}