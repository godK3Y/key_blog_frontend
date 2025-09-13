"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AuthService, { type MeResponse } from "@/services/auth.service";

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      const userData = await AuthService.me();
      setUser(userData);
    } catch (error) {
      // User not authenticated
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  // Listen for storage changes (login/logout from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      refreshAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      // Refresh the page to update header
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-primary">KeyBlog</h1>
        </div>

        <nav className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push("/")}>
            Home
          </Button>

          {isLoading ? (
            <div className="w-20 h-8 bg-muted animate-pulse rounded"></div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.email}
              </span>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button onClick={() => router.push("/auth")}>Sign In</Button>
          )}
        </nav>
      </div>
    </header>
  );
}
