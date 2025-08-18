"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormState {
  email: string;
  password: string;
}

export default function SignUpForm() {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;

      // opcional: confirmar que recibieron email de verificación
      alert("Revisa tu correo para confirmar tu cuenta.");
      router.push("/login"); // redirige después de registrarse
    } catch (err: any) {
      setErrorMsg(err.message || "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Crear cuenta</h2>
      <form onSubmit={handleSignUp} className="space-y-4">
        <Input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />
        {errorMsg && (
          <p className="text-red-500 text-sm text-center">{errorMsg}</p>
        )}
        <Button
          type="submit"
          className="w-full rounded-xl"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </Button>
      </form>
    </div>
  );
}
