import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search, FileText, Scale, Users, Activity, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";

export default async function DashboardPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    // Parallel fetch for stats and chart data
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
        researchCount,
        contractCount,
        clientCount,
        matterCount,
        recentResearch,
        recentContracts,
        weekResearch,
        weekContracts,
        clientsThisMonth,
        totalChatMessages,
        documentsCount,
        recentChatSessions
    ] = await Promise.all([
        prisma.researchQuery.count({ where: { userId: user.id } }),
        prisma.contractAnalysis.count({ where: { userId: user.id } }),
        prisma.client.count({ where: { organizationId: "personal_" + user.id } }),
        prisma.matter.count({ where: { organizationId: "personal_" + user.id } }),
        prisma.researchQuery.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 3
        }),
        prisma.contractAnalysis.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 3
        }),
        prisma.researchQuery.findMany({
            where: {
                userId: user.id,
                createdAt: { gte: sevenDaysAgo }
            },
            select: { createdAt: true }
        }),
        prisma.contractAnalysis.findMany({
            where: {
                userId: user.id,
                createdAt: { gte: sevenDaysAgo }
            },
            select: { createdAt: true, fileName: true }
        }),
        prisma.client.count({
            where: {
                organizationId: "personal_" + user.id,
                createdAt: { gte: firstDayOfMonth }
            }
        }),
        prisma.chatMessage.count({
            where: {
                session: { userId: user.id }
            }
        }),
        prisma.document.count({
            where: { organizationId: "personal_" + user.id }
        }),
        prisma.chatSession.findMany({
            where: { userId: user.id },
            include: { document: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
            take: 3
        })
    ]);

    // Process Chart Data: Research over last 7 days
    const chartData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = days[d.getDay()];
        const dateStr = d.toDateString(); // primitive day check

        const rCount = weekResearch.filter(r => new Date(r.createdAt).toDateString() === dateStr).length;
        chartData.push({ name: dayName, queries: rCount });
    }

    // Process Contract Data: Categorize by filename
    const contractTypes: Record<string, number> = { "NDA": 0, "Employment": 0, "Service": 0, "Lease": 0, "Other": 0 };
    weekContracts.forEach(c => {
        const name = (c as any).fileName.toLowerCase();
        if (name.includes('nda') || name.includes('non-disclosure')) contractTypes["NDA"]++;
        else if (name.includes('employment') || name.includes('offer')) contractTypes["Employment"]++;
        else if (name.includes('service') || name.includes('msa')) contractTypes["Service"]++;
        else if (name.includes('lease') || name.includes('rental')) contractTypes["Lease"]++;
        else contractTypes["Other"]++;
    });

    // Format for BarChart
    const contractChartData = Object.entries(contractTypes)
        .map(([name, count]) => ({ name, count }))
        .filter(item => item.count > 0 || item.name === 'Other')
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);

    if (contractChartData.length === 0) contractChartData.push({ name: "No Data", count: 0 });

    const stats = [
        { title: "Total Research", value: researchCount.toString(), icon: Search, change: "All time" },
        { title: "Contracts Reviewed", value: contractCount.toString(), icon: FileText, change: "All time" },
        { title: "Document Chats", value: totalChatMessages.toString(), icon: Sparkles, change: "AI Messages" },
        { title: "Total Clients", value: clientCount.toString(), icon: Users, change: `${clientsThisMonth} new this month` },
    ];

    // Prepare additional chart data
    const chatActivityData = [
        { name: "Documents", value: documentsCount },
        { name: "Total Messages", value: totalChatMessages }
    ];

    const clientData = [
        { name: "Prev Total", count: clientCount - clientsThisMonth },
        { name: "New (This Month)", count: clientsThisMonth }
    ];

    // Combine recent activities
    const activities = [
        ...recentResearch.map((r: { id: string; query: string; jurisdiction: string | null; createdAt: Date }) => ({
            type: 'research',
            id: r.id,
            title: `Researched: "${r.query.substring(0, 40)}..."`,
            date: r.createdAt,
            icon: Search,
            description: r.jurisdiction
        })),
        ...recentContracts.map((c: { id: string; fileName: string; risks: any; createdAt: Date }) => ({
            type: 'contract',
            id: c.id,
            title: `Reviewed: ${c.fileName}`,
            date: c.createdAt,
            icon: FileText,
            description: `${(c.risks as any[])?.length || 0} Risks`
        })),
        ...(recentChatSessions as any[]).map((s: any) => ({
            type: 'chat',
            id: s.id,
            title: `Chatted with ${s.document.name}`,
            date: s.createdAt,
            icon: Sparkles,
            description: "AI History"
        }))
    ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-primary">Welcome back, {user.firstName || 'Partner'}</h1>
                <p className="text-muted-foreground underline underline-offset-4 decoration-primary/10">Here is what's happening in your firm today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                            <stat.icon className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <DashboardCharts
                researchData={chartData}
                contractData={contractChartData}
                clientData={clientData}
                chatData={chatActivityData}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activities.length > 0 ? (
                            <div className="space-y-4">
                                {activities.map((activity, i) => (
                                    <div key={i} className="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                            <activity.icon className="w-5 h-5 text-slate-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{activity.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(activity.date).toLocaleDateString()} • {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                            {activity.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <Activity className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                <p>No recent activity found.</p>
                                <Button asChild variant="link" className="mt-2">
                                    <Link href="/dashboard/research">Start Research</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Quick Access</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <Link href="/dashboard/research" className="block p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Search className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Legal Research</p>
                                        <p className="text-xs text-muted-foreground">Search statutes & case law</p>
                                    </div>
                                </div>
                            </Link>
                            <Link href="/dashboard/contracts" className="block p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-purple-50 flex items-center justify-center text-purple-600">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Contract Review</p>
                                        <p className="text-xs text-muted-foreground">Analyze agreements AI</p>
                                    </div>
                                </div>
                            </Link>
                            <Link href="/dashboard/clients" className="block p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center text-green-600">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Client Management</p>
                                        <p className="text-xs text-muted-foreground">View client roster</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

