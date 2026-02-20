
import { UserButton } from "@clerk/nextjs";
import { MobileNav } from "./mobile-nav";

interface DashboardHeaderProps {
    userRole: string | null;
    pendingCount?: number;
}

export function DashboardHeader({ userRole, pendingCount }: DashboardHeaderProps) {
    return (
        <div role="region" aria-label="Dashboard header" className="h-16 border-b border-white/10 bg-pm-blue flex items-center justify-between px-6 sticky top-0 z-10 w-full shadow-md">
            <div className="flex items-center gap-4">
                <MobileNav userRole={userRole} pendingCount={pendingCount} />
                <div className="text-sm font-medium hidden md:block text-slate-100">
                    Bem-vindo ao Sistema
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="bg-white/10 rounded-full px-3 py-1 text-xs font-medium text-slate-200 border border-white/10">
                    v1.0.0
                </div>
                <UserButton afterSignOutUrl="/" appearance={{
                    elements: {
                        userButtonAvatarBox: "ring-2 ring-white/20 hover:ring-white/40 transition-all"
                    }
                }} />
            </div>
        </div>
    );
}
