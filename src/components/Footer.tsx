"use client"
import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowRight,
  Plane,
  Clock,
} from "lucide-react";

type Locale = "es" | "en";

const translations = {
  es: {
    quickLinks: "Enlaces Rápidos",
    services: "Servicios",
    destinations: "Destinos",
    flights: "Vuelos",
    offers: "Ofertas",
    contact: "Contacto",
    company: "Empresa",
    about: "Acerca de",
    careers: "Carreras",
    press: "Prensa",
    partners: "Socios",
    support: "Soporte",
    faq: "Preguntas Frecuentes",
    privacy: "Política de Privacidad",
    terms: "Términos y Condiciones",
    newsletter: "Boletín",
    subscribeText: "Suscribirse a nuestras ofertas exclusivas",
    emailPlaceholder: "Tu correo electrónico",
    subscribe: "Suscribirse",
    followUs: "Síguenos",
    contactInfo: "Información de Contacto",
    madeWith: "Hecho con",
    allRights: "Todos los derechos reservados",
    exploreWorld: "Explora el mundo con nosotros",
    bestDeals: "Las mejores ofertas en viajes",
    support24: "Soporte disponible 24/7",
  },
  en: {
    quickLinks: "Quick Links",
    services: "Services",
    destinations: "Destinations",
    flights: "Flights",
    offers: "Offers",
    contact: "Contact",
    company: "Company",
    about: "About",
    careers: "Careers",
    press: "Press",
    partners: "Partners",
    support: "Support",
    faq: "FAQ",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    newsletter: "Newsletter",
    subscribeText: "Subscribe to our exclusive travel deals",
    emailPlaceholder: "Your email address",
    subscribe: "Subscribe",
    followUs: "Follow Us",
    contactInfo: "Contact Information",
    madeWith: "Made with",
    allRights: "All rights reserved",
    exploreWorld: "Explore the world with us",
    bestDeals: "The best travel deals",
    support24: "Support available 24/7",
  },
};

const Footer = ({ locale = "es" }: { locale?: Locale }) => {
  const t = translations[locale];
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { label: t.services, href: "#" },
    { label: t.destinations, href: "#" },
    { label: t.flights, href: "#" },
    { label: t.offers, href: "#" },
    { label: t.contact, href: "#" },
  ];

  const companyLinks = [
    { label: t.about, href: "#" },
    { label: t.careers, href: "#" },
    { label: t.press, href: "#" },
    { label: t.partners, href: "#" },
  ];

  const supportLinks = [
    { label: t.faq, href: "#" },
    { label: t.privacy, href: "#" },
    { label: t.terms, href: "#" },
  ];

  const features = [
    {
      icon: Plane,
      title: t.exploreWorld,
      description: t.bestDeals,
    },
    {
      icon: Clock,
      title: t.support24,
      description:
        locale === "es" ? "Contacta en cualquier momento" : "Contact us anytime",
    },
    {
      icon: MapPin,
      title: "1000+ Destinos",
      description:
        locale === "es"
          ? "Descubre lugares increíbles en todo el mundo"
          : "Discover amazing places worldwide",
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-black via-gray-950 to-black text-white relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Features Section */}
        <div className="border-b border-gray-800 px-4 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-4 group hover:scale-105 transition-all duration-300"
                  >
                    <div className="p-3 rounded-lg bg-teal-500/10 group-hover:bg-teal-500/20 transition-colors">
                      <Icon className="w-6 h-6 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-100 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Logo Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <img
                  src="/VIAJES-soar-logo-blues.png"
                  alt="ViajeSoar Logo"
                  className="w-10 h-10"
                />
                <span className="text-xl font-bold tracking-wider">
                  VIAJE<span className="text-teal-400">SOAR</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                {locale === "es"
                  ? "Tu agencia de viajes de confianza para descubrir los mejores destinos del mundo."
                  : "Your trusted travel agency to discover the best destinations worldwide."}
              </p>
              <div className="flex gap-4">
                {[Facebook, Instagram, Twitter, Linkedin].map((Icon, idx) => (
                  <button
                    key={idx}
                    className="p-2 rounded-lg bg-white/5 hover:bg-teal-500/20 text-gray-400 hover:text-teal-400 transition-all duration-300 transform hover:scale-110"
                    aria-label="Social media"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-teal-400 rounded-full" />
                {t.quickLinks}
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2 group text-sm"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-teal-400 rounded-full" />
                {t.company}
              </h4>
              <ul className="space-y-3">
                {companyLinks.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2 group text-sm"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Contact */}
            <div>
              <h4 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-teal-400 rounded-full" />
                {t.support}
              </h4>
              <ul className="space-y-3 mb-6">
                {supportLinks.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2 group text-sm"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span className="text-sm text-gray-400">+1 234 567 890</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span className="text-sm text-gray-400">info@viagesoar.com</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-400">
                    La Paz, Baja California Sur, MX
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-t border-gray-800 pt-12 mt-8">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-2 text-center">
                {t.newsletter}
              </h3>
              <p className="text-gray-400 text-center mb-6">{t.subscribeText}</p>

              <div
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="flex-1 relative">
                  <input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors"
                    required
                  />
                </div>
                <button
                  onClick={() => {
                    if (email) {
                      setSubscribed(true);
                      setEmail("");
                      setTimeout(() => setSubscribed(false), 3000);
                    }
                  }}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group whitespace-nowrap"
                >
                  {t.subscribe}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {subscribed && (
                <p className="text-center text-teal-400 text-sm mt-3 animate-pulse">
                  ✓{" "}
                  {locale === "es"
                    ? "¡Gracias por suscribirse!"
                    : "Thank you for subscribing!"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 px-4 py-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              © 2024 ViajeSoar. {t.allRights}.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              {t.madeWith}{" "}
              <Heart className="w-4 h-4 text-teal-400 fill-current" /> para los
              viajeros
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;