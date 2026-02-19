"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, Package, Shield, FileText, Settings } from "lucide-react";

// Duplicated from Sidebar to ensure consistency, ideally should be shared in a config file
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
        role: "admin",
    },
    {
        title: "Configurações",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function MobileNavigation({ userRole, pendingCount = 0 }: { userRole: string | null, pendingCount?: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const filteredItems = sidebarItems.filter(item => {
        if (!item.role) return true;
        return item.role === userRole;
    });

    return (
        <div className="md:hidden mr-4">
            {/* Toggle Button - Flow layout */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="text-slate-600 hover:bg-slate-100 -ml-2"
            >
                <Menu className="h-6 w-6" />
            </Button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 animate-in fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Drawer */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-pm-blue text-white shadow-xl transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h1 className="text-xl font-bold">CPI-7</h1>
                        <p className="text-xs text-slate-300">MatBel Mobile</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 hover:text-white">
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {filteredItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        const showBadge = item.href === "/dashboard/admin/declarations" && pendingCount > 0;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)} // Close on navigate
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
                                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {pendingCount}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    );
}
