
'use client';

import { useState, useRef, useEffect } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "@/components/logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // close on escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      role="banner"
      aria-label="Main header"
      className="flex h-16 w-full items-center justify-between border-b bg-white px-4 md:px-6 shadow-sm z-20"
    >
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-10 w-10" />
          <span className="hidden sm:inline-block text-lg font-semibold">Matbel</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <nav className="hidden md:flex gap-4 items-center" aria-label="Primary">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--focus-ring)/0.35)] rounded-md px-2 py-1">
                Entrar
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="text-sm font-medium hover:underline flex items-center px-2 py-1 rounded-md">
              Dashboard
            </Link>
            <UserButton />
          </SignedIn>
        </nav>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            ref={btnRef}
            aria-label="Abrir menu"
            aria-expanded={open}
            className="p-2 rounded-md hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--focus-ring)/0.35)]"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav overlay */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          className="absolute right-4 top-16 z-50 w-64 bg-white rounded-lg shadow-md p-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-left w-full text-sm font-medium">Entrar</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-sm font-medium hover:underline">
                Dashboard
              </Link>
              <Link href="/dashboard/equipment" className="text-sm font-medium hover:underline">
                Equipamentos
              </Link>
              <UserButton />
            </SignedIn>
            <button className="mt-2 text-xs text-muted-foreground" onClick={() => setOpen(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
