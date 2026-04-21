"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User, Phone, Wand2, Loader2, CheckCircle2, XCircle } from "lucide-react";

const signUpSchema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .min(8, "At least 8 characters.")
    .regex(/[A-Z]/, "At least one uppercase letter.")
    .regex(/[a-z]/, "At least one lowercase letter.")
    .regex(/[0-9]/, "At least one number.")
    .regex(/[@$!%*?&#]/, "At least one special character (@$!%*?&#)."),
});

interface SignUpFormProps {
  locale?: "es" | "en";
}

export default function SignUpForm({ locale = "es" }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const t = {
    es: {
      fullName: "Nombre completo",
      email: "Correo electrónico",
      phone: "Teléfono (opcional)",
      password: "Contraseña",
      suggest: "Sugerir",
      signup: "Crear cuenta",
      signingUp: "Creando cuenta...",
      checks: {
        length: "Mínimo 8 caracteres",
        uppercase: "Una mayúscula",
        lowercase: "Una minúscula",
        number: "Un número",
        special: "Un carácter especial (@$!%*?&#)",
      },
      successMsg: "Revisa tu email para confirmar tu cuenta.",
    },
    en: {
      fullName: "Full name",
      email: "Email address",
      phone: "Phone (optional)",
      password: "Password",
      suggest: "Suggest",
      signup: "Create account",
      signingUp: "Creating account...",
      checks: {
        length: "At least 8 characters",
        uppercase: "One uppercase letter",
        lowercase: "One lowercase letter",
        number: "One number",
        special: "One special character (@$!%*?&#)",
      },
      successMsg: "Check your email to confirm your account.",
    },
  }[locale];

  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&#]/.test(password),
  };

  const allValid = Object.values(validations).every(Boolean);

  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "@$!%*?&#";
    const mandatory = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      special[Math.floor(Math.random() * special.length)],
    ];
    const allChars = upper + lower + numbers + special;
    for (let i = 0; i < 8; i++) {
      mandatory.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
    setPassword(mandatory.sort(() => Math.random() - 0.5).join(""));
    setShowPassword(true);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validation = signUpSchema.safeParse({ fullName, email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    alert(t.successMsg);
    router.push("/");
    setLoading(false);
  };

  const inputClass =
    "w-full py-3 rounded-sm border text-sm outline-none transition-all duration-200 bg-transparent";
  const inputStyle = { borderColor: "var(--accent)", color: "var(--text)" };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4 ">
      {/* Full Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--accent)", opacity: 0.8 }}>
          {t.fullName}
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--accent)", opacity: 0.5 }} />
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
            required
            className={`${inputClass} pl-10 pr-4`}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--accent)", opacity: 0.8 }}>
          {t.email}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--accent)", opacity: 0.5 }} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className={`${inputClass} pl-10 pr-4`}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--accent)", opacity: 0.8 }}>
          {t.phone}
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--accent)", opacity: 0.5 }} />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+52 000 000 0000"
            className={`${inputClass} pl-10 pr-4`}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--accent)", opacity: 0.8 }}>
          {t.password}
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--accent)", opacity: 0.5 }} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={`${inputClass} pl-10 pr-10`}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100"
              style={{ color: "var(--accent)", opacity: 0.5 }}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="button"
            onClick={generatePassword}
            title={t.suggest}
            className="px-3 rounded-sm border text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 hover:border-[var(--accent)] whitespace-nowrap"
            style={{ borderColor: "rgba(255,255,255,0.15)", color: "var(--accent)" }}
          >
            <Wand2 className="w-3.5 h-3.5" />
            {t.suggest}
          </button>
        </div>

        {/* Validation checks */}
        {password.length > 0 && (
          <div className="grid grid-cols-1 gap-1 mt-1">
            {(Object.entries(validations) as [keyof typeof validations, boolean][]).map(([key, valid]) => (
              <span
                key={key}
                className="flex items-center gap-1.5 text-xs transition-colors duration-200"
                style={{ color: valid ? "var(--accent)" : "rgba(239,68,68,0.7)" }}
              >
                {valid ? (
                  <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                ) : (
                  <XCircle className="w-3 h-3 flex-shrink-0" />
                )}
                {t.checks[key]}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs px-3 py-2 rounded-sm border border-red-500/30 bg-red-500/10 text-red-400">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !allValid}
        className="w-full py-3 rounded-sm font-semibold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 mt-1"
        style={{
          background: allValid ? "var(--accent)" : "rgba(255,255,255,0.1)",
          color: allValid ? "#000" : "var(--text)",
          opacity: loading ? 0.7 : 1,
          cursor: !allValid ? "not-allowed" : "pointer",
        }}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? t.signingUp : t.signup}
      </button>
    </form>
  );
}