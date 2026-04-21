"use client";

import { useState } from "react";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import { MdTravelExplore } from "react-icons/md";
import type { Locale } from "@/types/locale";



export default function AuthForm({ locale  }: { locale?: Locale }) {
  const [isLogin, setIsLogin] = useState(true);

  const t = {
    es: {
      loginTitle: "Bienvenido de vuelta",
      loginSub: "Continúa tu aventura",
      signupTitle: "Únete a nosotros",
      signupSub: "Comienza a explorar el mundo",
      switchToSignup: "¿No tienes cuenta?",
      switchToLogin: "¿Ya tienes cuenta?",
      signupCta: "Crear cuenta",
      loginCta: "Iniciar sesión",
      loginImage: "https://images.pexels.com/photos/1122639/pexels-photo-1122639.jpeg",
      signupImage: "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg",
      tagline: "Explora el mundo con nosotros",
    },
    en: {
      loginTitle: "Welcome back",
      loginSub: "Continue your adventure",
      signupTitle: "Join us",
      signupSub: "Start exploring the world",
      switchToSignup: "Don't have an account?",
      switchToLogin: "Already have an account?",
      signupCta: "Create account",
      loginCta: "Sign in",
      loginImage: "https://images.pexels.com/photos/1122639/pexels-photo-1122639.jpeg",
      signupImage: "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg",
      tagline: "Explore the world with us",
    },
  }[locale || "es"];

  return (
    <div className="bg-gradient-theme min-h-screen w-full flex items-center justify-center lg:py-36 lg:px-54">

      {/* ── MOBILE: stacked panels, no unified shell ── */}
      <div className="w-full max-w-md flex flex-col lg:hidden ">
        <div className="relative h-56 overflow-hidden rounded-t-2xl flex-shrink-0">
          <img
            src={isLogin ? t.loginImage : t.signupImage}
            alt="travel"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.7)" }}
          />
          <div className="absolute inset-0 " />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="flex items-center gap-2 mb-2">
              <MdTravelExplore className="text-[var(--accent)] w-5 h-5" />
              <span className="text-[var(--accent)] text-xs tracking-[0.3em] uppercase font-semibold">
                Viaje Soar
              </span>
            </div>
            <p className="text-white text-xl font-bold leading-tight drop-shadow-lg">{t.tagline}</p>
            <div className="w-10 h-0.5 mt-3 rounded-full" style={{ background: "var(--accent)" }} />
          </div>
        </div>

        <div className="glass-card rounded-b-2xl px-8 py-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1 text-(--accent) " >
              {isLogin ? t.loginTitle : t.signupTitle}
            </h2>
            <p className="text-sm" style={{ color: "var(--text)", opacity: 0.6 }}>
              {isLogin ? t.loginSub : t.signupSub}
            </p>
          </div>
          {isLogin ? <LoginForm locale={locale} /> : <SignUpForm locale={locale} />}
          <p className="mt-6 text-sm text-center" style={{ color: "var(--text)", opacity: 0.6 }}>
            {isLogin ? t.switchToSignup : t.switchToLogin}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold underline underline-offset-2 hover:opacity-100"
              style={{ color: "var(--accent)", opacity: 0.85 }}
            >
              {isLogin ? t.signupCta : t.loginCta}
            </button>
          </p>
        </div>
      </div>

      {/* ── DESKTOP: single unified card — hover acts on the whole piece ── */}
      {/* 'group' lets the shimmer inside react to hover on the outer wrapper */}
      <div
        className="group bg-gradient-theme
          hidden lg:grid lg:grid-cols-2
          w-full  rounded-2xl overflow-hidden
          shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_0_0_1px_rgba(255,255,255,0.05)]
          hover:shadow-[0_12px_40px_rgba(0,0,0,0.45),0_0_25px_var(--accent)]
          hover:scale-[1.012]
          transition-all duration-500 ease-in-out 
        "
       
      >
        {/* Image column */}
        <div
          className="relative"
          style={{ order: isLogin ? 0 : 1 }}
        >
          <img
            key={isLogin ? "login-img" : "signup-img"}
            src={isLogin ? t.loginImage : t.signupImage}
            alt="travel"
            className="w-full h-full object-cover transition-all duration-700"
            style={{ filter: "brightness(0.7)" }}
          />
          <div className="absolute inset-0  " />
          <div className="absolute inset-0 flex flex-col justify-center p-12">
            <div className="flex items-center gap-2 mb-3">
              <MdTravelExplore className="text-[var(--accent)] w-6 h-6" />
              <span className="text-[var(--accent)] text-xs tracking-[0.3em] uppercase font-semibold">
                Viaje Soar
              </span>
            </div>
            <p className="text-white text-3xl font-bold leading-tight drop-shadow-lg">{t.tagline}</p>
            <div className="w-12 h-0.5 mt-4 rounded-full" style={{ background: "var(--accent)" }} />
          </div>
        </div>

        {/* Form column — glass-card styles inlined; shimmer triggered by group hover on wrapper */}
        <div
          className="relative flex flex-col justify-center px-12 py-12 overflow-hidden "
          style={{
            order: isLogin ? 1 : 0,
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderLeft: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {/* ✨ shimmer sweep — mirrors glass-card::after, triggered by group hover */}
          <span
            aria-hidden
            className=" 
              pointer-events-none absolute inset-y-0 w-[60%] -skew-x-12
              -left-[120%] group-hover:left-[140%]
              transition-[left] duration-[800ms] ease-in-out
            "
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.082), transparent)",
            }}
          />

          <div className="mb-8 bg-relative bg-gre ">
            <h2 className="text-3xl font-bold mb-1 text-(--accent)" >
              {isLogin ? t.loginTitle : t.signupTitle}
            </h2>
            <p className="text-sm" style={{ color: "var(--text)", opacity: 0.6 }}>
              {isLogin ? t.loginSub : t.signupSub}
            </p>
          </div>
          {isLogin ? <LoginForm locale={locale} /> : <SignUpForm locale={locale} />}
          <p className="mt-6 text-sm text-center" style={{ color: "var(--text)", opacity: 0.6 }}>
            {isLogin ? t.switchToSignup : t.switchToLogin}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold underline underline-offset-2 hover:opacity-100"
              style={{ color: "var(--accent)", opacity: 0.85 }}
            >
              {isLogin ? t.signupCta : t.loginCta}
            </button>
          </p>
        </div>
      </div>

    </div>
  );
}