"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, FileText, Send, Paperclip, Bot, User as UserIcon, Loader2, Globe, File, X, Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { uploadAndExtract, chatWithDocumentAction } from "@/lib/document-actions";
import { cn } from "@/lib/utils";
import Script from "next/script";

export default function DocumentChatPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [docText, setDocText] = useState<string>("");
    const [docName, setDocName] = useState<string>("");
    const [pdfPreview, setPdfPreview] = useState<string | null>(null);
    const [pdfLibReady, setPdfLibReady] = useState(false);

    // Chat State
    const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string, sources?: any[] }[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [useWebSearch, setUseWebSearch] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [documentId, setDocumentId] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const loadChatHistory = async (sId: string) => {
        const historyAction = await import("@/lib/document-actions").then(m => m.getChatHistory);
        const res = await historyAction(sId);
        if (res.success && res.messages) {
            setMessages(res.messages);
        }
    };

    const generatePdfPreview = async (file: File) => {
        if (!pdfLibReady || typeof (window as any).pdfjsLib === 'undefined') {
            console.warn("pdfjsLib not ready for preview generation.");
            return;
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await (window as any).pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1);

            const scale = 1.5;
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (context) {
                await page.render({ canvasContext: context, viewport }).promise;
                setPdfPreview(canvas.toDataURL());
            }
        } catch (e) {
            console.error("PDF Preview generation failed", e);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.size > 10 * 1024 * 1024) {
            alert("File size exceeds 10MB limit.");
            return;
        }

        setFile(selectedFile);
        setIsProcessing(true);
        setDocName(selectedFile.name);
        setMessages([]);

        // Generate Preview if PDF
        if (selectedFile.type === "application/pdf") {
            generatePdfPreview(selectedFile);
        } else {
            setPdfPreview(null);
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await uploadAndExtract(formData);
        if (res.success && res.textContent) {
            setDocText(res.textContent);
            setDocumentId(res.documentId || null);

            // Get or create session
            if (res.documentId) {
                const sessionAction = await import("@/lib/document-actions").then(m => m.getOrCreateChatSession);
                const sessionRes = await sessionAction(res.documentId);
                if (sessionRes.success) {
                    setSessionId(sessionRes.sessionId || null);
                    // Load existing history if any
                    if (sessionRes.sessionId) {
                        await loadChatHistory(sessionRes.sessionId);
                    }
                }
            }

            if (messages.length === 0) {
                setMessages([{ role: 'model', content: `I've analyzed **${selectedFile.name}**. What would you like to know?` }]);
            }
        } else {
            alert(res.error || "Failed to read document.");
            setFile(null);
            setPdfPreview(null);
        }
        setIsProcessing(false);
    };

    const handleSend = async () => {
        if (!input.trim() || !docText) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        const res = await chatWithDocumentAction(docText, messages, userMsg, useWebSearch, documentId || undefined, sessionId || undefined);

        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'model', content: res.response, sources: res.sources }]);
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-6 p-4">
            {/* Sidebar / Document View */}
            <div className={`w-full md:w-80 flex-shrink-0 flex flex-col gap-4 transition-all duration-300 ${!docText ? 'flex-1 items-center justify-center' : ''}`}>
                {!docText ? (
                    <div className="w-full max-w-md border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center p-10 text-center hover:bg-slate-100 transition-colors cursor-pointer relative group">
                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700">Upload Document</h3>
                        <p className="text-sm text-slate-500 mt-2">PDF, DOCX, or TXT to start chatting</p>
                        <input
                            type="file"
                            accept=".pdf,.txt"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileUpload}
                        />
                    </div>
                ) : (
                    <Card className="h-full border-slate-200 shadow-sm flex flex-col overflow-hidden bg-white">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-semibold text-slate-700 flex items-center gap-2 truncate">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="truncate">{docName}</span>
                            </h3>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => { setDocText(""); setFile(null); setMessages([]); setPdfPreview(null); }}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex-1 bg-slate-100 p-4 flex items-center justify-center overflow-hidden relative">
                            {pdfPreview ? (
                                <div className="shadow-lg rounded-lg overflow-hidden border border-slate-200 max-h-full max-w-full">
                                    <img src={pdfPreview} alt="PDF Preview" className="object-contain max-h-[60vh] w-auto bg-white" />
                                </div>
                            ) : (
                                <FileText className="w-24 h-24 text-slate-300" />
                            )}
                        </div>
                    </Card>
                )}
            </div>

            {/* Chat Area */}
            {docText && (
                <Card className="flex-1 border-slate-200 shadow-sm flex flex-col overflow-hidden bg-white relative">
                    {/* Header */}
                    <div className="absolute top-4 right-4 z-10">
                        {/* You could put header actions here */}
                    </div>

                    <ScrollArea className="flex-1 p-4 md:p-8">
                        <div className="max-w-3xl mx-auto space-y-8 pb-4">
                            {messages.map((m, i) => (
                                <div key={i} className={cn("flex gap-4", m.role === 'user' ? "flex-row-reverse" : "")}>
                                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm", m.role === 'user' ? "bg-slate-900 text-white" : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white")}>
                                        {m.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                    </div>
                                    <div className={cn("flex flex-col gap-2 max-w-[80%]", m.role === 'user' ? "items-end" : "items-start")}>
                                        <div className={cn("rounded-2xl px-5 py-3 text-[15px] leading-relaxed shadow-sm", m.role === 'user' ? "bg-slate-100 text-slate-800 rounded-tr-sm" : "bg-white border border-slate-100 text-slate-800 rounded-tl-sm")}>
                                            <div dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>') }} />
                                        </div>

                                        {/* Sources Display */}
                                        {m.sources && m.sources.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {m.sources.map((source: any, idx: number) => (
                                                    <a key={idx} href={source.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1 pr-4 hover:bg-slate-100 transition-colors group">
                                                        <div className="w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                                            {/* Fallback to globe if favicon fails (img error handling omitted for brevity, usually assumes it works or shows broken img) */}
                                                            <img src={source.favicon} alt="" className="w-4 h-4 object-contain opacity-80 group-hover:opacity-100" onError={(e) => e.currentTarget.style.display = 'none'} />
                                                            <Globe className="w-3 h-3 text-slate-400 absolute hidden group-hover:block" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-medium text-slate-700 truncate max-w-[150px]">{source.title}</span>
                                                            <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{new URL(source.link).hostname}</span>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                                        <Sparkles className="w-4 h-4 animate-pulse" />
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef}></div>
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-100">
                        <div className="max-w-3xl mx-auto space-y-3">
                            {/* Search Toggle */}
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={useWebSearch}
                                        onCheckedChange={setUseWebSearch}
                                        className="data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-slate-100 data-[state=checked]:to-slate-400 border border-slate-300 shadow-inner"
                                    />
                                    <span className={cn("text-xs font-medium flex items-center gap-1", useWebSearch ? "text-blue-600" : "text-slate-400")}>
                                        <Globe className="w-3 h-3" />
                                        {useWebSearch ? "Web Search Active" : "Web Search Off"}
                                    </span>
                                </div>
                                {isProcessing && <span className="text-xs text-slate-400 animate-pulse">Processing document...</span>}
                            </div>

                            {/* Modern Input Bar */}
                            <div className="relative group">
                                <div className="p-[1px] rounded-full bg-gradient-to-r from-slate-200 to-slate-200 group-focus-within:from-blue-500 group-focus-within:to-purple-500 transition-all duration-300">
                                    <div className="relative flex items-center bg-white rounded-full px-2">
                                        <Button size="icon" variant="ghost" className="rounded-full text-slate-400 hover:text-slate-600">
                                            <Paperclip className="w-5 h-5" />
                                        </Button>
                                        <Input
                                            className="border-0 shadow-none focus-visible:ring-0 bg-transparent py-6 text-base"
                                            placeholder="Ask anything about your document..."
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                            disabled={isProcessing || isTyping}
                                        />
                                        <Button
                                            size="icon"
                                            className={cn("rounded-full w-10 h-10 transition-all duration-300", input.trim() ? "bg-blue-600 hover:bg-blue-700 text-white scale-100" : "bg-slate-100 text-slate-300 scale-90")}
                                            onClick={handleSend}
                                            disabled={!input.trim() || isProcessing || isTyping}
                                        >
                                            <Send className="w-5 h-5 ml-0.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] text-center text-slate-400">
                                AI can make mistakes. Verify important information.
                            </p>
                        </div>
                    </div>
                </Card>
            )}
            {/* Load PDF.js from CDN */}
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
                strategy="lazyOnload"
                onLoad={() => {
                    const pdfjs = (window as any).pdfjsLib;
                    if (pdfjs) {
                        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
                        setPdfLibReady(true);
                    }
                }}
            />
        </div>
    );
}
