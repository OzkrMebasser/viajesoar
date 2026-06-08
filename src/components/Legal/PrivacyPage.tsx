import type { Locale } from "@/types/locale";
import SplitText from "@/components/SplitText";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import { ShieldCheck } from "lucide-react";

import privacyData from "../../lib/data/privacy/privacy.json"; 

interface Props {
  locale: Locale;
}

const HERO_IMAGE =
  "https://res.cloudinary.com/dtsenvmdq/image/upload/v1780873840/aviso-de-privacidad_gxhjna.png";

export default function PrivacyPage({ locale }: Props) {
  const { meta, sections, contact } = privacyData;

  return (
    <section className="min-h-screen bg-gradient-theme">
      {/* ── HERO INFO OVERLAY ── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 sm:px-6 pb-0 lg:pb-8 text-white">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="text-[var(--accent)] w-4 h-4" />
          <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
            {locale === "es" ? meta.eyebrow.es : meta.eyebrow.en}
          </span>
        </div>

        <SplitText
          text={locale === "es" ? meta.heroTitle.es : meta.heroTitle.en}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 uppercase"
          delay={25}
          duration={0.5}
          splitType="chars"
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="left"
        />

        <p className="text-white/70 mt-2 max-w-md text-xs sm:text-sm [text-shadow:2px_2px_3px_#000000]">
          {locale === "es" ? meta.heroSubtitle.es : meta.heroSubtitle.en}
        </p>
      </div>

      {/* ── HERO BAND ── */}
      <div className="relative h-[100dvh] flex flex-col justify-end overflow-hidden text-white">
           <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt="payment hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-20 pt-10" />
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator targetId="privacy-content" />

      {/* ── DOCUMENT CONTENT ── */}
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8 bg-gradient-theme"
        id="privacy-content"
      >
        {/* Document header */}
        <div className="mb-10 pt-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-theme-tittles">
              {locale === "es" ? meta.sectionTitle.es : meta.sectionTitle.en}
            </h2>
          </div>
          <p className="text-[var(--accent)] text-xs tracking-widest uppercase ml-7">
            {locale === "es" ? meta.sectionSubtitle.es : meta.sectionSubtitle.en}
          </p>
        </div>

        {/* Flat document body */}
        <div className="flex flex-col gap-8 mb-16">
          {sections.map((section) => {
            const title = locale === "es" ? section.title.es : section.title.en;
            const raw = locale === "es" ? section.content.es : section.content.en;
            const paragraphs = Array.isArray(raw) ? raw : [raw];
            return (
              <div key={section.id}>
                <h3 className="text-sm font-bold uppercase tracking-widest text-theme-tittles mb-3">
                  {title}
                </h3>
                <div className="flex flex-col gap-3">
                  {paragraphs.map((para, i) => (
                    <p key={i} className="text-[var(--text)]/80 text-sm leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer contact */}
        <div className="border-t border-white/10 pt-8 mb-16 flex flex-col gap-1.5 text-sm text-[var(--text)]/70">
          <p className="font-semibold text-[var(--accent)] uppercase tracking-widest text-xs mb-2">
            {contact.name}
          </p>
          <p>{contact.address}</p>
          <p>
            <a href={`mailto:${contact.email}`} className="hover:text-[var(--accent)] transition-colors">
              {contact.email}
            </a>
            {" | "}
            <a href={`tel:${contact.phone.replace(/-/g, "")}`} className="hover:text-[var(--accent)] transition-colors">
              Tel: {contact.phone}
            </a>
            {" | "}
            <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">
              WhatsApp: {contact.whatsapp}
            </a>
            {" | "}
            <a href={contact.websiteHref} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">
              {contact.website}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}