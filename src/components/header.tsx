
'use client';

import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Menu } from "lucide-react";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-white/10 px-4 md:px-6 bg-pm-blue text-white shadow-lg sticky top-0 z-50 transition-all duration-200">
      <Link className="flex items-center gap-3 hover:opacity-90 transition-opacity" href="/">
        <div className="bg-white/10 p-1.5 rounded-full border border-white/20">
          {/* Placeholder for PMESP Logo - Using Shield Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.352-.272-2.636-.759-3.807a.75.75 0 00-.722-.515 11.209 11.209 0 01-7.877-3.08zM12 4.04c2.115.547 4.062 1.54 5.75 2.868-.696.536-1.55 1.15-2.607 1.83-2.164 1.4-4.8 1.956-6.143.916 2.454.49 4.316.63 5.342.175-.436-.459-1.018-1.09-1.597-1.748-1.127-1.278-2.18-2.47-3.253-2.47-1.073 0-2.126 1.192-3.253 2.47-.58.658-1.16 1.289-1.597 1.748 1.026.455 2.888.315 5.342-.175-1.343 1.04-3.979.484-6.143-.916-1.057-.68-1.911-1.294-2.607-1.83A9.72 9.72 0 0112 4.04z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="font-bold text-lg tracking-wide">RESERVA DE ARMAS CPI-7</span>
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
