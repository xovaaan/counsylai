"use client";

import Image from "next/image";
import { LucideIcon, Scale, FileSearch, TableProperties, Users, Lock, History } from "lucide-react";

interface FeatureProps {
    title: string;
    description: string;
    icon: LucideIcon;
    image: string;
}

function Feature({ title, description, icon: Icon, image }: FeatureProps) {
    return (
        <div className="rounded-xl border border-primary/5 bg-white hover:border-primary/20 transition-all group overflow-hidden h-96">
            {/* Icon at top */}
            <div className="p-6 pb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
            </div>

            {/* Text */}
            <div className="px-6 pb-4">
                <h3 className="text-xl font-serif font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                    {description}
                </p>
            </div>

            {/* Full-width image at bottom */}
            <div className="relative w-full h-48">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>
        </div>
    );
}

export function Features() {
    const features = [
        {
            title: "AI Legal Research",
            description: "Ask complex legal questions and get answers with verified citations from Bangladesh statutes and common law case files.",
            icon: FileSearch,
            image: "/legal-research.png",
        },
        {
            title: "Contract Intelligence",
            description: "Upload any contract (PDF/DOCX) and our AI will instantly highlight risks, missing clauses, and unusual terms.",
            icon: Scale,
            image: "/contract-review.png",
        },
        {
            title: "Comparative Analysis",
            description: "Compare multiple contracts side-by-side in a clean, Counsyl-style table. Auto-detect differences in clauses.",
            icon: TableProperties,
            image: "/tabular-comparison.png",
        },
        {
            title: "Client & Matter Management",
            description: "Keep all client communications and documents organized in a single, secure vault with AI search.",
            icon: Users,
            image: "/client-management.png",
        },
        {
            title: "Document Vault",
            description: "Secure, encrypted storage for all your firm's sensitive materials with advanced search and organization.",
            icon: Lock,
            image: "/document-vault.png",
        },
        {
            title: "Enterprise Security",
            description: "Your data is never used to train global models. Row-level isolation and full audit logs for compliance.",
            icon: History,
            image: "/audit-logs.png",
        },
    ];

    return (
        <section id="features" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif mb-4">Everything your firm needs</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        A comprehensive operating system designed for the specific needs of modern law firms.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Feature key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}
