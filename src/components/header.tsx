
'use client';

import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Menu } from "lucide-react";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-white/10 px-4 md:px-6 bg-pm-blue text-white shadow-lg sticky top-0 z-50 transition-all duration-200">
      <Link className="flex items-center gap-2 font-bold hover:text-blue-100 transition-colors" href="/">
        <span>Matbel CPI-7</span>
      </Link>

      <nav className="hidden md:flex gap-4 items-center">
        <SignedOut>
          <SignedOut>
            <Link href="/dashboard" className="text-sm font-medium text-blue-100 hover:text-white hover:underline transition-colors">
              Entrar
            </Link>
          </SignedOut>
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard" className="text-sm font-medium text-blue-100 hover:text-white hover:underline flex items-center transition-colors">
            Dashboard
          </Link>
          <div className="bg-white/10 p-1 rounded-full">
            <UserButton appearance={{
              elements: { userButtonAvatarBox: "w-8 h-8" }
            }} />
          </div>
        </SignedIn>
      </nav>

      {/* Mobile menu toggle */}
      <div className="md:hidden">
        <button
          aria-label="Abrir menu"
          className="p-2 rounded-md hover:bg-white/10 text-white"
          onClick={() => setOpen((v) => !v)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile nav overlay */}
      {open && (
        <div className="absolute right-4 top-16 z-50 w-64 bg-white rounded-lg shadow-md p-4 md:hidden">
          <div className="flex flex-col gap-3">
            <SignedOut>
              <SignedOut>
                <Link href="/dashboard" className="text-left w-full text-sm font-medium">
                  Entrar
                </Link>
              </SignedOut>
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
