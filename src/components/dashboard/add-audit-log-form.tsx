"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Loader2 } from "lucide-react";
import { createAuditLog } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface AddAuditLogFormProps {
    onClose: () => void;
}

const RESOURCE_TYPES = [
    "client",
    "contract",
    "document",
    "matter",
    "user",
    "system",
    "other"
];

export function AddAuditLogForm({ onClose }: AddAuditLogFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        action: "",
        resourceType: "",
        resourceId: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!formData.action.trim()) {
            setError("Action is required");
            return;
        }

        setLoading(true);
        try {
            const result = await createAuditLog({
                action: formData.action.trim(),
                resourceType: formData.resourceType || undefined,
                resourceId: formData.resourceId.trim() || undefined,
            });

            if (result.success) {
                router.refresh();
                onClose();
            } else {
                setError(result.error || "Failed to create audit log");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                        <CardTitle>Add Audit Log</CardTitle>
                        <CardDescription>Record a new activity or event</CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-6 w-6"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="action">Action *</Label>
                            <Input
                                id="action"
                                placeholder="e.g., Created new contract, Updated client status"
                                value={formData.action}
                                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                                required
                                className="bg-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="resourceType">Resource Type</Label>
                            <Select
                                value={formData.resourceType}
                                onValueChange={(value) => setFormData({ ...formData, resourceType: value })}
                            >
                                <SelectTrigger className="bg-white hover:bg-slate-100 focus:bg-slate-100">
                                    <SelectValue placeholder="Select resource type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {RESOURCE_TYPES.map((type) => (
                                        <SelectItem key={type} value={type} className="bg-white hover:bg-slate-100 focus:bg-slate-100 capitalize">
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="resourceId">Resource ID</Label>
                            <Input
                                id="resourceId"
                                placeholder="e.g., client-123, contract-456 (optional)"
                                value={formData.resourceId}
                                onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
                                className="bg-white"
                            />
                            <p className="text-xs text-slate-500">Optional: ID of the resource this action relates to</p>
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    "Add Log"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
