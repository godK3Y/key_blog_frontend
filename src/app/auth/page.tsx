"use client";

import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async (email: string, password: string) => {
    // TODO: Replace with your API call
    console.log("Login:", { email, password });
    // Example: await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  };

  const handleRegister = async (
    email: string,
    password: string,
    name: string
  ) => {
    // TODO: Replace with your API call
    console.log("Register:", { email, password, name });
    // Example: await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm
            onToggleMode={() => setIsLogin(false)}
            onSubmit={handleLogin}
          />
        ) : (
          <RegisterForm
            onToggleMode={() => setIsLogin(true)}
            onSubmit={handleRegister}
          />
        )}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Ready for your API integration</p>
        </div>
      </div>
    </div>
  );
}
