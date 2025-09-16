"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AuthService, { type MeResponse } from "@/services/auth.service";
import { ModeToggle } from "@/components/ui/mode-toggle";

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
    <header className="border-b border-border/40 bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-6xl">
        <div className="flex items-center">
          <h1
            className="text-2xl font-bold text-foreground tracking-tight cursor-pointer"
            onClick={() => router.push("/")}
          >
            KeyBlog
          </h1>
        </div>

        <nav className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => router.push("/")}
          >
            Home
          </Button>

          {isLoading ? (
            <div className="w-16 h-8 bg-muted animate-pulse rounded"></div>
          ) : user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => router.push("/dashboard")}
              >
                Write
              </Button>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button
                  size="sm"
                  className="rounded-full px-4"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => router.push("/dashboard")}
              >
                Write
              </Button>
              <Button
                size="sm"
                className="rounded-full px-4"
                onClick={() => router.push("/auth")}
              >
                Sign In
              </Button>
            </>
          )}
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
