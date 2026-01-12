import { Building2, CreditCard, Shield, Users, Bell, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { SettingsForm } from "@/components/dashboard/settings-form";

export default async function SettingsPage() {
    const clerkUser = await currentUser();

    // Fetch user data from our DB
    const dbUser = clerkUser ? await prisma.user.findUnique({
        where: { id: clerkUser.id }
    }) : null;

    // Fallback if no DB user found (though dashboard layout should catch this)
    const user = dbUser || {
        id: clerkUser?.id,
        email: clerkUser?.emailAddresses[0]?.emailAddress,
        name: clerkUser?.firstName + " " + clerkUser?.lastName,
        firmName: "",
        country: "",
        professionalEmail: "",
        website: "",
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-primary">Firm Settings</h1>
                <p className="text-muted-foreground underline underline-offset-4 decoration-primary/10">Configure your workspace, members, and billing preferences.</p>
            </div>

            <div className="space-y-6">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Subscription Plan</CardTitle>
                                <CardDescription>Scale your firm with premium features.</CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Professional Plan</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">$99 / seat / mo</p>
                                    <p className="text-xs text-muted-foreground">Next billing date: Feb 12, 2026</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Change Plan</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">General Settings</CardTitle>
                    </CardHeader>
                    <SettingsForm user={user} />
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Security & Privacy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium">Data Storage Isolation</p>
                                    <p className="text-xs text-muted-foreground">Keep all firm data in a private Postgres schema.</p>
                                </div>
                            </div>
                            <Badge variant="outline">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium">AI Training Opt-out</p>
                                    <p className="text-xs text-muted-foreground">Your data is never used to train global models.</p>
                                </div>
                            </div>
                            <Badge variant="outline">Enabled</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
