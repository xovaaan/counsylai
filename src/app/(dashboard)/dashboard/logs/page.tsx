import { History, Shield, ShieldAlert, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuditLogsPage() {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    // Fetch real logs
    const orgId = "personal_" + user.id;

    // In a real scenario, we'd also filter by userId if the log is specific to user actions in 'personal' scope
    const logs = await prisma.auditLog.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Audit Logs</h1>
                    <p className="text-muted-foreground">Comprehensive trail of all workspace activity for compliance and security.</p>
                </div>
                <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Logic for stats would go here, hardcoded for now or derived from logs */}
                <Card className="border-slate-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Security Score</p>
                                <p className="text-2xl font-bold text-primary">98/100</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Sessions</p>
                                <p className="text-2xl font-bold text-primary">1</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Events</p>
                                <p className="text-2xl font-bold text-primary">{logs.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-200 overflow-hidden shadow-sm">
                <CardHeader className="bg-slate-50 border-b border-slate-200 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Activity Trail</CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <Input placeholder="Search logs..." className="pl-9 h-8 text-xs bg-white" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action</th>
                                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target</th>
                                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actor ID</th>
                                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</th>
                                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {logs.length > 0 ? logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 text-sm font-medium text-primary">{log.action}</td>
                                        <td className="p-4 text-sm text-slate-500">{log.resourceType || '-'}</td>
                                        <td className="p-4 text-sm text-slate-500 font-medium truncate max-w-[150px]">{log.userId}</td>
                                        <td className="p-4 text-sm text-slate-400 font-mono">
                                            {log.createdAt.toLocaleDateString()} {log.createdAt.toLocaleTimeString()}
                                        </td>
                                        <td className="p-4 text-sm text-slate-400 font-mono">{log.ipAddress || 'Unknown'}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-500">No audit logs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
