
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Header() {
    return (
        <header className="flex h-16 w-full items-center justify-between border-b px-4 md:px-6">
            <Link className="flex items-center gap-2 font-bold" href="/">
                <span>Matbel</span>
            </Link>
            <nav className="flex gap-4">
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="text-sm font-medium hover:underline">
                            Entrar
                        </button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <Link href="/dashboard" className="text-sm font-medium hover:underline flex items-center">
                        Dashboard
                    </Link>
                    <UserButton />
                </SignedIn>
            </nav>
        </header>
    );
}
