import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  pathnames: {
    "/": "/",

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
    "/blog": "/blog",
  },
});
