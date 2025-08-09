"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Actualiza la tabla profiles después del login
  const updateProfile = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("❌ Error al obtener usuario:", error);
      return;
    }

    const { full_name, name, avatar_url, email } = user.user_metadata;

    const { error: updateError } = await supabase.from("profiles").upsert({
      id: user.id,
      email: email,
      username: full_name || name || "Usuario",
      avatar_url: avatar_url || "https://example.com/default-avatar.png"
    }, { onConflict: "id" });

    if (updateError) {
      console.error("❌ Error actualizando perfil:", updateError);
    } else {
      console.log("✅ Perfil actualizado");
    }
  };

  // 🔐 Login con email y contraseña
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    await updateProfile();
    router.push("/");
    setLoading(false);
  };

  // 🔐 Login con Google
  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Espera a que se complete el login
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          await updateProfile();
          router.push("/");
          subscription?.unsubscribe();
        }
      }
    );
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow rounded-lg mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Inicia sesión</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-2">O ingresa con</p>
        <button
          onClick={handleGoogle}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Google
        </button>
      </div>
    </div>
  );
}
