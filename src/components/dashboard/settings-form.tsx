"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { completeOnboarding } from "@/lib/actions";
// import { useToast } from "@/components/ui/use-toast"; // Commented out - not used

export function SettingsForm({ user }: { user: any }) {
    const [formData, setFormData] = useState({
        name: user?.name || "",
        firmName: user?.firmName || "",
        country: user?.country || "",
        professionalEmail: user?.professionalEmail || "",
        website: user?.website || "",
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        // Re-using completeOnboarding for simplicity as it performs upsert/update
        //Ideally we should have a separate 'updateProfile' action but completeOnboarding works fine here
        try {
            await completeOnboarding({
                userId: user.id,
                email: user.email,
                name: formData.name,
                dateOfBirth: user.dateOfBirth, // Keep existing
                firmName: formData.firmName,
                country: formData.country,
                firmSize: user.firmSize, // Keep existing
                professionalEmail: formData.professionalEmail,
                website: formData.website,
                referralSource: user.referralSource, // Keep existing
                painPoints: user.painPoints as string // Keep existing
            });
            alert("Settings saved successfully!");
        } catch (error) {
            alert("Failed to save settings.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Your Name</label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Firm Name</label>
                    <Input
                        value={formData.firmName}
                        onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Country</label>
                    <Input
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Professional Email</label>
                    <Input
                        value={formData.professionalEmail}
                        onChange={(e) => setFormData({ ...formData, professionalEmail: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Website</label>
                    <Input
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
            </div>
        </CardContent>
    );
}
