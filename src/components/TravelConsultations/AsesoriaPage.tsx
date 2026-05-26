"use client";

import { useState } from "react";
import type { Locale } from "@/types/locale";
import SplitText from "@/components/SplitText";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import CardParticlesCanvas from "@/components/ui/Particles/CardParticlesCanvas";
import { FaCheckCircle, FaCalendarAlt, FaClock, FaVideo, FaChevronDown } from "react-icons/fa";
import { MdFlightTakeoff } from "react-icons/md";
import { Compass } from "lucide-react";

interface Props {
  locale: Locale;
}

const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

const CAL_URL = "https://cal.com/ventas-viajesoar-qboxhs/reunion-de-asesoria?embed=true&theme=dark";


const HERO_IMAGE =
  "https://res.cloudinary.com/dtsenvmdq/image/upload/v1779772998/asesoria-de-viajes-agente-de-viajes_zsivme.png";


const benefits = (locale: Locale) => [
  {
    icon: <FaCheckCircle className="text-[var(--accent)]" />,
    text: t(locale, "Cita 100% gratuita y sin compromiso", "100% free appointment, no commitment"),
  },
  {
    icon: <FaVideo className="text-[var(--accent)]" />,
    text: t(locale, "Videollamada por Google Meet", "Video call via Google Meet"),
  },
  {
    icon: <FaClock className="text-[var(--accent)]" />,
    text: t(locale, "Duración aproximada: 20 minutos", "Duration: approximately 20 minutes"),
  },
  {
    icon: <FaCalendarAlt className="text-[var(--accent)]" />,
    text: t(locale, "Elige el día y hora que más te convenga", "Choose the day and time that suits you best"),
  },
];

const steps = (locale: Locale) => [
  {
    n: "01",
    title: t(locale, "Agenda tu cita", "Book your appointment"),
    desc: t(locale, "Haz click en el botón y elige el día y horario que mejor te acomode.", "Click the button and choose the day and time that works best for you."),
  },
  {
    n: "02",
    title: t(locale, "Recibe la confirmación", "Receive confirmation"),
    desc: t(locale, "Te llegará un email con el link de Google Meet y los detalles de tu cita.", "You'll receive an email with the Google Meet link and your appointment details."),
  },
  {
    n: "03",
    title: t(locale, "Habla con un experto", "Talk to an expert"),
    desc: t(locale, "Uno de nuestros asesores te ayudará a planear el viaje perfecto para ti.", "One of our advisors will help you plan the perfect trip for you."),
  },
];

