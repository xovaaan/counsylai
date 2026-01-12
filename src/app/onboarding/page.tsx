import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function OnboardingPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    // Check if onboarding is already completed
    const dbUser = await prisma.user.findUnique({
        where: { id: user.id }
    });

    if (dbUser?.onboardingCompleted) {
        redirect("/dashboard");
    }

    return <OnboardingFlow userId={user.id} email={user.emailAddresses[0].emailAddress} />;
}
