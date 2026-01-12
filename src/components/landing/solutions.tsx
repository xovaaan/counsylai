"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const solutions = [
    {
        title: "AI Legal Research",
        description: "Get instant answers with verified citations from Bangladesh law and common law databases.",
        image: "/legal-research.png",
        span: "md:col-span-2 md:row-span-2",
    },
    {
        title: "Contract Intelligence",
        description: "Automatically detect risks, missing clauses, and unusual terms in seconds.",
        image: "/contract-review.png",
        span: "md:col-span-1 md:row-span-1",
    },
    {
        title: "Tabular Comparison",
        description: "Compare contracts clause-by-clause in a clean, organized table.",
        image: "/tabular-comparison.png",
        span: "md:col-span-1 md:row-span-1",
    },
    {
        title: "Client Management",
        description: "Track clients, matters, and deadlines in one centralized CRM.",
        image: "/client-management.png",
        span: "md:col-span-1 md:row-span-1",
    },
    {
        title: "Document Vault",
        description: "Secure, encrypted storage for all your firm's sensitive materials.",
        image: "/document-vault.png",
        span: "md:col-span-1 md:row-span-1",
    },
    {
        title: "Audit Logs",
        description: "Complete activity trail for compliance and security monitoring.",
        image: "/audit-logs.png",
        span: "md:col-span-2 md:row-span-1",
    },
];

export function Solutions() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                        One Platform, Complete Solutions
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Everything your law firm needs to work faster, smarter, and more securely.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {solutions.map((solution, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`${solution.span} group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-primary/20 transition-all shadow-sm hover:shadow-xl h-64`}
                        >
                            {/* Full background image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={solution.image}
                                    alt={solution.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Gradient overlay for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            </div>

                            {/* Text overlay at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                                <h3 className="text-xl font-serif font-semibold mb-2">
                                    {solution.title}
                                </h3>
                                <p className="text-sm text-white/90 leading-relaxed">
                                    {solution.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
