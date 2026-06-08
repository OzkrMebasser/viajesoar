"use client";
import React from "react";
import { ArrowRight, CheckCircle2, Tag, Map, Bell, Shield } from "lucide-react";
import { Locale } from "@/types/locale";
import { createClient } from "@supabase/supabase-js";
import SplitText from "@/components/SplitText";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

const getPerks = (locale: Locale) => [
  {
    icon: Tag,
    label: t(
      locale,
      "Ofertas exclusivas antes de hacerse públicas",
      "Exclusive deals before they go public",
    ),
  },
  {
    icon: Map,
    label: t(
      locale,
      "Itinerarios secretos de nuestros expertos",
      "Secret itineraries from our travel experts",
    ),
  },
  {
    icon: Bell,
    label: t(
      locale,
      "Alertas de precio en tiempo real",
      "Real-time price drop alerts",
    ),
  },
];

const NewsletterSection = ({ locale = "es" }: { locale?: Locale }) => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [privacyAccepted, setPrivacyAccepted] = React.useState(false);
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = React.useState("");
  const isSubmitting = React.useRef(false);

  const handleSubscribe = async () => {
    if (isSubmitting.current) return; // bloquea llamadas duplicadas

    setErrorMsg("");

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg(
        t(
          locale,
          "Por favor ingresa tu nombre completo.",
          "Please enter your full name.",
        ),
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrorMsg(
        t(
          locale,
          "Por favor ingresa un correo válido.",
          "Please enter a valid email.",
        ),
      );
      return;
    }

    if (!privacyAccepted) {
      setErrorMsg(
        t(
          locale,
          "Debes aceptar el aviso de privacidad para continuar.",
          "You must accept the privacy policy to continue.",
        ),
      );
      return;
    }

    isSubmitting.current = true;
    setStatus("loading");

    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.toLowerCase().trim(),
        locale,
        privacy_accepted: true,
        privacy_accepted_at: new Date().toISOString(),
        source: "footer",
      });

    isSubmitting.current = false;

    // Log detallado para ver el error real
    if (insertError) {
      console.log("code:", insertError.code);
      console.log("message:", insertError.message);
      console.log("details:", insertError.details);
      console.log("hint:", insertError.hint);

      if (insertError.code === "23505") {
        setErrorMsg(
          t(
            locale,
            "Este correo ya está registrado.",
            "This email is already registered.",
          ),
        );
        setStatus("error");
        return;
      }

      setErrorMsg(
        t(
          locale,
          "Algo salió mal. Intenta de nuevo.",
          "Something went wrong. Please try again.",
        ),
      );
      setStatus("error");
      return;
    }

    setStatus("success");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPrivacyAccepted(false);
  };
  return (
    <div className="border-b border-theme py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Layout de dos columnas en desktop */}
        <div className="text-center mb-8">
          <SplitText
            key={locale}
            text={t(locale, "Viajeros Exclusivos", "Exclusive Travelers")}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-theme-tittles mb-3 uppercase"
            delay={25}
            duration={0.5}
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="center"
          />
          <p className="text-[var(--accent)] text-sm md:text-lg px-6">
            {t(
              locale,
              "Recibe promociones exclusivas y ofertas antes que nadie",
              "Receive exclusive promotions and offers before anyone else",
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* ── Columna izquierda: texto + perks ── */}
          <div>
            <p className="text-theme-tittles text-base mb-8 leading-relaxed">
              {t(
                locale,
                "Recibe ofertas anticipadas, itinerarios secretos y alertas de precios antes que nadie.",
                "Get early deals, secret itineraries, and price alerts before anyone else.",
              )}
            </p>

            {/* Perks */}
            <ul className="space-y-3">
              {getPerks(locale).map((perk, idx) => {
                const Icon = perk.icon;
                return (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm text-theme"
                  >
                    <div className="flex-shrink-0 p-1.5 rounded-md bg-[var(--accent)]/10">
                      <Icon className="w-4 h-4 accent" />
                    </div>
                    {perk.label}
                  </li>
                );
              })}
            </ul>

            {/* Social proof */}
            <p className="mt-6 text-xs text-theme-tittles flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 accent" />
              {t(
                locale,
                "+2,800 viajeros ya se suscribieron",
                "+2,800 travelers already subscribed",
              )}
            </p>
          </div>

          {/* ── Columna derecha: formulario ── */}
          <div className="bg-[var(--accent)]/5 border border-[var(--accent)]/15 rounded-2xl p-6 sm:p-8">
            {status === "success" ? (
              /* Estado de éxito */
              <div className="flex flex-col items-center justify-center text-center py-6 gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--accent)]/15 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 accent" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-theme mb-1">
                    {t(locale, "¡Bienvenido a bordo! ✈️", "Welcome aboard! ✈️")}
                  </p>
                  <p className="text-sm text-theme-tittles">
                    {t(
                      locale,
                      "Prepárate para recibir las mejores ofertas en tu correo.",
                      "Get ready to receive the best travel deals in your inbox.",
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-xs underline accent opacity-70 hover:opacity-100 transition-opacity"
                >
                  {t(locale, "Registrar otro correo", "Register another email")}
                </button>
              </div>
            ) : (
              <>
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <input
                    type="text"
                    placeholder={t(locale, "Nombre", "First name")}
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (status === "error") {
                        setStatus("idle");
                        setErrorMsg("");
                      }
                    }}
                    className="input-base p-4 w-full"
                    disabled={status === "loading"}
                  />
                  <input
                    type="text"
                    placeholder={t(locale, "Apellido", "Last name")}
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (status === "error") {
                        setStatus("idle");
                        setErrorMsg("");
                      }
                    }}
                    className="input-base p-4 w-full"
                    disabled={status === "loading"}
                  />
                </div>

                {/* Campo de email */}
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder={t(
                      locale,
                      "Tu correo electrónico",
                      "Your email address",
                    )}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") {
                        setStatus("idle");
                        setErrorMsg("");
                      }
                    }}
                    className="input-base p-4 w-full"
                    disabled={status === "loading"}
                    required
                  />
                </div>

                {/* Checkbox de privacidad */}
                <label className="flex items-start gap-3 cursor-pointer group mb-5">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={(e) => {
                        setPrivacyAccepted(e.target.checked);
                        if (status === "error") {
                          setStatus("idle");
                          setErrorMsg("");
                        }
                      }}
                      className="peer sr-only"
                    />
                    {/* Caja visual del checkbox */}
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
                        ${
                          privacyAccepted
                            ? "bg-[var(--accent)] border-[var(--accent)]"
                            : "bg-transparent border-[var(--accent)]/40 group-hover:border-[var(--accent)]/70"
                        }`}
                    >
                      {privacyAccepted && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 12 12"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2 6l3 3 5-5"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  <span className="text-xs text-theme-tittles leading-relaxed">
                    {t(
                      locale,
                      "He leído y acepto el",
                      "I have read and accept the",
                    )}{" "}
                    <a
                      href={t(
                        locale,
                        "/es/aviso-de-privacidad",
                        "/en/privacy-policy",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="accent underline underline-offset-2 hover:opacity-80 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t(locale, "Aviso de Privacidad", "Privacy Policy")}
                    </a>{" "}
                    {t(locale, "y los", "and the")}{" "}
                    <a
                      href={t(
                        locale,
                        "/es/terminos-y-condiciones",
                        "/en/terms-and-conditions",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="accent underline underline-offset-2 hover:opacity-80 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t(
                        locale,
                        "Términos y Condiciones",
                        "Terms & Conditions",
                      )}
                    </a>
                    .
                  </span>
                </label>

                {/* Mensaje de error */}
                {errorMsg && (
                  <p className="text-xs text-red-400 mb-3 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                    {errorMsg}
                  </p>
                )}

                {/* Botón de suscripción */}
                <button
                  onClick={handleSubscribe}
                  disabled={status === "loading"}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300
                    ${
                      status === "loading"
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:scale-[1.02] active:scale-[0.98]"
                    }
                    bg-[var(--accent)] text-white`}
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      {t(locale, "Registrando...", "Registering...")}
                    </span>
                  ) : (
                    <>
                      {t(locale, "Quiero viajar", "Let's Travel")}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Nota de spam */}
                <p className="text-center text-[10px] text-theme-tittles opacity-60 mt-3">
                  {t(
                    locale,
                    "Sin spam. Cancela cuando quieras.",
                    "No spam. Unsubscribe anytime.",
                  )}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;
