"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import AuthService from "@/services/auth.service";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await AuthService.login({ email, password });
      if (result?.success) {
        // Refresh the page to update header with user info
        window.location.reload();
        // Then navigate to the intended destination
        setTimeout(() => {
          const redirect = searchParams.get("redirect") || "/dashboard";
          router.push(redirect);
        }, 100);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      await AuthService.register({ email, password, name });
      console.log("Registered successfully");
      // After registration, switch to login form
      setIsLogin(true);
    } catch (err) {
      console.error("Register failed", err);
      throw err;
    }
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
