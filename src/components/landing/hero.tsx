"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, Scale, Users, Search, BarChart3, Shield } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Now live in Bangladesh
                    </div>

                    <h1 className="text-5xl md:text-7xl font-serif text-primary mb-6 leading-tight max-w-4xl mx-auto">
                        AI Legal Intelligence for Modern Law Firms
                    </h1>

                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                        Research, review, and manage legal work with verified AI.
                        Tailored for common law jurisdictions and Bangladesh regulations.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="h-12 px-8 text-base">
                            Request a Demo
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-white">
                            Watch Video
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mt-20 relative max-w-6xl mx-auto"
                >
                    {/* Professional Dashboard Mockup */}
                    <div className="rounded-xl border border-primary/10 bg-white shadow-2xl overflow-hidden">
                        {/* Dashboard Header */}
                        <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-2xl font-serif font-bold text-[#1a1f2c]">Counsyl</div>
                                <div className="hidden md:flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                                    <Search className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-400">Search cases, contracts...</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-primary">JD</span>
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Content */}
                        <div className="flex">
                            {/* Sidebar */}
                            <div className="hidden md:block w-64 bg-slate-50 border-r border-slate-200 p-4">
                                <nav className="space-y-1">
                                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white">
                                        <BarChart3 className="w-4 h-4" />
                                        <span className="text-sm font-medium">Overview</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-white transition-colors">
                                        <Search className="w-4 h-4" />
                                        <span className="text-sm">Research</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-white transition-colors">
                                        <Scale className="w-4 h-4" />
                                        <span className="text-sm">Contracts</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-white transition-colors">
                                        <Users className="w-4 h-4" />
                                        <span className="text-sm">Clients</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-white transition-colors">
                                        <FileText className="w-4 h-4" />
                                        <span className="text-sm">Documents</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-white transition-colors">
                                        <Shield className="w-4 h-4" />
                                        <span className="text-sm">Audit Logs</span>
                                    </div>
                                </nav>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 p-6 md:p-8 bg-white min-h-[600px]">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-serif font-semibold text-primary mb-2">Welcome back, John</h2>
                                    <p className="text-sm text-slate-500">Here's what's happening with your firm today</p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-100">
                                        <div className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-wide">Active Matters</div>
                                        <div className="text-3xl font-bold text-blue-900">24</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-100">
                                        <div className="text-xs text-green-600 font-medium mb-1 uppercase tracking-wide">Contracts Reviewed</div>
                                        <div className="text-3xl font-bold text-green-900">156</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-100">
                                        <div className="text-xs text-purple-600 font-medium mb-1 uppercase tracking-wide">Research Queries</div>
                                        <div className="text-3xl font-bold text-purple-900">89</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-5 border border-amber-100">
                                        <div className="text-xs text-amber-600 font-medium mb-1 uppercase tracking-wide">Time Saved</div>
                                        <div className="text-3xl font-bold text-amber-900">42h</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Main Chart Area */}
                                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="font-semibold text-slate-800">Research Activity</h3>
                                            <div className="flex gap-2 text-xs">
                                                <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">Weekly</span>
                                                <span className="px-2 py-1 hover:bg-slate-50 rounded text-slate-400">Monthly</span>
                                            </div>
                                        </div>

                                        {/* CSS Bar Chart */}
                                        <div className="flex items-end justify-between h-48 gap-2">
                                            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                                    <div className="relative w-full bg-slate-50 rounded-t-lg h-full flex items-end overflow-hidden group-hover:bg-slate-100 transition-colors">
                                                        <div
                                                            className="w-full bg-gradient-to-t from-primary/80 to-primary/60 rounded-t-lg transition-all duration-500 hover:opacity-90"
                                                            style={{ height: `${h}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-slate-400 font-medium">
                                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Activity List */}
                                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col">
                                        <h3 className="font-semibold text-slate-800 mb-5">Recent Actions</h3>
                                        <div className="space-y-4 flex-1">
                                            {[
                                                { color: "bg-emerald-500", text: "Contract analysis completed", time: "2m ago" },
                                                { color: "bg-blue-500", text: "Research: Bangladesh Labor Law", time: "15m ago" },
                                                { color: "bg-purple-500", text: "New client matter created", time: "1h ago" },
                                                { color: "bg-amber-500", text: "Compliance alert detected", time: "3h ago" },
                                                { color: "bg-slate-500", text: "Document shared with client", time: "5h ago" }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-start gap-3 text-sm">
                                                    <div className={`w-2 h-2 rounded-full ${item.color} mt-1.5 shrink-0`}></div>
                                                    <div className="flex-1">
                                                        <p className="text-slate-700 font-medium leading-none mb-1">{item.text}</p>
                                                        <p className="text-xs text-slate-400">{item.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full mt-4 py-2 text-xs font-medium text-primary bg-white border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors">
                                            View All Activity
                                        </button>
                                    </div>
                                </div>

                                {/* Bottom Table Preview */}
                                <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                        <h3 className="font-semibold text-slate-800 text-sm">Recent Documents</h3>
                                        <span className="text-xs text-primary font-medium cursor-pointer">Browse Vault</span>
                                    </div>
                                    <div className="p-2">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">Non-Disclosure Agreement_v{i}.pdf</p>
                                                        <p className="text-xs text-slate-400">Updated {i} days ago • 2.4 MB</p>
                                                    </div>
                                                </div>
                                                <div className="text-xs px-2 py-1 rounded bg-green-50 text-green-600 font-medium">
                                                    Analyzed
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subtle glow */}
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/2 rounded-full blur-3xl"></div>
                </motion.div>
            </div>

            {/* Background patterns */}
            <div className="absolute top-0 left-0 w-full h-full -z-20 pointer-events-none opacity-[0.03]">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#0F172A 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>
        </section>
    );
}
