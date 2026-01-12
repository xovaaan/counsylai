import { Sidebar } from "@/components/dashboard/sidebar";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

const hasValidClerkKeys =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_");

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    // Check onboarding status
    try {
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id }
        });

        // If user doesn't exist (first login) or hasn't completed onboarding
        if (!dbUser || !dbUser.onboardingCompleted) {
            redirect("/onboarding");
        }
    } catch (e) {
        // If table doesn't exist yet or DB error, we might log it but for now proceed 
        // to avoid locking out if migration hasn't run. 
        // However, if table exists and user missing, redirect is correct.
        // console.error(e);
    }

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        {/* OrganizationSwitcher removed as per user request */}
                        {!hasValidClerkKeys && (
                            <div className="text-sm font-medium text-slate-500 px-3 py-1 border rounded-md bg-slate-50">
                                Demo Mode - Add Clerk keys to enable auth
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        {hasValidClerkKeys ? (
                            <UserButton afterSignOutUrl="/" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
                                U
                            </div>
                        )}
                    </div>
                </header>
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
