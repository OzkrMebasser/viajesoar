"use client";
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
import {
  FaPersonWalkingLuggage,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6";
import { IoAirplane } from "react-icons/io5";
import Link from "next/link";
import ButtonArrow from "../ui/ButtonArrow";
import { Locale } from "@/types/locale";
import NewsletterSection from "./NewsletterSection";
import { abort } from "process";

const translations = {
  es: {
    quickLinks: "Enlaces Rápidos",
    packages: "Paquetes",
    destinations: "Destinos",
    tours: "Tours",
    offers: "Ofertas",
    blog: "Blog",
    contact: "Contacto",
    aboutUs: "Nosotros",
    company: "Empresa",
    about: "Acerca de",
    careers: "Carreras",
    press: "Prensa",
    partners: "Socios",
    contactinfo: "Contáctanos",
    legal: "Legal",
    faq: "Preguntas Frecuentes",
    privacy: "Política de Privacidad",
    terms: "Términos y Condiciones",
    payment: "Formas de Pago",
    newsletter: "Boletín",
    subscribeText: "Suscribirse a nuestras ofertas exclusivas",
    emailPlaceholder: "Tu correo electrónico",
    subscribe: "Suscribirse",
    followUs: "Síguenos",
    madeWith: "Hecho con",
    allRights: "Todos los derechos reservados",
    exploreWorld: "Explora el mundo con nosotros",
    bestDeals: "Las mejores ofertas en viajes",
    support24: "Haz realidad tu próxima aventura",
  },
  en: {
    quickLinks: "Quick Links",
    packages: "Packages",
    destinations: "Destinations",
    tours: "Tours",
    offers: "Offers",
    blog: "Blog",
    contact: "Contact",
    aboutUs: "About Us",
    company: "Company",
    about: "About",
    careers: "Careers",
    press: "Press",
    partners: "Partners",
    contactinfo: "Contact Us",
    legal: "Legal",
    faq: "FAQ",
    privacy: "Privacy Policy",
    payment: "Payment Methods",
    terms: "Terms & Conditions",
    newsletter: "Newsletter",
    subscribeText: "Subscribe to our exclusive travel deals",
    emailPlaceholder: "Your email address",
    subscribe: "Subscribe",
    followUs: "Follow Us",
    madeWith: "Made with",
    allRights: "All rights reserved",
    exploreWorld: "Explore the world with us",
    bestDeals: "The best travel deals",
    support24: "Make Your Next Adventure a Reality",
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

  const routes: Record<string, Record<string, string>> = {
    home: { es: "/", en: "/" },
    packages: { es: "/paquetes", en: "/packages" },
    destinations: { es: "/destinos", en: "/destinations" },
    tours: { es: "/tours", en: "/tours" },
    offers: { es: "/ofertas", en: "/offers" },
    blog: { es: "/blog", en: "/blog" },
    contact: { es: "/contacto", en: "/contact" },
    about: { es: "/nosotros", en: "/about-us" },
  };

  const quickLinks = [
    { label: t.packages, href: `/${locale}${routes.packages[locale]}` },
    { label: t.destinations, href: `/${locale}${routes.destinations[locale]}` },
    { label: t.tours, href: `/${locale}${routes.tours[locale]}` },
    { label: t.offers, href: `/${locale}${routes.offers[locale]}` },
    { label: t.blog, href: `/${locale}${routes.blog[locale]}` },
    // { label: t.contact, href: `/${locale}${routes.contact[locale]}` },
  ];
  const companyLinks = [
    { label: t.about, href: `/${locale}${routes.about[locale]}` },
    { label: t.contactinfo, href: `/${locale}${routes.contact[locale]}` },
    { label: t.careers, href: "#" },
    { label: t.partners, href: "#" },
  ];

  const legalLinks = [
    {
      label: t.faq,
      href: locale === "es" ? "/es/preguntas-frecuentes" : "/en/faq",
    },
    {
      label: t.privacy,
      href: locale === "es" ? "/es/aviso-de-privacidad" : "/en/privacy-policy",
    },
    {
      label: t.terms,
      href:
        locale === "es"
          ? "/es/terminos-y-condiciones"
          : "/en/terms-and-conditions",
    },
    {
      label: t.payment,
      href: locale === "es" ? "/es/formas-de-pago" : "/en/payment-methods",
    },
  ];

  const features = [
    {
      icon: IoAirplane,
      title: t.exploreWorld,
      description: t.bestDeals,
    },
    {
      icon: FaPersonWalkingLuggage,
      title: t.support24,
      description:
        locale === "es"
          ? "Creamos experiencias memorables"
          : "We Create Memorable Experiences",
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
    <footer className="bg-gradient-theme text-theme  relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Features Section */}
        <div className="border-b border-theme px-4 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-4 group hover:scale-105 transition-all duration-300"
                  >
                    <div className="p-3 rounded-lg bg-[var(--accent)]/10 group-hover:bg-[var(--accent)]/20 transition-colors">
                      <Icon className="w-6 h-6 accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-theme mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-theme-tittles">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Newsletter Section */}
        <NewsletterSection locale={locale} />
        {/* Main Content */}
        <div className="px-4 py-16 sm:py-20 ">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {/* Logo Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <img
                  src="/VIAJES-soar-logo-blues.png"
                  alt="ViajeSoar Logo"
                  className="w-10 h-10"
                />
                <span className="text-xl font-bold tracking-wider">
                  VIAJE<span className="accent">SOAR</span>
                </span>
              </div>
              <p className="text-theme text-sm mb-6 leading-relaxed">
                {locale === "es"
                  ? "Tu agencia de viajes online de confianza"
                  : "Your trusted online travel agency"}
              </p>
              <h4 className="font-semibold text-theme mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-[var(--accent)] rounded-full" />
                {t.followUs}
              </h4>
              <div className="flex gap-4">
                {[FaFacebook, FaInstagram, FaTiktok, FaXTwitter].map(
                  (Icon, idx) => (
                    <button
                      key={idx}
                      className="p-2 rounded-lg bg-[var(--accent)]/5 hover:bg-[var(--accent)]/20 accent hover:accent transition-all duration-300 transform hover:scale-110 hover:rotate-5"
                      aria-label="Social media"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-theme  mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-[var(--accent)] rounded-full" />
                {t.quickLinks}
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="hover:text-[var(--accent)] transition-colors duration-300 flex items-center gap-2 group text-sm"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-[var(--accent)] transition-all duration-300" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-theme mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-[var(--accent)] rounded-full" />
                {t.company}
              </h4>
              <ul className="space-y-3">
                {companyLinks.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="hover:text-[var(--accent)] transition-colors duration-300 flex items-center gap-2 group text-sm"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-[var(--accent)] transition-all duration-300" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="font-semibold text-theme mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-[var(--accent)] rounded-full" />
                {t.legal}
              </h4>
              <ul className="space-y-3 mb-6">
                {legalLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="hover:text-[var(--accent)] transition-colors duration-300 flex items-center gap-2 group text-sm"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-[var(--accent)] transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact Info */}
            <div className="space-y-3">
              {/* Teléfono */}
              <a
                href="tel:+526124029656"
                className="flex items-center gap-3 text-theme group"
              >
                <div className="p-2 rounded-lg bg-[var(--accent)]/5 hover:bg-[var(--accent)]/20 accent transition-all duration-300 transform hover:scale-110">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm group-hover:ml-[5px] group-hover:text-[var(--accent)] transition-all duration-300">
                  +52 (612) 402 9656
                </span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/526121037422"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-theme group"
              >
                <div className="p-2 rounded-lg bg-[var(--accent)]/5 hover:bg-[var(--accent)]/20 accent transition-all duration-300 transform hover:scale-110">
                  <FaWhatsapp className="w-4 h-4" />
                </div>
                <span className="text-sm group-hover:ml-[5px] group-hover:text-[var(--accent)] transition-all duration-300">
                  +52 (612) 103 7422
                </span>
              </a>

              {/* Email */}
              <a
                href="mailto:info.viajesoar@gmail.com"
                className="flex items-center gap-3 text-theme group"
              >
                <div className="p-2 rounded-lg bg-[var(--accent)]/5 hover:bg-[var(--accent)]/20 accent transition-all duration-300 transform hover:scale-110">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm group-hover:ml-[5px] group-hover:text-[var(--accent)] transition-all duration-300">
                  info.viajesoar@gmail.com
                </span>
              </a>

              {/* Ubicación */}
              <a
                href="https://maps.google.com/?q=La+Paz,+Baja+California+Sur,+Mexico"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-theme group"
              >
                <div className="p-2 rounded-lg bg-[var(--accent)]/5 hover:bg-[var(--accent)]/20 accent transition-all duration-300 transform hover:scale-110">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm group-hover:ml-[5px] group-hover:text-[var(--accent)] transition-all duration-300">
                  La Paz, Baja California Sur, MX
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-theme px-4 py-8 lg:px-24">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-theme text-sm flex items-center gap-2">
              © 2025 - {new Date().getFullYear()}{" "}
              <span className=" tracking-wider">
                VIAJE<span className="accent ml-[1px]">SOAR </span>
              </span>{" "}
              {t.allRights}.
            </p>
            <p className="text-theme text-sm flex items-center gap-1">
              {t.madeWith}{" "}
              <Heart className="w-4 h-4 text-[var(--accent)] fill-current" />{" "}
              para los viajeros
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
