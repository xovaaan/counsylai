import { Users, UserPlus, Search, MoreVertical, Mail, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AddClientButton } from "@/components/dashboard/add-client-button";
import { ClientStatusBadge } from "@/components/dashboard/client-status-badge";
import { UpdateClientStatusButton } from "@/components/dashboard/update-client-status-button";

export default async function ClientsPage() {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    // Fetch real clients
    const orgId = "personal_" + user.id;

    const clients = await prisma.client.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { matters: true }
            }
        }
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Clients</h1>
                    <p className="text-muted-foreground">Manage your firm's relationships and active matters.</p>
                </div>
                <AddClientButton />
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search by company or contact name..."
                        className="pl-10 h-11"
                    // Search implementation would simpler with URL params in a server component (searchParams)
                    // For now we just display list. Search functionality in Server Components requires Client Component wrapper or searchParams.
                    // I will leave visual input for now or ideally make it work via URL.
                    />
                </div>
                <Button variant="outline" className="h-11">Advanced Filters</Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {clients.length > 0 ? (
                    clients.map((client) => (
                        <Card key={client.id} className="border-slate-200 hover:border-primary/20 transition-all group overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex items-center p-6 gap-6">
                                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-serif font-bold text-lg group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                        {client.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-serif font-semibold truncate">{client.name}</h3>
                                            <ClientStatusBadge status={client.status} />
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                            {client.email && (
                                                <span className="flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {client.email}
                                                </span>
                                            )}
                                            {client.phone && (
                                                <span className="hidden sm:flex items-center gap-1.5">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {client.phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8 text-right hidden lg:flex">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Matters</p>
                                            <p className="text-sm font-semibold">{client._count.matters}</p>
                                        </div>
                                        <div className="w-px h-8 bg-slate-100"></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <UpdateClientStatusButton clientId={client.id} currentStatus={client.status} />
                                        <Button variant="ghost" size="icon" className="group-hover:text-primary">
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <Users className="w-10 h-10 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No Clients Found</h3>
                        <p className="text-slate-500 mb-6">Get started by adding your first client.</p>
                        <AddClientButton />
                    </div>
                )}
            </div>
        </div>
    );
}
