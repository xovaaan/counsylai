"use client";

import { useState } from "react";
import { Upload, FileText, AlertTriangle, CheckCircle2, Info, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Risk {
    clause: string;
    risk: string;
    severity: "high" | "medium" | "low";
    recommendation: string;
}

import { analyzeContractAction } from "@/lib/document-actions";

export default function ContractReviewPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<{
        risks: Risk[];
        missingClauses: string[];
        summary: string;
    } | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    };

    const startAnalysis = async () => {
        if (!file) return;
        setIsAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const result = await analyzeContractAction(formData);

            if (result.success && result.analysis) {
                setResults({
                    summary: result.analysis.summary,
                    risks: result.analysis.risks,
                    missingClauses: result.analysis.missingClauses,
                });
            } else {
                setError(result.error || "Analysis failed");
            }
        } catch (e: any) {
            console.error("Analysis error:", e);
            setError(e.message || "An unexpected error occurred");
        } finally {
            setIsAnalyzing(false);
        }
    };


    const reset = () => {
        setFile(null);
        setResults(null);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-primary">Contract Intelligence</h1>
                <p className="text-muted-foreground underline underline-offset-4 decoration-primary/10">Upload any legal document to identify risks and missing protections.</p>
            </div>

            {!results ? (
                <Card className="border-dashed border-2 border-slate-200 bg-white/50 py-20">
                    <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
                        {!file ? (
                            <>
                                <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center">
                                    <Upload className="w-10 h-10 text-primary/40" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif font-semibold mb-2">Upload Contract</h3>
                                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                        Drag and drop your PDF or DOCX file here, or click to browse.
                                    </p>
                                </div>
                                <div className="relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileUpload}
                                        accept=".pdf,.docx,.xlsx,.xls"
                                    />
                                    <Button variant="outline">Select File</Button>
                                </div>
                                {error && (
                                    <div className="flex items-center gap-2 text-destructive text-sm mt-4 bg-destructive/5 px-4 py-2 rounded-lg border border-destructive/10">
                                        <AlertTriangle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                    <FileText className="w-10 h-10 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif font-semibold mb-1">{file.name}</h3>
                                    <p className="text-muted-foreground text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="ghost" onClick={reset}>
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button onClick={startAnalysis} disabled={isAnalyzing}>
                                        {isAnalyzing ? "Analyzing..." : "Start Analysis"}
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-50">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    Risk Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100">
                                    {results.risks.map((risk, i) => (
                                        <div key={i} className="p-6 space-y-3 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-sm">{risk.clause}</span>
                                                <Badge
                                                    variant={
                                                        risk.severity === "high" ? "destructive" :
                                                            risk.severity === "medium" ? "warning" : "info"
                                                    }
                                                    className="uppercase text-[10px]"
                                                >
                                                    {risk.severity} Risk
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-600">{risk.risk}</p>
                                            <div className="flex items-start gap-2 p-3 bg-white border border-slate-100 rounded-lg text-xs">
                                                <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5" />
                                                <div>
                                                    <span className="font-bold text-blue-700">Recommendation:</span>
                                                    <span className="ml-1 text-slate-500">{risk.recommendation}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    Missing Clauses
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {results.missingClauses.map((clause, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                            {clause}
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full mt-6" variant="outline" size="sm">
                                    Generate Missing Clauses
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 bg-primary shadow-sm text-primary-foreground">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">AI Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed opacity-90">
                                    {results.summary}
                                </p>
                                <Button className="w-full mt-6 bg-white text-primary hover:bg-slate-100" size="sm" onClick={reset}>
                                    Upload New Document
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
