
import { UserButton } from "@clerk/nextjs";
import { MobileNav } from "./mobile-nav";

interface DashboardHeaderProps {
    userRole: string | null;
    pendingCount?: number;
}

export function DashboardHeader({ userRole, pendingCount }: DashboardHeaderProps) {
    return (
        <div role="region" aria-label="Dashboard header" className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10 w-full">
            <div className="flex items-center gap-4">
                <MobileNav userRole={userRole} pendingCount={pendingCount} />
                <div className="text-sm text-muted-foreground hidden md:block">
                    Bem-vindo ao Sistema
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="bg-slate-100 rounded-full px-3 py-1 text-xs font-medium text-slate-600">
                    v1.0.0
                </div>
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    );
}
