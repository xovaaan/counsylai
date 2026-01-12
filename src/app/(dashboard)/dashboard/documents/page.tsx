import { Folder, FileText, Search, Grid, List as ListIcon, MoreVertical, Upload, ChevronRight, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    const orgId = "personal_" + user.id;

    // Fetch documents
    const documents = await prisma.document.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Document Vault</h1>
                    <p className="text-muted-foreground">Secure, encrypted storage for all your firm's sensitive materials.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">New Folder</Button>
                    <Button size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Files
                    </Button>
                </div>
            </div>

            <Card className="border-slate-200 bg-slate-50/50">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search files and folders..."
                            className="pl-10 h-10 bg-white border-slate-200"
                        // Search logic omitted for server component simplicity
                        />
                    </div>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-1">
                        {/* 
                            In a server component, simple state toggles like 'grid' vs 'list' 
                            need client-side wrapping or searchParams. 
                            We'll default to Grid for this "modern" view.
                        */}
                        <div className={cn("p-1.5 rounded bg-slate-100 text-primary")}>
                            <Grid className="w-4 h-4" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <HardDrive className="w-4 h-4" />
                <span>My Files</span>
                <ChevronRight className="w-3 h-3" />
                <span className="font-semibold text-primary">Root</span>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {documents.length > 0 ? documents.map((doc) => (
                    <Card key={doc.id} className="group hover:border-primary/20 transition-all cursor-pointer overflow-hidden bg-white">
                        <CardContent className="p-4">
                            <div className="rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform w-12 h-12 bg-slate-100 text-slate-500">
                                <FileText className="w-6 h-6" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm truncate mb-1">{doc.name}</h3>
                                <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                    <span>{doc.fileSize ? `${Math.round(doc.fileSize / 1024)} KB` : '--'}</span>
                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                    <span>{doc.createdAt.toLocaleDateString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )) : (
                    <div className="col-span-full text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <Folder className="w-10 h-10 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">Vault is Empty</h3>
                        <p className="text-slate-500 mb-6">Upload contracts, evidence, or research papers.</p>
                        <Button variant="outline">Upload First File</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
