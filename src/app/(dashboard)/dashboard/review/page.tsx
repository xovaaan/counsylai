"use client";

import { useState } from "react";
import { Upload, FileText, Table as TableIcon, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { uploadAndExtract } from "@/lib/document-actions";
// import { useToast } from "@/components/ui/use-toast"; // Commented out - not used

export default function DocumentReviewPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    // We'll store multiple extracted files here ideally, but for MVP just one
    const [extractedItems, setExtractedItems] = useState<any[]>([]);

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadAndExtract(formData);
        if (res.success) {
            setResult(res.data);
            setExtractedItems(prev => [...prev, { fileName: res.fileName, ...(res.data || {}) }]);
        } else {
            alert("Failed to process");
        }
        setLoading(false);
    };

    const headers = extractedItems.length > 0
        ? Object.keys(extractedItems[0]).filter(k => k !== 'fileName')
        : ["Party Names", "Effective Date", "Termination", "Liability", "GOv Law"];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-primary">Tabular Review</h1>
                <p className="text-muted-foreground">Upload contracts to automatically extract and compare key clauses in a table.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Upload Section */}
                <Card className="lg:col-span-1 h-fit border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Upload Document</CardTitle>
                        <CardDescription>PDF or valid text files</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                            <p className="text-sm text-slate-500 mb-1">Drag file or click to browse</p>
                            <input
                                type="file"
                                accept=".pdf,.txt,.docx"
                                className="opacity-0 absolute w-full h-full cursor-pointer" // Simple hack, realistically stick hidden input
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) {
                                        if (f.size > 10 * 1024 * 1024) {
                                            alert("File size exceeds 10MB limit.");
                                            return;
                                        }
                                        setFile(f);
                                    }
                                }}
                                style={{ position: 'relative', opacity: 1, width: '100%' }} // temporary visible input
                            />
                        </div>
                        {file && (
                            <div className="flex items-center gap-2 p-2 bg-slate-100 rounded text-sm text-slate-700 overflow-hidden">
                                <FileText className="w-4 h-4 shrink-0" />
                                <span className="truncate">{file.name}</span>
                            </div>
                        )}
                        <Button className="w-full" onClick={handleUpload} disabled={!file || loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TableIcon className="w-4 h-4 mr-2" />}
                            Extract Data
                        </Button>
                    </CardContent>
                </Card>

                {/* Table Section */}
                <Card className="lg:col-span-3 border-slate-200 shadow-sm min-h-[500px]">
                    <CardHeader>
                        <CardTitle>Extracted Data Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {extractedItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                <TableIcon className="w-12 h-12 mb-4 opacity-20" />
                                <p>No documents processed yet.</p>
                            </div>
                        ) : (
                            <div className="rounded-md border border-slate-200 overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="font-semibold text-slate-700 min-w-[200px]">File Name</TableHead>
                                            {headers.map(header => (
                                                <TableHead key={header} className="font-semibold text-slate-700 min-w-[200px] whitespace-nowrap capitalize">
                                                    {header.replace(/([A-Z])/g, ' $1').trim()}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {extractedItems.map((item, i) => (
                                            <TableRow key={i}>
                                                <TableCell className="font-medium text-primary">
                                                    {item.fileName}
                                                </TableCell>
                                                {headers.map(header => (
                                                    <TableCell key={header}>
                                                        {typeof item[header] === 'string' ? item[header] : JSON.stringify(item[header])}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
