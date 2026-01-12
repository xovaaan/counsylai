"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-primary/5 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#1a1f2c] flex items-center justify-center shadow-md">
                        <span className="text-white font-serif font-bold italic text-xl">C</span>
                    </div>
                    <span className="text-2xl font-serif font-bold tracking-tight text-[#1a1f2c]">Counsyl</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="/features" className="hover:text-primary transition-colors">Features</Link>
                    <Link href="/solutions" className="hover:text-primary transition-colors">Solutions</Link>
                    <Link href="/security" className="hover:text-primary transition-colors">Security</Link>
                    <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/sign-in">
                        <Button variant="ghost" size="sm">Log in</Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
