"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { MdTravelExplore } from "react-icons/md";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Mínimo 8 caracteres")
  .regex(/[A-Z]/, "Una mayúscula")
  .regex(/[a-z]/, "Una minúscula")
  .regex(/[0-9]/, "Un número")
  .regex(/[@$!%*?&#]/, "Un carácter especial (@$!%*?&#)");

interface ResetPasswordPageProps {
  locale?: "es" | "en";
}

export default function ResetPasswordPage({ locale = "es" }: ResetPasswordPageProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();

  const t = {
    es: {
      title: "Nueva contraseña",
      subtitle: "Elige una contraseña segura para tu cuenta.",
      newPassword: "Nueva contraseña",
      confirmPassword: "Confirmar contraseña",
      save: "Guardar contraseña",
      saving: "Guardando...",
      mismatch: "Las contraseñas no coinciden.",
      successTitle: "¡Contraseña actualizada!",
      successMsg: "Ya puedes iniciar sesión con tu nueva contraseña.",
      goLogin: "Ir al inicio de sesión",
      sessionError: "El enlace expiró o ya fue usado. Solicita uno nuevo.",
      checks: {
        length: "Mínimo 8 caracteres",
        uppercase: "Una mayúscula",
        lowercase: "Una minúscula",
        number: "Un número",
        special: "Un carácter especial (@$!%*?&#)",
      },
    },
    en: {
      title: "New password",
      subtitle: "Choose a strong password for your account.",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      save: "Save password",
      saving: "Saving...",
      mismatch: "Passwords don't match.",
      successTitle: "Password updated!",
      successMsg: "You can now sign in with your new password.",
      goLogin: "Go to sign in",
      sessionError: "The link has expired or was already used. Request a new one.",
      checks: {
        length: "At least 8 characters",
        uppercase: "One uppercase letter",
        lowercase: "One lowercase letter",
        number: "One number",
        special: "One special character (@$!%*?&#)",
      },
    },
  }[locale];

  // Supabase envía el token como hash fragment (#access_token=...)
  // onAuthStateChange lo intercepta y establece la sesión automáticamente
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&#]/.test(password),
  };
  const allValid = Object.values(validations).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError(t.mismatch);
      return;
    }

    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setDone(true);
    }
    setLoading(false);
  };

  const loginPath = locale === "es" ? `/${locale}/iniciar-sesion` : `/${locale}/login`;

  return (
    <div className="min-h-screen w-full  flex items-center justify-center p-4">
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        <div className="p-8 md:p-10">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-8">
            <MdTravelExplore className="w-5 h-5" style={{ color: "var(--accent)" }} />
            <span
              className="text-xs tracking-[0.3em] uppercase font-semibold"
              style={{ color: "var(--accent)" }}
            >
              Viaje Soar
            </span>
          </div>

          {!sessionReady ? (
            /* Waiting for Supabase token */
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
              <p className="text-sm" style={{ color: "var(--text)", opacity: 0.6 }}>
                {locale === "es" ? "Verificando enlace..." : "Verifying link..."}
              </p>
              <p className="text-xs mt-2 px-3 py-2 rounded-sm border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
                {t.sessionError}
              </p>
            </div>
          ) : done ? (
            /* Success */
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <CheckCircle2 className="w-12 h-12" style={{ color: "var(--accent)" }} />
              <div>
                <h3 className="text-xl font-bold mb-1" style={{ color: "var(--accent)" }}>
                  {t.successTitle}
                </h3>
                <p className="text-sm" style={{ color: "var(--text)", opacity: 0.6 }}>
                  {t.successMsg}
                </p>
              </div>
              <button
                onClick={() => router.push(loginPath)}
                className="mt-2 w-full py-3 rounded-sm font-semibold text-sm tracking-widest uppercase"
                style={{ background: "var(--accent)", color: "#000" }}
              >
                {t.goLogin}
              </button>
            </div>
          ) : (
            /* Form */
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--accent)" }}>
                  {t.title}
                </h2>
                <p className="text-sm" style={{ color: "var(--text)", opacity: 0.6 }}>
                  {t.subtitle}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* New password */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs uppercase tracking-widest font-semibold"
                    style={{ color: "var(--accent)", opacity: 0.8 }}
                  >
                    {t.newPassword}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--accent)", opacity: 0.5 }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-3 rounded-sm border text-sm outline-none transition-all duration-200 bg-transparent"
                      style={{ borderColor: "var(--accent)", color: "var(--text)" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--accent)", opacity: 0.5 }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Validations */}
                  {password.length > 0 && (
                    <div className="grid grid-cols-1 gap-1 mt-1">
                      {(Object.entries(validations) as [keyof typeof validations, boolean][]).map(
                        ([key, valid]) => (
                          <span
                            key={key}
                            className="flex items-center gap-1.5 text-xs"
                            style={{ color: valid ? "var(--accent)" : "rgba(239,68,68,0.7)" }}
                          >
                            {valid ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {t.checks[key]}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs uppercase tracking-widest font-semibold"
                    style={{ color: "var(--accent)", opacity: 0.8 }}
                  >
                    {t.confirmPassword}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--accent)", opacity: 0.5 }} />
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-3 rounded-sm border text-sm outline-none transition-all duration-200 bg-transparent"
                      style={{
                        borderColor:
                          confirm.length > 0
                            ? password === confirm
                              ? "var(--accent)"
                              : "rgba(239,68,68,0.7)"
                            : "var(--accent)",
                        color: "var(--text)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--accent)", opacity: 0.5 }}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs px-3 py-2 rounded-sm border border-red-500/30 bg-red-500/10 text-red-400">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !allValid || password !== confirm}
                  className="w-full py-3 rounded-sm font-semibold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 mt-1"
                  style={{
                    background: allValid && password === confirm ? "var(--accent)" : "rgba(255,255,255,0.1)",
                    color: allValid && password === confirm ? "#000" : "var(--text)",
                    opacity: loading ? 0.7 : 1,
                    cursor: !allValid || password !== confirm ? "not-allowed" : "pointer",
                  }}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? t.saving : t.save}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}