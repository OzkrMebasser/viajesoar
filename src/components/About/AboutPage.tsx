"use client";

import { useState, useEffect, useRef } from "react";
import type { Locale } from "@/types/locale";
import SplitText from "@/components/SplitText";
import CardParticlesCanvas from "@/components/ui/Particles/CardParticlesCanvas";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import BadgeAccent from "@/components/ui/BadgeAccent";
import {
  FaGlobeAmericas,
  FaUserTie,
  FaStar,
  FaShieldAlt,
  FaLaptop,
  FaHandshake,
  FaCheckCircle,
} from "react-icons/fa";
import { MdFlightTakeoff } from "react-icons/md";
import { Compass, Target } from "lucide-react";
import ButtonArrow from "../ui/ButtonArrow";

interface Props {
  locale: Locale;
}

const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

// ── Animated Stats Counter ──────────────────────────────────────────
interface Stat {
  target: number;
  suffix: string;
  label: string;
  description: string;
}

function AnimatedStatsCounter({ stats }: { stats: Stat[] }) {
  const [values, setValues] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2200;
          const interval = 30;
          const steps = duration / interval;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            if (step >= steps) {
              clearInterval(timer);
              setValues(stats.map((s) => s.target));
              return;
            }
            const ease = 1 - Math.pow(1 - step / steps, 3);
            setValues(stats.map((s) => Math.floor(s.target * ease)));
          }, interval);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated, stats]);

  return (
    <div ref={ref} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="glass-card border border-white/10 rounded-sm p-6 text-center hover:border-[var(--accent)]/30 transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/5 transition-all duration-500" />
          <p className="text-[var(--accent)] font-bold text-3xl sm:text-4xl mb-1 relative z-10 tabular-nums">
            {values[i]}
            {stat.suffix}
          </p>
          <p className="text-theme-tittles text-sm font-semibold uppercase tracking-widest relative z-10 mb-1">
            {stat.label}
          </p>
          <p className="text-[var(--text)]/40 text-[10px] tracking-wide relative z-10">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Reasons ─────────────────────────────────────────────────────────
const reasons = (locale: Locale) => [
  {
    icon: <FaUserTie className="text-[var(--accent)] text-xl" />,
    text: t(
      locale,
      "Más de 30 años de experiencia combinada creando viajes nacionales e internacionales inolvidables.",
      "Over 30 years of combined experience creating unforgettable national and international travel experiences.",
    ),
  },
  {
    icon: <FaHandshake className="text-[var(--accent)] text-xl" />,
    text: t(
      locale,
      "Atención cercana, personalizada y asesoría profesional en cada paso de tu viaje.",
      "Friendly, personalized attention and professional guidance every step of your journey.",
    ),
  },
  {
    icon: <FaStar className="text-[var(--accent)] text-xl" />,
    text: t(
      locale,
      "Paquetes, tours y experiencias cuidadosamente seleccionadas para cada tipo de viajero.",
      "Packages, tours, and experiences carefully selected for every type of traveler.",
    ),
  },
  {
    icon: <FaGlobeAmericas className="text-[var(--accent)] text-xl" />,
    text: t(
      locale,
      "Descubre México y el mundo con experiencias auténticas y memorables.",
      "Discover Mexico and the world through authentic and memorable experiences.",
    ),
  },
  {
    icon: <FaLaptop className="text-[var(--accent)] text-xl" />,
    text: t(
      locale,
      "Una agencia 100% online, moderna, segura y siempre al alcance de tus manos.",
      "A 100% online agency that is modern, secure, and always within your reach.",
    ),
  },
  {
    icon: <FaShieldAlt className="text-[var(--accent)] text-xl" />,
    text: t(
      locale,
      "Comprometidos con la confianza, transparencia y calidad en cada experiencia.",
      "Committed to trust, transparency, and quality in every experience.",
    ),
  },
];

// ── Main Component ───────────────────────────────────────────────────
export default function AboutPage({ locale }: Props) {
  const stats = (l: Locale): Stat[] => [
    {
      target: 30,
      suffix: "+",
      label: t(l, "Años de experiencia", "Years of experience"),
      description: t(
        l,
        "Experiencia combinada en turismo",
        "Combined tourism experience",
      ),
    },
    {
      target: 5,
      suffix: "",
      label: t(l, "Continentes", "Continents"),
      description: t(l, "Destinos en todo el mundo", "Destinations worldwide"),
    },
    {
      target: 100,
      suffix: "%",
      label: t(l, "Online", "Online"),
      description: t(l, "Moderna y accesible", "Modern and accessible"),
    },
    {
      target: 1000,
      suffix: "+",
      label: t(l, "Destinos", "Destinations"),
      description: t(
        l,
        "Hoteles, tours y experiencias alrededor del mundo",
        "Hotels, tours, and experiences around the world",
      ),
    },
    // {
    //   target: 98,
    //   suffix: "%",
    //   label: t(l, "Satisfacción", "Satisfaction"),
    //   description: t(l, "Clientes satisfechos", "Happy travelers"),
    // },
  ];

  return (
    <section className="min-h-screen  bg-gradient-theme">
      {/* ── HERO OVERLAY TEXT ── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 sm:px-6 pb-0 lg:pb-8 text-white">
        <div className="flex items-center gap-2 mb-4">
          <MdFlightTakeoff className="text-[var(--accent)] w-4 h-4" />
          <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
            {t(locale, "Nuestra historia", "Our story")}
          </span>
        </div>

        <SplitText
          text={t(locale, "Quiénes Somos", "About Us")}
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
            "Agencia de viajes online con más de 30 años de experiencia combinada.",
            "Online travel agency with over 30 years of combined experience.",
          )}
        </p>
      </div>

      {/* ── HERO BAND ── */}
      <div className="relative h-[100dvh] flex flex-col justify-end overflow-hidden text-white ">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/13987300/pexels-photo-13987300.jpeg"
            alt="about hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-20 pt-10" />
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator targetId="about-content" />

      {/* ── MAIN CONTENT ── */}
      <div
        className="max-w-5xl mx-auto px-4 sm:px-6 py-8 bg-gradient-theme"
        id="about-content"
      >
        {/* Section header */}
        <div className="mb-10 pt-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-theme-tittles">
              {t(locale, "Sobre Nosotros", "About Us")}
            </h2>
          </div>
          <p className="text-[var(--accent)] text-xs tracking-widest uppercase ml-7">
            {t(
              locale,
              "Viajes que transforman, recuerdos que perduran",
              "Journeys that transform, memories that last",
            )}
          </p>
        </div>

        {/* ── INTRO CARD ── */}
        <div className="glass-card border border-white/10 rounded-sm overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300 relative mb-8 p-8 sm:p-12">
          <div className="relative z-10 text-justify ">
            <p className="text-[var(--text)]/90 text-base sm:text-lg leading-relaxed ">
              {t(locale, "En ", "At ")}
              <span className="text-[1rem] font-bold tracking-wider">
                VIAJE<span className="accent">SOAR</span>
              </span>
              {t(
                locale,
                " creemos que viajar es mucho más que visitar un destino; es descubrir nuevas culturas, crear recuerdos inolvidables y vivir experiencias que marcan cada etapa de la vida.",
                " we believe that traveling is much more than visiting a destination; it's discovering new cultures, creating unforgettable memories and living experiences that mark every stage of life.",
              )}
            </p>
            <p className="text-[var(--text)]/70 text-sm leading-relaxed mt-4 text-justify">
              {t(
                locale,
                "Somos una agencia de viajes online especializada en viajes nacionales e internacionales, ofreciendo paquetes, tours y experiencias diseñadas para viajeros que buscan confianza, calidad y atención personalizada. Desde las playas de México hasta los rincones más fascinantes de Europa, Asia, Medio Oriente, África y Sudamérica, ayudamos a nuestros clientes a explorar el mundo de manera segura y memorable.",
                "We are an online travel agency specialized in national and international travel, offering packages, tours and experiences designed for travelers who seek trust, quality and personalized attention. From the beaches of Mexico to the most fascinating corners of Europe, Asia, the Middle East, Africa and South America, we help our clients explore the world safely and memorably.",
              )}
            </p>
          </div>
        </div>

        {/* ── ANIMATED STATS ── */}
        <AnimatedStatsCounter stats={stats(locale)} />

        {/* ── EXPERIENCE BLOCK ── */}
        <div className="glass-card border border-white/10 rounded-sm overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300 relative mb-8 p-8 sm:p-12">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-3 rounded-lg bg-[var(--accent)]/5 hover:bg-[var(--accent)]/20 accent hover:accent transition-all duration-300 transform hover:scale-110 hover:rotate-5 transition-colors">
                <FaUserTie className="text-[var(--accent)]  " />
              </div>
              <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
                {t(locale, "Nuestra experiencia", "Our experience")}
              </span>
            </div>
            <p className="text-[var(--text)]/80 text-sm leading-relaxed">
              {t(
                locale,
                "Nuestro equipo cuenta con más de 30 años de experiencia combinada en la industria turística, participando en la planeación, operación y asesoría de viajes tanto nacionales como internacionales. Gracias a esta experiencia, entendemos lo importante que es cada viaje y trabajamos para ofrecer opciones cuidadosamente seleccionadas, atención cercana y acompañamiento en cada paso.",
                "Our team has over 30 years of combined experience in the tourism industry, participating in the planning, operation and advisory of both national and international travel. Thanks to this experience, we understand how important each trip is and we work to offer carefully selected options, close attention and accompaniment at every step.",
              )}
            </p>
            <p className="text-[var(--text)]/70 text-sm leading-relaxed mt-4">
              {t(
                locale,
                "En VIAJESOAR nos enfocamos en brindar experiencias auténticas y accesibles, conectando a nuestros viajeros con destinos increíbles, ya sea una escapada por México, unas vacaciones en el Caribe, un recorrido cultural por Europa o una aventura por Asia.",
                "At VIAJESOAR we focus on providing authentic and accessible experiences, connecting our travelers with incredible destinations, whether it's a getaway through Mexico, a vacation in the Caribbean, a cultural tour through Europe or an adventure through Asia.",
              )}
            </p>
          </div>
        </div>

        {/* ── WHY US ── */}
        <div className="mb-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]" />
              <h3 className="text-xl font-bold uppercase tracking-widest text-theme-tittles">
                {t(
                  locale,
                  "¿Por qué viajar con nosotros?",
                  "Why travel with us?",
                )}
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reasons(locale).map((reason, i) => (
              <div
                key={i}
                className="hover:scale-105 transition-all duration-300 glass-card border border-white/10 rounded-sm p-5 hover:border-[var(--accent)]/30 transition-all duration-300 relative overflow-hidden flex gap-4 items-start"
              >
                <div className="p-3 rounded-lg bg-[var(--accent)]/5 hover:bg-[var(--accent)]/20 accent hover:accent transition-all duration-300 transform hover:scale-110 hover:rotate-5 transition-colors">
                  {reason.icon}
                </div>
                <p className="relative z-10 text-[var(--text)]/80 text-sm leading-relaxed">
                  {reason.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── MISSION & VISION ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="glass-card border border-white/10 rounded-sm overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300 relative p-8">
            <div className="absolute inset-0 opacity-50 pointer-events-none">
              <CardParticlesCanvas />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Target className="text-[var(--accent)] w-5 h-5" />
                <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
                  {t(locale, "Nuestra misión", "Our mission")}
                </span>
              </div>
              <p className="text-[var(--text)]/80 text-sm leading-relaxed">
                {t(
                  locale,
                  "Brindar experiencias de viaje memorables a través de un servicio confiable, accesible y personalizado, conectando a nuestros viajeros con los mejores destinos nacionales e internacionales.",
                  "Provide memorable travel experiences through a reliable, accessible and personalized service, connecting our travelers with the best national and international destinations.",
                )}
              </p>
            </div>
          </div>

          <div className="glass-card border border-white/10 rounded-sm overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300 relative p-8">
            <div className="absolute inset-0 opacity-50 pointer-events-none">
              <CardParticlesCanvas />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Compass className="text-[var(--accent)] w-5 h-5" />
                <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
                  {t(locale, "Nuestra visión", "Our vision")}
                </span>
              </div>
              <p className="text-[var(--text)]/80 text-sm leading-relaxed">
                {t(
                  locale,
                  "Convertirnos en una agencia de viajes online reconocida por la confianza, calidad y pasión por crear experiencias inolvidables en México y el mundo.",
                  "Become an online travel agency recognized for trust, quality and passion for creating unforgettable experiences in Mexico and the world.",
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ── CTA BANNER ── */}
        <div className="glass-card border border-[var(--accent)]/20 rounded-sm overflow-hidden relative p-10 sm:p-14 text-center">
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
          <div className="relative z-10">
            <MdFlightTakeoff className="text-[var(--accent)] text-4xl mx-auto mb-4" />
            <SplitText
              text={t(
                locale,
                "¿Listo para explorar el mundo?",
                "Ready to explore the world?",
              )}
              className="text-2xl sm:text-3xl tracking-widest font-bold mb-3 uppercase text-white"
              delay={25}
              duration={0.5}
              splitType="chars"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="center"
            />
            <p className="text-white/70 text-sm max-w-md mx-auto mb-6">
              {t(
                locale,
                "Contáctanos y déjanos ayudarte a planear tu próxima aventura.",
                "Contact us and let us help you plan your next adventure.",
              )}
            </p>
            {/* <a
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-black font-bold text-xs tracking-[0.2em] uppercase px-8 py-3 rounded-sm hover:opacity-90 transition-opacity duration-200"
            >
              <FaCheckCircle className="text-sm" />
              {t(locale, "Contáctanos", "Contact us")}
            </a> */}
            <ButtonArrow
              className="inline-flex items-center gap-2  "
              title={t(locale, "Contáctanos", "Contact us")}
              href={`/${locale}/contact`}
            />
          </div>
        </div>

        <div className="h-16" />
      </div>
    </section>
  );
}
