"use client";

import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import ForgotPasswordModal from "./ForgotPasswordModal";

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un email válido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

interface LoginFormProps {
  locale?: "es" | "en";
}

export default function LoginForm({ locale = "es" }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const router = useRouter();

  const t = {
    es: {
      email: "Correo electrónico",
      password: "Contraseña",
      login: "Iniciar sesión",
      logging: "Entrando...",
      or: "o continúa con",
      google: "Continuar con Google",
      forgot: "¿Olvidaste tu contraseña?",
    },
    en: {
      email: "Email address",
      password: "Password",
      login: "Sign in",
      logging: "Signing in...",
      or: "or continue with",
      google: "Continue with Google",
      forgot: "Forgot your password?",
    },
  }[locale];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.user) {
      router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}` },
    });
    if (error) setError(error.message);
  };

  return (
    <>
      {showForgot && (
        <ForgotPasswordModal
          locale={locale}
          onClose={() => setShowForgot(false)}
        />
      )}

      <div className="flex flex-col gap-5   ">
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: "var(--accent)", opacity: 0.8 }}
            >
              {t.email}
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
                placeholder="you@example.com"
                required
                className="
  w-full pl-10 pr-4 py-3 text-sm rounded
  bg-transparent border border-[var(--border)]
  text-[var(--text)] outline-none appearance-none
  transition-colors duration-150

  placeholder:text-[color-mix(in_srgb,var(--text)_25%,transparent)]

  hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]
  focus:border-[var(--accent)]
  [&:not(:placeholder-shown)]:border-[color-mix(in_srgb,var(--accent)_20%,transparent)]

  [&:-webkit-autofill]:[-webkit-text-fill-color:var(--text)]
  [&:-webkit-autofill]:shadow-[0_0_0px_9999px_var(--bg)_inset]
  "
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: "var(--accent)", opacity: 0.8 }}
              >
                {t.password}
              </label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-xs underline underline-offset-2 transition-opacity hover:opacity-100"
                style={{ color: "var(--accent)", opacity: 0.55 }}
              >
                {t.forgot}
              </button>
            </div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--accent)", opacity: 0.5 }}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-3 text-sm rounded bg-transparent border border-[var(--border)]
                text-[var(--text)] outline-none appearance-none transition-colors duration-150 placeholder:text-[color-mix(in_srgb,var(--text)_25%,transparent)]
                hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]
                focus:border-[var(--accent)]
                [&:not(:placeholder-shown)]:border-[color-mix(in_srgb,var(--accent)_20%,transparent)]

  [&:-webkit-autofill]:[-webkit-text-fill-color:var(--text)]
  [&:-webkit-autofill]:shadow-[0_0_0px_9999px_var(--bg)_inset]
  "
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100"
                style={{ color: "var(--accent)", opacity: 0.5 }}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
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
            disabled={loading}
            className="bg-(--accent) text-theme-btn w-full py-3 rounded-sm font-semibold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 mt-1"
            style={{
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? t.logging : t.login}
          </button>
        </form>

        <div className="flex items-center gap-3 ">
          <hr className="flex-1 border-white/10" />
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--text)", opacity: 0.4 }}
          >
            {t.or}
          </span>
          <hr className="flex-1 border-white/10" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-sm text-sm font-medium text-[var(--text)] bg-transparent border border-[color-mix(in_srgb,var(--accent)_20%,transparent)] transition-all duration-200 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-0"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          {t.google}
        </button>
      </div>
    </>
  );
}
