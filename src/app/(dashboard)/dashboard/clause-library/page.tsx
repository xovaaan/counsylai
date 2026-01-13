"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Search, Copy, Edit, Trash2, Sparkles, Check } from "lucide-react";
import { getClauseTemplates, createClauseTemplate, deleteClauseTemplate } from "@/lib/actions/clause-actions";
import { generateClauseSuggestion } from "@/lib/clause-service";

const CATEGORIES = [
    "All Categories",
    "Termination",
    "Confidentiality",
    "Payment",
    "Liability",
    "Intellectual Property",
    "Dispute Resolution",
    "Force Majeure",
    "Indemnification",
    "Governing Law",
    "Non-Compete",
    "Warranties",
];

const JURISDICTIONS = ["All", "Bangladesh", "United Kingdom", "United States", "India"];

export default function ClauseLibraryPage() {
    const [clauses, setClauses] = useState<any[]>([]);
    const [filteredClauses, setFilteredClauses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedJurisdiction, setSelectedJurisdiction] = useState("All");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        category: "Termination",
        jurisdiction: "Bangladesh",
        description: "",
        content: "",
    });

    useEffect(() => {
        loadClauses();
    }, []);

    useEffect(() => {
        filterClauses();
    }, [clauses, searchTerm, selectedCategory, selectedJurisdiction]);

    const loadClauses = async () => {
        setLoading(true);
        const result = await getClauseTemplates();
        if (result.success) {
            setClauses(result.data || []);
        }
        setLoading(false);
    };

    const filterClauses = () => {
        let filtered = clauses;

        if (selectedCategory !== "All Categories") {
            filtered = filtered.filter((c) => c.category === selectedCategory);
        }

        if (selectedJurisdiction !== "All") {
            filtered = filtered.filter((c) => c.jurisdiction === selectedJurisdiction);
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (c) =>
                    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredClauses(filtered);
    };

    const handleGenerateClause = async () => {
        if (!formData.category || !formData.jurisdiction) {
            alert("Please select category and jurisdiction");
            return;
        }

        setGenerating(true);
        try {
            const generatedContent = await generateClauseSuggestion(
                formData.category,
                formData.jurisdiction,
                formData.description
            );
            setFormData({ ...formData, content: generatedContent });
        } catch (error) {
            alert("Failed to generate clause");
        }
        setGenerating(false);
    };

    const handleCreateClause = async () => {
        if (!formData.name || !formData.content) {
            alert("Name and content are required");
            return;
        }

        const result = await createClauseTemplate({
            name: formData.name,
            category: formData.category,
            jurisdiction: formData.jurisdiction,
            description: formData.description,
            content: formData.content,
        });

        if (result.success) {
            setShowCreateForm(false);
            setFormData({
                name: "",
                category: "Termination",
                jurisdiction: "Bangladesh",
                description: "",
                content: "",
            });
            loadClauses();
        } else {
            alert("Failed to create clause: " + result.error);
        }
    };

    const handleCopyClause = (content: string, id: string) => {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDeleteClause = async (id: string) => {
        if (!confirm("Are you sure you want to delete this clause?")) return;

        const result = await deleteClauseTemplate(id);
        if (result.success) {
            loadClauses();
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-primary">Clause Library</h1>
                <p className="text-muted-foreground underline underline-offset-4 decoration-primary/10">
                    Searchable repository of legal clauses with AI-powered generation
                </p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search clauses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {JURISDICTIONS.map((jur) => (
                            <SelectItem key={jur} value={jur}>
                                {jur}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Create Button */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    {filteredClauses.length} clause{filteredClauses.length !== 1 ? "s" : ""} found
                </p>
                <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Clause
                </Button>
            </div>

            {/* Create Form */}
            {showCreateForm && (
                <Card className="border-primary/20">
                    <CardHeader>
                        <CardTitle>Create New Clause</CardTitle>
                        <CardDescription>Add a new clause to your library or generate one with AI</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Clause Name</label>
                                <Input
                                    placeholder="e.g., Standard Termination Clause"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.filter((c) => c !== "All Categories").map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Jurisdiction</label>
                                <Select value={formData.jurisdiction} onValueChange={(val) => setFormData({ ...formData, jurisdiction: val })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {JURISDICTIONS.filter((j) => j !== "All").map((jur) => (
                                            <SelectItem key={jur} value={jur}>
                                                {jur}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description (Optional)</label>
                                <Input
                                    placeholder="Brief description or context"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Clause Content</label>
                                <Button variant="outline" size="sm" onClick={handleGenerateClause} disabled={generating}>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    {generating ? "Generating..." : "Generate with AI"}
                                </Button>
                            </div>
                            <textarea
                                className="w-full min-h-[200px] p-3 border rounded-md text-sm"
                                placeholder="Enter clause text or generate with AI..."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Use {`{{variableName}}`} for placeholders (e.g., {`{{partyName}}, {{amount}}, {{date}}`})
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={handleCreateClause}>Save Clause</Button>
                            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Clauses Grid */}
            {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading clauses...</div>
            ) : filteredClauses.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <BookOpen className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                        <p className="text-muted-foreground mb-4">No clauses found</p>
                        <Button onClick={() => setShowCreateForm(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Clause
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredClauses.map((clause) => (
                        <Card key={clause.id} className="border-slate-200 hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{clause.name}</CardTitle>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="secondary">{clause.category}</Badge>
                                            {clause.jurisdiction && (
                                                <Badge variant="outline">{clause.jurisdiction}</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleCopyClause(clause.content, clause.id)}
                                        >
                                            {copiedId === clause.id ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteClause(clause.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                                {clause.description && (
                                    <CardDescription className="mt-2">{clause.description}</CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap line-clamp-6">
                                        {clause.content}
                                    </p>
                                </div>
                                <div className="mt-3 flex justify-between items-center text-xs text-muted-foreground">
                                    <span>Created {new Date(clause.createdAt).toLocaleDateString()}</span>
                                    {clause.isPublic && <Badge variant="info">Public</Badge>}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
