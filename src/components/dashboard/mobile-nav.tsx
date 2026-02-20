
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SignOutButton } from "@clerk/nextjs";
import { sidebarItems } from "./sidebar";

interface MobileNavProps {
    userRole: string | null;
    pendingCount?: number;
}

export function MobileNav({ userRole, pendingCount = 0 }: MobileNavProps) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close on navigation
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // Prevent body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    const filteredItems = sidebarItems.filter(item => {
        if (!item.role) return true;
        return item.role === userRole;
    });

    return (
        <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Abrir Menu" className="text-white hover:bg-white/10 hover:text-white">
                <Menu className="w-6 h-6" />
            </Button>

            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40"
                            onClick={() => setOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-64 bg-pm-blue text-white z-50 flex flex-col shadow-xl"
                        >
                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <div>
                                    <h2 className="font-bold text-lg">Menu</h2>
                                    <p className="text-xs text-slate-300">Navegação</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-white hover:bg-white/10">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
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
                                    );
                                })}
                            </nav>

                            <div className="p-4 border-t border-white/10">
                                <SignOutButton>
                                    <button className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-md transition-colors">
                                        <LogOut className="h-5 w-5" />
                                        Sair do Sistema
                                    </button>
                                </SignOutButton>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
