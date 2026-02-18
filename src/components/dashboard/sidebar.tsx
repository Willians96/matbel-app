
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function Sidebar({ userRole }: { userRole: string | null }) {
    const pathname = usePathname();

    const filteredItems = sidebarItems.filter(item => {
        if (!item.role) return true; // Public/Shared items
        return item.role === userRole;
    });

    return (
        <div className="flex bg-pm-blue text-white h-screen flex-col w-64 fixed left-0 top-0">
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold tracking-tight">CPI-7</h1>
                <p className="text-xs text-slate-300 mt-1">Controle de Material Bélico</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-white/10 text-white"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.title}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <p className="text-xs text-center text-slate-500">© 2026 PMESP</p>
            </div>
        </div>
    );
}
