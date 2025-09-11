"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { z } from "zod";

const signUpSchema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string()
    .min(8, "At least 8 characters.")
    .regex(/[A-Z]/, "At least one uppercase letter.")
    .regex(/[a-z]/, "At least one lowercase letter.")
    .regex(/[0-9]/, "At least one number.")
    .regex(/[@$!%*?&#]/, "At least one special character (@$!%*?&#)."),
});

const DEFAULT_AVATAR = "https://images.pexels.com/photos/9951800/pexels-photo-9951800.jpeg";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // Password validation checks
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
    const remainingLength = 12 - mandatory.length;

    for (let i = 0; i < remainingLength; i++) {
      mandatory.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    const shuffled = mandatory.sort(() => Math.random() - 0.5).join("");
    setPassword(shuffled);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    // Validar datos
    const validation = signUpSchema.safeParse({ fullName, email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setLoading(false);
      return;
    }

    // Crear usuario - el trigger creará automáticamente el perfil
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: fullName,
          phone: phone 
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Ya no necesitamos crear el perfil manualmente - el trigger lo hace automáticamente
    alert("Check your email to confirm your account before logging in. You can upload your avatar after logging in.");
    router.push("/");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 rounded"
      />

      <div className="flex gap-2">
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        <button
          type="button"
          onClick={generatePassword}
          className="bg-gray-200 px-3 rounded hover:bg-gray-300"
        >
          Suggest
        </button>
      </div>

      {/* Password requirements */}
      <div className="text-sm space-y-1">
        <p className={validations.length ? "text-green-600" : "text-red-500"}>
          • At least 8 characters
        </p>
        <p className={validations.uppercase ? "text-green-600" : "text-red-500"}>
          • At least one uppercase letter
        </p>
        <p className={validations.lowercase ? "text-green-600" : "text-red-500"}>
          • At least one lowercase letter
        </p>
        <p className={validations.number ? "text-green-600" : "text-red-500"}>
          • At least one number
        </p>
        <p className={validations.special ? "text-green-600" : "text-red-500"}>
          • At least one special character (@$!%*?&#)
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`py-2 rounded text-white ${
          allValid
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}