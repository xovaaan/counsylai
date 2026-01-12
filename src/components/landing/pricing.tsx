"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const tiers = [
    {
        name: "Starter",
        price: "$45",
        description: "For individual practitioners and small teams.",
        features: [
            "AI Legal Research",
            "Basic Document Summaries",
            "Limited PDF Analysis",
            "Standard Support",
        ],
        cta: "Start Free Trial",
        highlight: false,
    },
    {
        name: "Professional",
        price: "$99",
        description: "For growing firms needing advanced tools.",
        features: [
            "Full Contract Review",
            "Tabular Comparison",
            "Client & Matter Management",
            "Document Vault (5GB)",
            "Priority Support",
        ],
        cta: "Get Started",
        highlight: true,
    },
    {
        name: "Enterprise",
        price: "$299",
        description: "Complete control for mid-size to large firms.",
        features: [
            "Private AI Instance",
            "Internal Knowledge Base",
            "Full Audit Logs",
            "Custom Compliance Reports",
            "Dedicated Account Manager",
        ],
        cta: "Contact Sales",
        highlight: false,
    },
];

export function Pricing() {
    return (
        <section id="pricing" className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif mb-4">Transparent, seat-based pricing</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Scale your firm's intelligence with flexible plans tailored to your needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tiers.map((tier, index) => (
                        <Card key={index} className={tier.highlight ? "border-primary shadow-xl scale-105 relative z-10" : "border-slate-200"}>
                            {tier.highlight && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                                    Most Popular
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-xl">{tier.name}</CardTitle>
                                <CardDescription>{tier.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6">
                                    <span className="text-4xl font-serif font-bold">{tier.price}</span>
                                    <span className="text-muted-foreground ml-2">/ seat / mo</span>
                                </div>
                                <ul className="space-y-4">
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm">
                                            <Check className="w-4 h-4 text-primary shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant={tier.highlight ? "default" : "outline"}>
                                    {tier.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
