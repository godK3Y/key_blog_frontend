"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-primary">BlogSpace</h1>
        </div>

        <nav className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push("/")}>
            Home
          </Button>

          <Button onClick={() => router.push("/auth")}>Sign In</Button>
        </nav>
      </div>
    </header>
  );
}
