"use client";

import { useState } from "react";
import { Search, Send, FileText, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { saveResearchQuery } from "@/lib/actions";
import { RichTextRenderer, GeminiLoader } from "@/components/research/research-ui";

interface Source {
    title: string;
    link: string;
    snippet: string;
}

export default function ResearchPage() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState<string | null>(null);
    const [sources, setSources] = useState<Source[]>([]);
    const [jurisdiction, setJurisdiction] = useState("Bangladesh");
    const { user } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setAnswer(null);
        setSources([]);

        try {
            const res = await fetch("/api/ai/research", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, jurisdiction }),
            });

            const data = await res.json();

            if (data.error) {
                setAnswer(`Error: ${data.details || data.error}`);
                return;
            }

            setAnswer(data.answer);
            setSources(data.sources || []);

            // Save to database if user is logged in
            if (user) {
                await saveResearchQuery({
                    userId: user.id,
                    organizationId: user.organizationMemberships?.[0]?.organization?.id,
                    query: query,
                    jurisdiction,
                    answer: data.answer,
                    sources: data.sources,
                });
            }
        } catch (error: any) {
            console.error("Research failed:", error);
            setAnswer(`Failed to fetch research: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-32">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent inline-flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-blue-500" />
                        Legal Research AI
                    </h1>
                    <p className="text-muted-foreground mt-1">Advanced analysis of Bangladesh & International Law</p>
                </div>
                <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                    {["Bangladesh", "Common Law"].map((j) => (
                        <button
                            key={j}
                            onClick={() => setJurisdiction(j)}
                            className={cn(
                                "px-4 py-2 text-xs font-semibold rounded-md transition-all duration-300",
                                jurisdiction === j
                                    ? "bg-white shadow-sm text-primary ring-1 ring-black/5"
                                    : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            {j}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[400px]">
                {!answer && !loading && (
                    <div className="flex flex-col items-center justify-center pt-24 text-center space-y-6">
                        <div className="relative group cursor-default">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                            <div className="relative w-20 h-20 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                                <Search className="w-8 h-8 text-primary/30" />
                            </div>
                        </div>
                        <div className="max-w-md space-y-2">
                            <h2 className="text-xl font-medium text-slate-900">What would you like to know?</h2>
                            <p className="text-sm text-slate-500">
                                Ask complex legal questions about statutes, case precedents, or regulatory compliance.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 w-full max-w-lg mt-8">
                            {["Limitation period for land disputes?", "Formation requirements for a Pvt Ltd?", "Grounds for divorce under Muslim Family Laws?", "VAT registration threshold 2024"].map((q, i) => (
                                <button key={i} onClick={() => { setQuery(q); }} className="text-xs text-left p-3 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 text-slate-600 transition-colors">
                                    "{q}"
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {loading && <GeminiLoader />}

                {answer && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-100 shadow-sm p-6 md:p-8">
                            {/* Accents */}
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Sparkles className="w-24 h-24" />
                            </div>

                            <div className="relative z-10">
                                <RichTextRenderer content={answer} sources={sources} />
                            </div>

                            <div className="mt-8 flex gap-3 text-xs text-slate-400 border-t border-slate-100 pt-4">
                                <div className="flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                                    <span>AI Reviewed</span>
                                </div>
                                <span>•</span>
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        {sources.length > 0 && (
                            <div className="pt-4">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    Cited Precedents & Statutes
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {sources.map((s, i) => (
                                        <a
                                            key={i}
                                            href={s.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block"
                                        >
                                            <Card className="h-full border border-slate-100 shadow-none bg-white hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold">
                                                                {i + 1}
                                                            </span>
                                                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{s.title}</h4>
                                                        </div>
                                                        <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
                                                    </div>
                                                    <p className="text-[11px] leading-relaxed text-slate-500 line-clamp-2 pl-7">
                                                        {s.snippet}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-40">
                <form onSubmit={handleSubmit} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask anything about the law..."
                        className="pl-5 pr-14 h-14 rounded-2xl border-slate-200/80 shadow-2xl shadow-slate-200/50 bg-white/90 backdrop-blur-xl focus-visible:ring-blue-500/20 text-base placeholder:text-slate-400"
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className={cn(
                            "absolute right-2 top-2 h-10 w-10 rounded-xl transition-all duration-300",
                            query.trim() ? "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        )}
                        disabled={loading || !query.trim()}
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                    <div className="absolute -bottom-6 left-0 w-full text-center">
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">Gemini 2.5 Flash • Serper Real-time Search</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
