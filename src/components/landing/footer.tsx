import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-12 border-t border-slate-200 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 z-10 relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-black to-slate-800 flex items-center justify-center shadow-md">
                                <span className="text-white font-sans font-bold text-lg">C</span>
                            </div>
                            <span className="text-xl font-sans font-bold tracking-tight bg-gradient-to-r from-black to-slate-700 bg-clip-text text-transparent">Counsyl</span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Building the future of legal intelligence for firms in Bangladesh and beyond.
                        </p>
                    </div>

                    <div className="flex gap-12">
                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Product</h4>
                            <Link href="#" className="text-sm hover:text-primary transition-colors">Research</Link>
                            <Link href="#" className="text-sm hover:text-primary transition-colors">Contracts</Link>
                            <Link href="#" className="text-sm hover:text-primary transition-colors">Security</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Legal</h4>
                            <Link href="#" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link>
                            <Link href="#" className="text-sm hover:text-primary transition-colors">Terms of Service</Link>
                            <Link href="#" className="text-sm hover:text-primary transition-colors">Cookie Policy</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Company</h4>
                            <Link href="#" className="text-sm hover:text-primary transition-colors">About</Link>
                            <Link href="#" className="text-sm hover:text-primary transition-colors">Contact</Link>
                            <Link href="#" className="text-sm hover:text-primary transition-colors">LinkedIn</Link>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        © 2026 Counsyl AI. All rights reserved. Registered in Bangladesh.
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                        Disclaimer: Counsyl is an AI tool and not a substitute for professional legal advice.
                    </p>
                </div>
            </div>

            {/* Mega Text Background */}
            <div className="w-full flex justify-center items-end opacity-5 pointer-events-none select-none mt-10">
                <h1 className="text-[15vw] leading-none font-black text-transparent bg-clip-text bg-gradient-to-t from-black to-slate-400 tracking-tighter">
                    COUNSYL
                </h1>
            </div>
        </footer>
    );
}
