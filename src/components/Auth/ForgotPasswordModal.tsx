"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, X, Loader2, CheckCircle2 } from "lucide-react";

interface ForgotPasswordModalProps {
  locale?: "es" | "en";
  onClose: () => void;
}

export default function ForgotPasswordModal({
  locale = "es",
  onClose,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    es: {
      title: "Restablecer contraseña",
      subtitle: "Te enviaremos un enlace para crear una nueva contraseña.",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "you@example.com",
      send: "Enviar enlace",
      sending: "Enviando...",
      successTitle: "¡Enlace enviado!",
      successMsg: "Revisa tu bandeja de entrada y sigue las instrucciones.",
      backToLogin: "Volver al inicio de sesión",
      error: "No encontramos ninguna cuenta con ese correo.",
    },
    en: {
      title: "Reset password",
      subtitle: "We'll send you a link to create a new password.",
      emailLabel: "Email address",
      emailPlaceholder: "you@example.com",
      send: "Send link",
      sending: "Sending...",
      successTitle: "Link sent!",
      successMsg: "Check your inbox and follow the instructions.",
      backToLogin: "Back to sign in",
      error: "No account found with that email.",
    },
  }[locale];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/${locale}/reset-password`
        : `https://viajesoar.vercel.app/${locale}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setError(t.error);
    } else {
      setSent(true);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-(--accent)/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-md pointer-events-auto rounded-2xl overflow-hidden bg-gradient-theme border border-(--accent)/40 shadow-lg"
          // style={{
          //   background: "rgba(255,255,255,0.08)",
          //   backdropFilter: "blur(20px)",
          //   WebkitBackdropFilter: "blur(20px)",
          //   border: "1px solid rgba(255,255,255,0.12)",
          //   boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)",
          // }}
        >
          {/* shimmer */}
         <div className="pointer-events-none absolute inset-y-0 w-[60%] -skew-x-12 -left-[120%] animate-[shimmer_3s_ease_infinite] bg-[linear-gradient(90deg,transparent,var(--accent),transparent)]" />
       
          <div className="relative p-8">
            {/* Close */}
            <button
              title="Close modal"
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full transition-opacity hover:opacity-100 text-(--accent) opacity-50"
              // style={{ color: "", opacity: 0.5 }}
            >
              <X className="w-5 h-5" />
            </button>

            {!sent ? (
              <>
                {/* Header */}
                <div className="mb-6">
                  <h3
                    className="text-2xl font-bold mb-1"
                    style={{ color: "var(--accent)" }}
                  >
                    {t.title}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text)", opacity: 0.6 }}
                  >
                    {t.subtitle}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs uppercase tracking-widest font-semibold"
                      style={{ color: "var(--accent)", opacity: 0.8 }}
                    >
                      {t.emailLabel}
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: "var(--accent)", opacity: 0.5 }}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.emailPlaceholder}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-sm border text-sm outline-none transition-all duration-200 bg-transparent"
                        style={{
                          borderColor: "var(--accent)",
                          color: "var(--text)",
                        }}
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs px-3 py-2 rounded-sm border border-red-500/30 bg-red-500/10 text-red-400">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-sm font-semibold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      background: "var(--accent)",
                      color: "#000",
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? t.sending : t.send}
                  </button>
                </form>
              </>
            ) : (
              /* Success state */
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <CheckCircle2
                  className="w-12 h-12"
                  style={{ color: "var(--accent)" }}
                />
                <div>
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{ color: "var(--accent)" }}
                  >
                    {t.successTitle}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text)", opacity: 0.6 }}
                  >
                    {t.successMsg}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-2 text-xs uppercase tracking-widest underline underline-offset-2"
                  style={{ color: "var(--accent)", opacity: 0.7 }}
                >
                  {t.backToLogin}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
