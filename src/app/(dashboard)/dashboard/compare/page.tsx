"use client";

import { useState } from "react";
import { Upload, Plus, FileText, ArrowRight, Download, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ComparisonRow {
    clause: string;
    contractA: string;
    contractB: string;
    riskA: "high" | "medium" | "low" | "none";
    riskB: "high" | "medium" | "low" | "none";
}

export default function ComparisonPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [isComparing, setIsComparing] = useState(false);
    const [comparisonData, setComparisonData] = useState<ComparisonRow[] | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles((prev) => [...prev, ...selectedFiles].slice(0, 2)); // Limit to 2 for now
    };

    const startComparison = () => {
        setIsComparing(true);
        setTimeout(() => {
            setComparisonData([
                {
                    clause: "Limitation of Liability",
                    contractA: "Capped at 100% of fees paid in last 12 months.",
                    contractB: "Capped at $50,000 across all claims.",
                    riskA: "low",
                    riskB: "medium",
                },
                {
                    clause: "Governing Law",
                    contractA: "Laws of Bangladesh, Jurisdiction of Dhaka Courts.",
                    contractB: "Laws of Singapore, CIAC Arbitration.",
                    riskA: "none",
                    riskB: "low",
                },
                {
                    clause: "Data Protection",
                    contractA: "Standard GDPR-compliant clauses with DPA included.",
                    contractB: "General reference to 'applicable laws' only. No DPA.",
                    riskA: "none",
                    riskB: "high",
                },
                {
                    clause: "Termination",
                    contractA: "30 days notice for convenience for either party.",
                    contractB: "90 days notice for Client; Provider cannot terminate for convenience.",
                    riskA: "low",
                    riskB: "none",
                },
                {
                    clause: "Intellectual Property",
                    contractA: "Work-for-hire; all IP belongs to Client.",
                    contractB: "Provider retains IP; Client gets non-exclusive license.",
                    riskA: "none",
                    riskB: "medium",
                },
            ]);
            setIsComparing(false);
        }, 2500);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setComparisonData(null);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Clause Comparison</h1>
                    <p className="text-muted-foreground">Side-by-side analysis of multiple contracts for risk and deviation detection.</p>
                </div>
                {comparisonData && (
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export to DOCX
                    </Button>
                )}
            </div>

            {!comparisonData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[0, 1].map((i) => (
                        <Card key={i} className={cn(
                            "border-dashed border-2 border-slate-200 bg-white/50 h-64 flex flex-col items-center justify-center text-center",
                            files[i] && "border-solid border-primary/20 bg-white"
                        )}>
                            {files[i] ? (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                        <FileText className="w-8 h-8 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">{files[i].name}</h3>
                                        <p className="text-xs text-muted-foreground">{(files[i].size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => removeFile(i)}>Remove</Button>
                                </div>
                            ) : (
                                <div className="relative cursor-pointer group">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileUpload}
                                    />
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto group-hover:bg-primary/5 transition-colors">
                                        <Plus className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <p className="mt-4 text-sm font-medium text-slate-500">Upload Contract {i + 1}</p>
                                </div>
                            )}
                        </Card>
                    ))}
                    <div className="md:col-span-2 flex justify-center mt-4">
                        <Button
                            size="lg"
                            className="px-12"
                            disabled={files.length < 2 || isComparing}
                            onClick={startComparison}
                        >
                            <Scale className="w-4 h-4 mr-2" />
                            {isComparing ? "Analyzing Clause-by-Clause..." : "Compare Contracts"}
                        </Button>
                    </div>
                </div>
            ) : (
                <Card className="border-slate-200 overflow-hidden shadow-xl animate-in slide-in-from-bottom-4 duration-1000">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider w-[20%]">Clause Topic</th>
                                    <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider w-[40%] border-l border-slate-200">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            {files[0]?.name || "Contract A"}
                                        </div>
                                    </th>
                                    <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider w-[40%] border-l border-slate-200">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            {files[1]?.name || "Contract B"}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {comparisonData.map((row, i) => (
                                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 text-sm font-bold text-primary align-top">
                                            {row.clause}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 align-top border-l border-slate-100 space-y-3">
                                            <p>{row.contractA}</p>
                                            {row.riskA !== "none" && (
                                                <Badge variant={row.riskA === "high" ? "destructive" : row.riskA === "medium" ? "warning" : "info"} className="uppercase text-[9px] px-1.5 py-0">
                                                    {row.riskA} risk
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 align-top border-l border-slate-100 space-y-3">
                                            <p>{row.contractB}</p>
                                            {row.riskB !== "none" && (
                                                <Badge variant={row.riskB === "high" ? "destructive" : row.riskB === "medium" ? "warning" : "info"} className="uppercase text-[9px] px-1.5 py-0">
                                                    {row.riskB} risk
                                                </Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                        <Button variant="ghost" size="sm" onClick={() => setComparisonData(null)}>
                            Start Over
                        </Button>
                        <Button size="sm">
                            Generate Comparison Summary
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
}
