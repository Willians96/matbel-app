
'use client';

import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Menu } from "lucide-react";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-16 w-full items-center justify-between border-b px-4 md:px-6">
      <Link className="flex items-center gap-2 font-bold" href="/">
        <span>Matbel</span>
      </Link>

      <nav className="hidden md:flex gap-4 items-center">
        <SignedOut>
          <SignedOut>
            <Link href="/dashboard" className="text-sm font-medium hover:underline">
              Entrar
            </Link>
          </SignedOut>
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard" className="text-sm font-medium hover:underline flex items-center">
            Dashboard
          </Link>
          <UserButton />
        </SignedIn>
      </nav>

      {/* Mobile menu toggle */}
      <div className="md:hidden">
        <button
          aria-label="Abrir menu"
          className="p-2 rounded-md hover:bg-slate-100"
          onClick={() => setOpen((v) => !v)}
        >
          <Menu className="w-5 h-5" />
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
