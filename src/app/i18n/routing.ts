import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  pathnames: {
    "/": {
      en: "/",
      es: "/",
    },
     "/login": {
      en: "/login",
      es: "/iniciar-sesion", // o simplemente "/login" si quieres mantenerlo igual
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
      es: "/blog",
    },
    "/destinations": {
      en: "/destinations",
      es: "/destinos",
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
