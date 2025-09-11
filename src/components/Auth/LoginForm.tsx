"use client";

import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// Definir el esquema de validación con Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un email válido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validar los datos con Zod
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      // Mostrar el primer error encontrado
      setError(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    // Si la validación pasa, proceder con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.user) {
      // Login exitoso - redirigir a la página principal
      router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) setError(error.message);
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="flex items-center gap-2">
        <hr className="flex-1 border-gray-300" />
        <span className="text-sm text-gray-500">or</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 border p-2 rounded hover:bg-gray-100"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>
    </div>
  );
}