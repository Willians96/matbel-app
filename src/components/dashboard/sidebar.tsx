
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    Settings,
    Shield,
    LogOut,
    FileText
} from "lucide-react";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Equipamentos",
        href: "/dashboard/equipment",
        icon: Package,
    },
    {
        title: "Solicitações",
        href: "/dashboard/admin/declarations",
        icon: FileText,
        role: "admin",
    },
    {
        title: "Unidades",
        href: "/dashboard/units",
        icon: Shield,
        role: "admin", // Future proofing
    },
    {
        title: "Configurações",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function Sidebar({ userRole, pendingCount = 0 }: { userRole: string | null, pendingCount?: number }) {
    const pathname = usePathname();

    const filteredItems = sidebarItems.filter(item => {
        if (!item.role) return true; // Public/Shared items
        return item.role === userRole;
    });

    return (
        <div className="hidden md:flex bg-pm-blue text-white h-screen flex-col w-64 fixed left-0 top-0" role="complementary" aria-label="Sidebar">
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold tracking-tight">CPI-7</h1>
                <p className="text-xs text-slate-300 mt-1">Controle de Material Bélico</p>
            </div>

            <nav className="flex-1 p-4 space-y-2" role="navigation" aria-label="Sidebar navigation">
                {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    const showBadge = item.href === "/dashboard/admin/declarations" && pendingCount > 0;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-white/10 text-white"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="h-5 w-5" />
                                {item.title}
                            </div>
                            {showBadge && (
                                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                    {pendingCount}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4">
                <SignOutButton>
                    <button className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white rounded-md transition-colors">
                        <LogOut className="h-5 w-5" />
                        Sair
                    </button>
                </SignOutButton>
            </div>

            <div className="p-4 border-t border-white/10">
                <p className="text-xs text-center text-white/70">© 2026 PMESP</p>
            </div>
        </div>
    );
}
