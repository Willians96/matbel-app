
import { UserButton } from "@clerk/nextjs";

export function DashboardHeader({ children }: { children?: React.ReactNode }) {
    return (
        <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10 w-full">
            <div className="flex items-center">
                {children}
                <div className="text-sm text-muted-foreground hidden md:block">
                    Bem-vindo ao Sistema
                </div>
                <div className="text-sm text-muted-foreground md:hidden font-semibold">
                    MatBel Mobile
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="bg-slate-100 rounded-full px-3 py-1 text-xs font-medium text-slate-600 hidden sm:block">
                    v1.0.0
                </div>
                <UserButton afterSignOutUrl="/" />
            </div>
        </header>
    );
}