export default function AsesoriaPage({ locale }: Props) {
  const [showCal, setShowCal] = useState(false);

  return (
    <section className="min-h-screen bg-gradient-theme">
      {/* ── HERO OVERLAY TEXT ── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 sm:px-6 pb-0 lg:pb-8 text-white">
        <div className="flex items-center gap-2 mb-4">
          <FaCalendarAlt className="text-[var(--accent)] w-4 h-4" />
          <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
            {t(locale, "Agenda tu cita", "Book your appointment")}
          </span>
        </div>

        <SplitText
          text={t(locale, "Asesoría de Viaje", "Travel Advisory")}
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
            "Habla con un experto y planea el viaje de tus sueños.",
            "Talk to an expert and plan the trip of your dreams.",
          )}
        </p>
      </div>

      {/* ── HERO BAND ── */}
      <div className="relative h-[100dvh] flex flex-col justify-end overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt="asesoria hero"
            className="object-cover object-top mb-12 md:object-center w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-20 pt-10" />
      </div>

      <ScrollIndicator targetId="asesoria-content" />

      {/* ── CONTENT ── */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-gradient-theme"
        id="asesoria-content"
      >
        {/* Section header */}
        <div className="mb-10 pt-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-[var(--accent)]" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-theme-tittles">
              {t(locale, "Agenda tu asesoría", "Book your consultation")}
            </h2>
          </div>
          <p className="text-[var(--accent)] text-xs tracking-widest uppercase ml-7">
            {t(locale, "Gratuita · Sin compromiso · 20 minutos", "Free · No commitment · 20 minutes")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
          {/* ── Info card ── */}
          <div className="glass-card border border-white/10 rounded-sm p-8 relative overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300">
            <div className="absolute inset-0 opacity-50 pointer-events-none">
              <CardParticlesCanvas />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <MdFlightTakeoff className="text-[var(--accent)] text-lg" />
                <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
                  {t(locale, "¿Por qué agendar?", "Why book?")}
                </span>
              </div>
              <p className="text-[var(--text)]/80 text-sm leading-relaxed mb-6">
                {t(
                  locale,
                  "Agenda una videollamada gratuita con uno de nuestros asesores especializados. Te ayudaremos a planear tu viaje ideal según tu presupuesto, fechas y destinos de interés. Sin costos ocultos, sin presión de compra.",
                  "Schedule a free video call with one of our specialized travel advisors. We'll help you plan your ideal trip based on your budget, dates, and destinations of interest. No hidden costs, no purchase pressure.",
                )}
              </p>
              <div className="flex flex-col gap-3">
                {benefits(locale).map((b, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[var(--text)]/80">
                    <span className="flex-shrink-0">{b.icon}</span>
                    {b.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Steps card ── */}
          <div className="glass-card border border-white/10 rounded-sm p-8 relative overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300">
            <div className="absolute inset-0 opacity-50 pointer-events-none">
              <CardParticlesCanvas />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Compass className="text-[var(--accent)] w-4 h-4" />
                <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
                  {t(locale, "¿Cómo funciona?", "How does it work?")}
                </span>
              </div>
              <div className="flex flex-col gap-6">
                {steps(locale).map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="text-[var(--accent)] font-bold text-2xl leading-none flex-shrink-0 tabular-nums">
                      {step.n}
                    </span>
                    <div>
                      <p className="text-theme-tittles font-bold text-sm uppercase tracking-widest mb-1">
                        {step.title}
                      </p>
                      <p className="text-[var(--text)]/60 text-xs leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA BANNER ── */}
        <div className="glass-card border border-[var(--accent)]/20 rounded-sm overflow-hidden relative">
          <img
            src="https://images.pexels.com/photos/8083429/pexels-photo-8083429.jpeg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50" />
          <div className="absolute inset-0 opacity-60 pointer-events-none">
            <CardParticlesCanvas />
          </div>

          {/* CTA content */}
          <div className="relative z-10 p-10 sm:p-14 text-center">
            <MdFlightTakeoff className="text-[var(--accent)] text-4xl mx-auto mb-4" />
            <SplitText
              text={t(locale, "¿Listo para planear tu viaje?", "Ready to plan your trip?")}
              className="text-2xl sm:text-3xl tracking-widest font-bold mb-3 uppercase text-theme-tittles"
              delay={25}
              duration={0.5}
              splitType="chars"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="center"
            />
            <p className="text-[var(--text)]/60 text-sm max-w-md mx-auto mb-8">
              {t(
                locale,
                "Agenda ahora tu asesoría gratuita. Nuestro equipo está listo para ayudarte.",
                "Book your free consultation now. Our team is ready to help you.",
              )}
            </p>

            {/* Toggle button */}
            <button
              onClick={() => setShowCal((v) => !v)}
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-black font-bold text-xs tracking-[0.2em] uppercase px-10 py-4 rounded-sm hover:opacity-90 transition-all duration-200"
            >
              <FaCalendarAlt className="text-sm" />
              {showCal
                ? t(locale, "Ocultar calendario", "Hide calendar")
                : t(locale, "Agendar asesoría gratuita", "Book free consultation")}
              <FaChevronDown
                className={`text-xs transition-transform duration-300 ${showCal ? "rotate-180" : "rotate-0"}`}
              />
            </button>
          </div>

          {/* Cal.com embed — se despliega debajo del botón */}
          <div
            className={`relative z-10 transition-all duration-500 ease-in-out overflow-hidden ${
              showCal ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-white/10 bg-black/60 backdrop-blur-sm">
              <iframe
                src={CAL_URL}
                className="w-full border-0"
                style={{ height: "650px" }}
                title={t(locale, "Agenda tu asesoría", "Book your consultation")}
              />
            </div>
          </div>
        </div>

        <div className="h-16" />
      </div>
    </section>
  );
}