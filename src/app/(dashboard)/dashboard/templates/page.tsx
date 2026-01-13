"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout, Plus, FileText, Eye } from "lucide-react";
import { getContractTemplates } from "@/lib/actions/contract-actions";
import Link from "next/link";

const CONTRACT_TYPES = [
    { type: "NDA", icon: "🔒", description: "Non-Disclosure Agreement" },
    { type: "Employment", icon: "👔", description: "Employment Contract" },
    { type: "Service Agreement", icon: "🤝", description: "Service Agreement" },
    { type: "Lease", icon: "🏢", description: "Lease Agreement" },
    { type: "Partnership", icon: "🤝", description: "Partnership Agreement" },
    { type: "Consulting", icon: "💼", description: "Consulting Agreement" },
];

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        setLoading(true);
        const result = await getContractTemplates();
        if (result.success) {
            setTemplates(result.data || []);
        }
        setLoading(false);
    };

    const getTemplatesByType = (type: string) => {
        return templates.filter((t) => t.type === type);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-primary">Contract Templates</h1>
                <p className="text-muted-foreground underline underline-offset-4 decoration-primary/10">
                    Pre-built contract templates ready for customization
                </p>
            </div>

            {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading templates...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CONTRACT_TYPES.map((contractType) => {
                        const typeTemplates = getTemplatesByType(contractType.type);
                        return (
                            <Card
                                key={contractType.type}
                                className="border-slate-200 hover:shadow-lg transition-all hover:border-primary/30"
                            >
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="text-3xl">{contractType.icon}</div>
                                        <div>
                                            <CardTitle className="text-lg">{contractType.type}</CardTitle>
                                            <CardDescription className="text-xs">
                                                {contractType.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="w-fit">
                                        {typeTemplates.length} template{typeTemplates.length !== 1 ? "s" : ""}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {typeTemplates.length > 0 ? (
                                        <>
                                            {typeTemplates.slice(0, 2).map((template) => (
                                                <div
                                                    key={template.id}
                                                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm"
                                                >
                                                    <p className="font-medium text-slate-700">{template.name}</p>
                                                    {template.description && (
                                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                            {template.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                            {typeTemplates.length > 2 && (
                                                <p className="text-xs text-muted-foreground text-center">
                                                    +{typeTemplates.length - 2} more
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-4">
                                            No templates yet
                                        </p>
                                    )}

                                    <Link href={`/dashboard/generate?type=${contractType.type}`}>
                                        <Button className="w-full mt-2" variant="outline">
                                            <FileText className="w-4 h-4 mr-2" />
                                            Generate {contractType.type}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Info Card */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Layout className="w-5 h-5" />
                        How Contract Templates Work
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-700">
                    <p>
                        <strong>1. Select a template type</strong> - Choose from NDA, Employment, Service Agreement,
                        and more
                    </p>
                    <p>
                        <strong>2. Fill in variables</strong> - Provide party names, dates, amounts, and other details
                    </p>
                    <p>
                        <strong>3. AI customization</strong> - Get AI suggestions for additional clauses and
                        improvements
                    </p>
                    <p>
                        <strong>4. Export or save</strong> - Download as PDF/DOCX or save as draft for later
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
