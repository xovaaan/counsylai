"use client";

import { motion } from "framer-motion";
import { Clock, AlertTriangle, Puzzle, FileSearch, Users, ShieldAlert } from "lucide-react";

const problems = [
    {
        title: "Hours Lost in Manual Research",
        description: "Legal teams spend countless hours searching through statutes, case law, and regulations. Traditional research methods are slow, inefficient, and prone to missing critical precedents.",
        icon: Clock,
        gradient: "from-blue-100 to-blue-900",
    },
    {
        title: "Hidden Contract Risks Go Unnoticed",
        description: "Critical risks and unfavorable clauses often slip through manual review. Without AI assistance, identifying liability caps, indemnification issues, and unusual terms requires extensive time and expertise.",
        icon: AlertTriangle,
        gradient: "from-rose-100 to-rose-900",
    },
    {
        title: "Knowledge Scattered Across Systems",
        description: "Firm expertise is trapped in emails, individual files, and people's memories. There's no centralized way to leverage past work, leading to repeated research and inconsistent advice.",
        icon: Puzzle,
        gradient: "from-purple-100 to-purple-900",
    },
    {
        title: "Contract Comparison Takes Days",
        description: "Comparing multiple agreements clause-by-clause is tedious and error-prone. Manual comparison spreadsheets are time-consuming to create and difficult to maintain.",
        icon: FileSearch,
        gradient: "from-amber-100 to-amber-900",
    },
    {
        title: "Client Matters Become Overwhelming",
        description: "Tracking multiple clients, matters, deadlines, and documents across different tools creates chaos. Important details fall through the cracks, risking client relationships and outcomes.",
        icon: Users,
        gradient: "from-teal-100 to-teal-900",
    },
    {
        title: "Compliance Audits Are Nightmares",
        description: "Without proper activity logs and audit trails, demonstrating compliance is nearly impossible. Firms struggle to track who accessed what, when, and why—creating serious liability risks.",
        icon: ShieldAlert,
        gradient: "from-indigo-100 to-indigo-900",
    },
];

export function Problems() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                        The Challenges Law Firms Face Today
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Modern legal practice demands speed and accuracy, but traditional methods hold firms back.
                    </p>
                </div>

                <div className="space-y-12 max-w-6xl mx-auto">
                    {problems.map((problem, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                } gap-8 items-center`}
                        >
                            {/* Content */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center">
                                        <problem.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-serif font-semibold text-primary">
                                        {problem.title}
                                    </h3>
                                </div>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    {problem.description}
                                </p>
                            </div>

                            {/* Gradient Image Placeholder */}
                            <div className="flex-1 w-full">
                                <div
                                    className={`w-full h-64 rounded-2xl bg-gradient-to-br ${problem.gradient} shadow-2xl flex items-center justify-center relative overflow-hidden`}
                                >
                                    <div className="absolute inset-0 bg-black/5"></div>
                                    <problem.icon className="w-24 h-24 text-white/20" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
