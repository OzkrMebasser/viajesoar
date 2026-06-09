"use client";

import { useState } from "react";
import type { Locale } from "@/types/locale";
import SplitText from "@/components/SplitText";
import ButtonArrow from "@/components/ui/ButtonArrow";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  User,
  MessageSquare,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";

import { MdTravelExplore } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import ButtonAccent from "@/components/ui/ButtonAccent";
interface Props {
  locale?: Locale;
}

const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

const HERO_IMAGE =
  "https://res.cloudinary.com/dtsenvmdq/image/upload/v1779772763/contacto_rffnts.png";

export default function ContactPage({ locale = "es" }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full py-3 rounded-sm border text-sm outline-none transition-all duration-200 bg-transparent pl-10 pr-4";
  const inputStyle = { borderColor: "var(--accent)", color: "var(--text)" };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError(
        t(
          locale,
          "Por favor completa los campos requeridos.",
          "Please fill in all required fields.",
        ),
      );
      return;
    }
    setLoading(true);
    setError(null);
    const result = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, locale }),
    });

    const json = await result.json();
    console.log("Response:", json);

    if (!result.ok) throw new Error(json.error);
    setSent(true);
    setLoading(false);
    setSent(true);
  };

  return (
    <section className="min-h-screen bg-gradient-theme">
      {/* ── HERO INFO ── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 sm:px-6 pb-0 lg:pb-8 text-white pointer-events-none">
        <div className="flex items-center gap-2 mb-4">
          <MdTravelExplore className="text-[var(--accent)] w-4 h-4" />
          <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
            {t(locale, "Estamos aquí para ayudarte", "We're here to help")}
          </span>
        </div>
        <SplitText
          text={t(locale, "Contáctanos", "Contact Us")}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 uppercase"
          delay={25}
          duration={0.5}
          splitType="chars"
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="left"
        />
        <p className="text-white/70 mt-2 max-w-md text-xs sm:text-sm [text-shadow:2px_2px_3px_#000000]">
          {t(
            locale,
            "Cuéntanos sobre tu viaje ideal y lo haremos realidad.",
            "Tell us about your dream trip and we'll make it happen.",
          )}
        </p>
      </div>

      {/* ── HERO BAND ── */}
      <div className="relative h-[100dvh] flex flex-col justify-end overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt="contact hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>
      </div>
      <ScrollIndicator targetId="contact-form" />
      {/* ── CONTENT ── */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-gradient-theme "
        id="contact-form"
      >
        {/* Section header */}
        <div className="mb-4 pt-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-theme-tittles">
              {t(locale, "Hablemos", "Let's Talk")}
            </h2>
          </div>
          <p className="text-[var(--accent)] text-xs tracking-widest uppercase ml-7">
            {t(
              locale,
              "Respuesta en menos de 24 horas",
              "Response within 24 hours",
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ── FORM ── */}
          <div
            className="glass-card rounded-sm p-8 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {/* shimmer */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-[60%] -skew-x-12 -left-[120%] hover:left-[140%] transition-[left] duration-[800ms] ease-in-out"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
              }}
            />

            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
                <CheckCircle2
                  className="w-12 h-12"
                  style={{ color: "var(--accent)" }}
                />
                <p className="text-lg font-bold uppercase tracking-widest text-theme-tittles">
                  {t(locale, "¡Mensaje enviado!", "Message sent!")}
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--text)", opacity: 0.6 }}
                >
                  {t(
                    locale,
                    "Te contactaremos pronto. ¡Gracias!",
                    "We'll reach out soon. Thank you!",
                  )}
                </p>
                <ButtonArrow
                  title={t(locale, "Enviar otro mensaje", "Send another")}
                  onClick={() => {
                    setSent(false);
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "",
                      message: "",
                    });
                  }}
                />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs uppercase tracking-widest font-semibold"
                    style={{ color: "var(--accent)", opacity: 0.8 }}
                  >
                    {t(locale, "Nombre *", "Name *")}
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "var(--accent)", opacity: 0.5 }}
                    />
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t(locale, "Juán Pérez", "John Doe")}
                      required
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs uppercase tracking-widest font-semibold"
                      style={{ color: "var(--accent)", opacity: 0.8 }}
                    >
                      {t(locale, "Email *", "Email *")}
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: "var(--accent)", opacity: 0.5 }}
                      />
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder={t(
                          locale,
                          "juanitoperez@example.com",
                          "john.doe@example.com",
                        )}
                        required
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs uppercase tracking-widest font-semibold"
                      style={{ color: "var(--accent)", opacity: 0.8 }}
                    >
                      {t(locale, "Teléfono", "Phone")}
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: "var(--accent)", opacity: 0.5 }}
                      />
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        // placeholder={"+52 000 000 0000"}
                        placeholder={t(
                          locale,
                          "+52 111 222 3333",
                          "+1 612 123 4567",
                        )}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs uppercase tracking-widest font-semibold"
                    style={{ color: "var(--accent)", opacity: 0.8 }}
                  >
                    {t(locale, "Asunto", "Subject")}
                  </label>
                  <div className="relative">
                    <Send
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "var(--accent)", opacity: 0.5 }}
                    />
                    <input
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder={t(
                        locale,
                        "¿En qué podemos ayudarte?",
                        "How can we help?",
                      )}
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs uppercase tracking-widest font-semibold"
                    style={{ color: "var(--accent)", opacity: 0.8 }}
                  >
                    {t(locale, "Mensaje *", "Message *")}
                  </label>
                  <div className="relative">
                    <MessageSquare
                      className="absolute left-3 top-4 w-4 h-4"
                      style={{ color: "var(--accent)", opacity: 0.5 }}
                    />
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder={t(
                        locale,
                        "Cuéntanos sobre tu viaje ideal...",
                        "Tell us about your dream trip...",
                      )}
                      rows={5}
                      required
                      className="w-full py-3 pl-10 pr-4 rounded-sm border text-sm outline-none transition-all duration-200 bg-transparent resize-none"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-xs px-3 py-2 rounded-sm border border-red-500/30 bg-red-500/10 text-red-400">
                    {error}
                  </p>
                )}

                {/* Submit */}
                {/* <button
                  type="submit"
                  disabled={loading}
                  className="w-fit px-8 py-3 rounded-sm font-semibold text-sm tracking-widest uppercase transition-all duration-300 flex items-center gap-2 mt-1 hover:scale-105"
                  style={{
                    background: "var(--accent)",
                    color: "#000",
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading
                    ? t(locale, "Enviando...", "Sending...")
                    : t(locale, "Enviar mensaje", "Send message")}
                  {!loading && <Send className="w-4 h-4" />}
                </button> */}
                {/* Submit */}
                <ButtonAccent
                  type="submit"
                  title={
                    loading
                      ? t(locale, "Enviando...", "Sending...")
                      : t(locale, "Enviar mensaje", "Send message")
                  }
                  icon={loading ? Loader2 : Send}
                  disabled={loading}
                  className={
                    loading
                      ? "opacity-70 cursor-not-allowed"
                      : "w-full justify-center "
                  }
                />
              </form>
            )}
          </div>

          {/* ── INFO PANEL ── */}
          <div className="flex flex-col gap-6">
            {/* Info cards */}
            {[
              {
                icon: (
                  <Mail
                    className="w-5 h-5"
                    style={{ color: "var(--accent)" }}
                  />
                ),
                label: t(locale, "Email", "Email"),
                value: "info.viajesoar@gmail.com",
                href: "mailto:info.viajesoar@gmail.com",
              },
              {
                icon: (
                  <Phone
                    className="w-5 h-5"
                    style={{ color: "var(--accent)" }}
                  />
                ),
                label: t(locale, "Teléfono", "Phone"),
                value: "+52 (612) 402 9656",
                href: "tel:+52 (612) 402 9656",
              },
              {
                icon: (
                  <FaWhatsapp
                    className="w-5 h-5"
                    style={{ color: "var(--accent)" }}
                  />
                ),
                label: t(locale, "WhatsApp", "WhatsApp"),
                value: "+52 (612) 103 7422",
                href: "tel:+52 (612) 103 7422",
              },
              {
                icon: (
                  <MapPin
                    className="w-5 h-5"
                    style={{ color: "var(--accent)" }}
                  />
                ),
                label: t(locale, "Ubicación", "Location"),
                value: "La Paz, Baja California Sur, México",
                href: null,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-card border border-white/10 rounded-sm px-6 py-5 flex items-center gap-4 hover:border-[var(--accent)]/30 transition-all duration-300 "
              >
                <div className="p-2 rounded-lg bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 transition-all duration-300 flex-shrink-0 hover:rotate-5 transform">
                  {item.icon}
                </div>
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-1"
                    style={{ color: "var(--accent)", opacity: 0.7 }}
                  >
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm hover:underline transition-colors"
                      style={{ color: "var(--text)" }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm" style={{ color: "var(--text)" }}>
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Divider */}

            {/* Social */}
            <div className="glass-card border border-white/10 rounded-sm px-6 py-5 hover:border-[var(--accent)]/30 transition-all duration-300">
              <p
                className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-4"
                style={{ color: "var(--accent)", opacity: 0.7 }}
              >
                {t(locale, "Síguenos", "Follow us")}
              </p>
              <div className="">
                <div className="flex gap-3">
                  {[
                    {
                      Icon: FaFacebook,
                      href: "https://facebook.com/viajesoar",
                      label: "Facebook",
                    },
                    {
                      Icon: FaInstagram,
                      href: "https://instagram.com/viajesoar",
                      label: "Instagram",
                    },
                    {
                      Icon: FaTiktok,
                      href: "https://tiktok.com/@viajesoar",
                      label: "TikTok",
                    },
                    {
                      Icon: FaXTwitter,
                      href: "https://x.com/viajesoar",
                      label: "X / Twitter",
                    },
                  ].map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="p-2 rounded-lg bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 accent hover:accent transition-all duration-300 transform hover:scale-110 hover:rotate-5"
                    >
                      <s.Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="glass-card border border-white/10 rounded-sm px-6 py-5 hover:border-[var(--accent)]/30 transition-all duration-300">
              <p
                className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-3"
                style={{ color: "var(--accent)", opacity: 0.7 }}
              >
                {t(locale, "Horario de atención", "Business hours")}
              </p>
              {[
                {
                  day: t(locale, "Lun – Vie", "Mon – Fri"),
                  hours: "9:00 A.M. – 5:00 P.M.",
                },
                {
                  day: t(locale, "Sábado", "Saturday"),
                  hours: "9:00 A.M. – 1:00 P.M.",
                },
                {
                  day: t(locale, "Domingo", "Sunday"),
                  hours: t(locale, "Cerrado", "Closed"),
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0"
                >
                  <span
                    className="text-xs"
                    style={{ color: "var(--text)", opacity: 0.6 }}
                  >
                    {row.day}
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--accent)" }}
                  >
                    {row.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
