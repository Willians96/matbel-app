import Image from "next/image";
import Logo from "@/components/logo";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DashboardLink } from "@/components/home/dashboard-link";

export default function Home() {
  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-pm-blue font-sans">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8 flex flex-col items-center text-center">

        <div className="mb-6">
          <Logo className="mx-auto" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">CPI-7</h1>
        <h2 className="text-lg text-gray-600 mb-8">Controle de Material Bélico</h2>

        <div className="space-y-4 w-full">
          <SignedOut>
            <Link href="/dashboard" className="w-full">
              <button className="w-full bg-pm-blue text-white font-semibold py-3 px-4 rounded-md hover:bg-[#001a38] transition-colors flex items-center justify-center gap-2">
                Entrar no Sistema
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </SignedOut>

          <SignedIn>
            <DashboardLink />
          </SignedIn>
        </div>

        <div className="mt-8 text-xs text-muted-foreground">
          &copy; 2026 Polícia Militar do Estado de São Paulo
        </div>

      </div>
    </main>
  );
}
