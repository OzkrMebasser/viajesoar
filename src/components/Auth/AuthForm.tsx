// components/AuthForm.tsx
"use client";

import { useState } from "react";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">
        {isLogin ? "Login" : "Sign Up"}
      </h2>
      {isLogin ? <LoginForm /> : <SignUpForm />}
      <p className="mt-4 text-center text-sm">
        {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 underline"
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}
