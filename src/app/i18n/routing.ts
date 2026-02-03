import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  // localePrefix: 'as-needed',
  pathnames: {
    "/": {
      en: "/",
      es: "/",
    },
    "/login": {
      en: "/login",
      es: "/iniciar-sesion",
    },
    "/sign-up": {
      en: "/sign-up",
      es: "/registrarse",
    },
    "/about": {
      en: "/about",
      es: "/acerca-de",
    },
    "/services": {
      en: "/services",
      es: "/servicios",
    },
    "/contact": {
      en: "/contact",
      es: "/contacto",
    },
    "/blog": {
      en: "/blog",
      es: "/blog-es",
    },
    "/destinations": {
      en: "/destinations",
      es: "/destinos",
    },
    "/favorites": {
      en: "/favorites",
      es: "/favoritos",
    },
    "/flights": {
      en: "/flights",
      es: "/vuelos",
    },
    "/offers": {
      en: "/offers",
      es: "/ofertas",
    },
    "/bookings": {
      en: "/bookings",
      es: "/reservaciones",
    },
    "/about-us": {
      en: "/about-us",
      es: "/nosotros",
    },
    "/faq": {
      en: "/faq",
      es: "/preguntas-frecuentes",
    },
  },
});
