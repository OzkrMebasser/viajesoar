"use client";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { HelpCircle } from "lucide-react";
import type { Locale } from "@/types/locale";
import SplitText from "@/components/SplitText";
import ScrollIndicator from "@/components/ui/ScrollIndicator";

const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

interface FaqSection {
  title: string;
  items: FaqItem[];
}

interface Props {
  locale: Locale;
}

export default function FaqPage({ locale }: Props) {
  const [openIdx, setOpenIdx] = useState<string | null>(null);
const currentHeroImg = "https://res.cloudinary.com/dtsenvmdq/image/upload/v1780874413/preguntas-frecuentes-faqs_ovxv05.png"
  const sections: FaqSection[] = [
    {
      title: t(locale, "Acerca de VIAJESOAR", "About VIAJESOAR"),
      items: [
        {
          question: t(locale, "¿Cómo funciona?", "How does it work?"),
          answer: (
            <ol className="flex flex-col gap-3 mt-2">
              {[
                [t(locale, "Elige tu destino", "Choose your destination"), t(locale, "Explora nuestros paquetes y destinos disponibles o solicita una propuesta personalizada según tus intereses.", "Explore our packages and available destinations or request a personalized proposal.")],
                [t(locale, "Recibe tu cotización", "Receive your quote"), t(locale, "Uno de nuestros asesores preparará una propuesta adaptada a tus necesidades, fechas y presupuesto.", "One of our advisors will prepare a proposal tailored to your needs, dates, and budget.")],
                [t(locale, "Reserva y prepárate para viajar", "Book and get ready to travel"), t(locale, "Una vez confirmado tu viaje, nos encargaremos de coordinar todos los detalles.", "Once your trip is confirmed, we'll take care of all the details.")],
              ].map(([title, desc], i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="min-w-[22px] h-[22px] rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[11px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-[var(--text)]/80">
                    <strong className="text-theme">{title}</strong> — {desc}
                  </span>
                </li>
              ))}
            </ol>
          ),
        },
        {
          question: t(locale, "¿Dónde se encuentra VIAJESOAR?", "Where is VIAJESOAR located?"),
          answer: t(locale, "Somos una agencia de viajes en línea que brinda atención personalizada a clientes de todo México y el extranjero.", "We are an online travel agency providing personalized service to clients throughout Mexico and abroad."),
        },
        {
          question: t(locale, "¿Por qué reservar con VIAJESOAR?", "Why book with VIAJESOAR?"),
          answer: t(locale, "Porque ofrecemos atención personalizada, asesoría profesional, proveedores confiables y acompañamiento antes, durante y después de tu viaje.", "We offer personalized service, professional advice, reliable providers, and support before, during, and after your trip."),
        },
      ],
    },
    {
      title: t(locale, "Reservaciones", "Reservations"),
      items: [
        {
          question: t(locale, "¿Cómo puedo reservar?", "How can I book?"),
          answer: (
            <ol className="flex flex-col gap-3 mt-2">
              {[
                t(locale, "Selecciona el destino o paquete que te interese.", "Select the destination or package you're interested in."),
                t(locale, "Solicita una cotización.", "Request a quote."),
                t(locale, "Confirma los detalles con uno de nuestros asesores.", "Confirm the details with one of our advisors."),
                t(locale, "Realiza tu pago y recibe tu confirmación.", "Make your payment and receive your confirmation."),
              ].map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="min-w-[22px] h-[22px] rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[11px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-[var(--text)]/80">{step}</span>
                </li>
              ))}
            </ol>
          ),
        },
        { question: t(locale, "¿Puedo reservar para grupos?", "Can I book for groups?"), answer: t(locale, "Sí. Organizamos viajes para familias, grupos de amigos, empresas, escuelas y eventos especiales.", "Yes. We organize trips for families, friend groups, companies, schools, and special events.") },
        { question: t(locale, "¿Qué formas de pago aceptan?", "What payment methods do you accept?"), answer: t(locale, "Aceptamos transferencias bancarias, depósitos y otros métodos de pago disponibles al momento de tu reservación.", "We accept bank transfers, deposits, and other payment methods available at the time of your reservation.") },
        { question: t(locale, "¿Puedo pagar en parcialidades?", "Can I pay in installments?"), answer: t(locale, "Dependiendo del proveedor y la anticipación de tu viaje, contamos con opciones de pago flexibles. Consulta con tu asesor.", "Depending on the provider and how far in advance you book, we have flexible payment options. Consult with your advisor.") },
        { question: t(locale, "¿Puedo modificar mi reservación?", "Can I modify my reservation?"), answer: t(locale, "Sí, aunque los cambios están sujetos a disponibilidad y a las políticas de hoteles, aerolíneas y operadores turísticos.", "Yes, although changes are subject to availability and the policies of hotels, airlines, and tour operators.") },
        { question: t(locale, "¿Qué pasa si necesito cancelar?", "What if I need to cancel?"), answer: t(locale, "Las cancelaciones y reembolsos dependen de las políticas de cada proveedor. Te recomendamos revisar los términos de tu reservación y considerar la contratación de un seguro de viaje.", "Cancellations and refunds depend on each provider's policies. We recommend reviewing your reservation terms and considering travel insurance.") },
      ],
    },
    {
      title: t(locale, "Precios y Promociones", "Prices & Promotions"),
      items: [
        { question: t(locale, "¿Por qué cambian los precios?", "Why do prices change?"), answer: t(locale, "Las tarifas pueden variar según la temporada, disponibilidad, demanda, promociones vigentes y políticas de los proveedores.", "Rates may vary based on season, availability, demand, current promotions, and provider policies.") },
        { question: t(locale, "¿Cómo puedo enterarme de promociones?", "How can I find out about promotions?"), answer: t(locale, "Puedes seguirnos en nuestras redes sociales o contactarnos directamente para conocer ofertas y descuentos disponibles.", "You can follow us on social media or contact us directly to learn about available offers and discounts.") },
        { question: t(locale, "¿En qué moneda puedo pagar?", "What currency can I pay in?"), answer: t(locale, "Los pagos pueden realizarse en pesos mexicanos. Algunos servicios internacionales pueden cotizarse en dólares estadounidenses.", "Payments can be made in Mexican pesos. Some international services may be quoted in US dollars.") },
      ],
    },
    {
      title: t(locale, "Atención al Cliente", "Customer Service"),
      items: [
        { question: t(locale, "Tengo dudas sobre mi viaje, ¿cómo puedo contactarlos?", "I have questions about my trip, how can I contact you?"), answer: t(locale, "Puedes comunicarte con nosotros a través de WhatsApp, correo electrónico, redes sociales o cualquiera de nuestros canales oficiales de atención.", "You can reach us via WhatsApp, email, social media, or any of our official support channels.") },
        { question: t(locale, "¿Recibiré apoyo durante mi viaje?", "Will I receive support during my trip?"), answer: t(locale, "Sí. Nuestro equipo estará disponible para ayudarte antes, durante y después de tu experiencia de viaje.", "Yes. Our team will be available to help you before, during, and after your travel experience.") },
        { question: t(locale, "¿Ofrecen seguro de viaje?", "Do you offer travel insurance?"), answer: t(locale, "Podemos ayudarte a contratar seguros de viaje con distintas coberturas para brindarte mayor tranquilidad durante tu aventura.", "We can help you purchase travel insurance with various coverage options to give you greater peace of mind during your adventure.") },
      ],
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-theme">
      {/* ── HERO INFO OVERLAY ── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 sm:px-6 pb-0 lg:pb-8 text-white">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="text-[var(--accent)] w-4 h-4" />
          <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
            {t(locale, "Centro de Ayuda", "Help Center")}
          </span>
        </div>
        <SplitText
          text={t(locale, "Preguntas Frecuentes", "FAQ")}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 uppercase"
          delay={25}
          duration={0.5}
          splitType="chars"
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="left"
        />
        <p className="text-white/70 mt-2 max-w-md text-xs sm:text-sm [text-shadow:2px_2px_3px_#000000]">
          {t(locale, "Todo lo que necesitas saber antes de tu próxima aventura.", "Everything you need to know before your next adventure.")}
        </p>
      </div>

      {/* ── HERO BAND ── */}
      <div className="relative h-[100dvh] flex flex-col justify-end overflow-hidden text-white">
         <div className="absolute inset-0 z-0">
              {currentHeroImg ? (
            <img
              src={currentHeroImg}
              alt="blog hero"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/5" />
          )}
          {/* <div className="w-full h-full bg-white/5" /> */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-20 pt-10" />
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator targetId="faq-content" />

      {/* ── FAQ CONTENT ── */}
      <div
        className="max-w-5xl mx-auto px-4 sm:px-6 py-8 bg-gradient-theme"
        id="faq-content"
      >
        {/* Section header */}
        <div className="mb-10 pt-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-[var(--accent)]" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-theme-tittles">
              {t(locale, "Preguntas Frecuentes", "Frequently Asked Questions")}
            </h2>
          </div>
          <p className="text-[var(--accent)] text-xs tracking-widest uppercase ml-7">
            {t(locale, "Resolvemos tus dudas antes de viajar", "We answer your questions before you travel")}
          </p>
        </div>

        {/* FAQ sections */}
        <div className="flex flex-col gap-8 mb-16">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              {/* Section divider */}
              <div className="flex items-center gap-3 mb-1 uppercase text-sm font-bold tracking-wider">
                <span className="text-[var(--accent)]">{section.title}</span>
                <div className="flex-1 h-px bg-[var(--accent)]/40" />
              </div>

              {section.items.map((item, i) => {
                const key = `${section.title}-${i}`;
                const isOpen = openIdx === key;
                return (
                  <div
                    key={key}
                    className={`bg-white/5 border rounded-sm overflow-hidden transition-all duration-300 ${
                      isOpen
                        ? "border-[var(--accent)]/30"
                        : "border-[var(--border)]/40"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : key)}
                      className="w-full flex items-center justify-between px-5 py-[12.5px] text-left"
                    >
                      <span
                        className={`font-semibold text-sm transition-colors ${
                          isOpen ? "text-[var(--accent)]" : "text-theme-tittles"
                        }`}
                      >
                        {item.question}
                      </span>
                      <FaChevronDown
                        className={`text-[var(--text)] text-xs transition-transform duration-300 flex-shrink-0 ml-4 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-[var(--border)]/40 pt-4 text-sm text-[var(--text)]/80 leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}