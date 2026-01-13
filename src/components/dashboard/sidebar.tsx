"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Search,
    FileText,
    Scale,
    Users,
    FolderOpen,
    History,
    Settings,
    LayoutDashboard,
    MessageSquare,
    Table,
    BookOpen,
    Layout,
    FileEdit
} from "lucide-react";

const sidebarItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Research", href: "/dashboard/research", icon: Search },
    { name: "Review", href: "/dashboard/review", icon: Table },
    { name: "Chat with Docs", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Contracts", href: "/dashboard/contracts", icon: FileText },
    { name: "Clause Library", href: "/dashboard/clause-library", icon: BookOpen },
    { name: "Templates", href: "/dashboard/templates", icon: Layout },
    { name: "Generate", href: "/dashboard/generate", icon: FileEdit },
    { name: "Compare", href: "/dashboard/compare", icon: Scale },
    { name: "Clients", href: "/dashboard/clients", icon: Users },
    { name: "Documents", href: "/dashboard/documents", icon: FolderOpen },
    { name: "Audit Logs", href: "/dashboard/logs", icon: History },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { useState, useEffect } from "react";

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Load collapse state from local storage
    useEffect(() => {
        const saved = localStorage.getItem("sidebar-collapsed");
        if (saved !== null) setIsCollapsed(saved === "true");
    }, []);

    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem("sidebar-collapsed", String(newState));
    };

    return (
        <>
            {/* Mobile Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="bg-white shadow-md border-slate-200"
                >
                    <Menu className="w-5 h-5 text-slate-600" />
                </Button>
            </div>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <div
                className={cn(
                    "fixed lg:sticky top-0 left-0 h-screen border-r border-slate-200 bg-white flex flex-col transition-all duration-300 z-40",
                    isCollapsed ? "w-[72px]" : "w-64",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    className
                )}
            >
                <div className={cn(
                    "p-6 border-b border-slate-100 flex items-center h-20 shrink-0",
                    isCollapsed ? "justify-center px-2" : "justify-between"
                )}>
                    {(!isCollapsed || isMobileOpen) ? (
                        <div className="flex items-center gap-2 overflow-hidden">
                            <div className="min-w-[32px] w-8 h-8 rounded-lg bg-[#1a1f2c] flex items-center justify-center text-white shadow-sm shrink-0">
                                <span className="font-serif font-bold italic text-lg leading-none">C</span>
                            </div>
                            <span className="text-xl font-serif font-bold tracking-tight text-[#1a1f2c] whitespace-nowrap">Counsyl</span>
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#1a1f2c] flex items-center justify-center text-white shadow-sm">
                            <span className="font-serif font-bold italic text-xl leading-none">C</span>
                        </div>
                    )}

                    <button
                        onClick={toggleCollapse}
                        className="hidden lg:flex absolute -right-3 top-20 bg-white border border-slate-200 rounded-full w-6 h-6 items-center justify-center hover:bg-slate-50 shadow-sm text-slate-400 hover:text-primary transition-colors"
                    >
                        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                    </button>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                title={isCollapsed ? item.name : ""}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-slate-100 text-primary"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-primary",
                                    isCollapsed && !isMobileOpen && "justify-center px-0 h-10 w-10 mx-auto"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5 shrink-0 transition-colors",
                                    isActive ? "text-primary" : "text-slate-400 group-hover:text-primary"
                                )} />
                                {(!isCollapsed || isMobileOpen) && (
                                    <span className="whitespace-nowrap overflow-hidden transition-all duration-300">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 pb-8">
                    {(!isCollapsed || isMobileOpen) ? (
                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Server Status</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="h-1.5 bg-slate-200 rounded-full w-full overflow-hidden">
                                    <div className="h-full bg-primary w-2/3" />
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                                    <span>Cloud Storage</span>
                                    <span>67%</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
