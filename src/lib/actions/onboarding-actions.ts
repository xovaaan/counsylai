"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../db";
import { revalidatePath } from "next/cache";

export type OnboardingData = {
    firstName: string;
    lastName: string;
    firmName: string;
    professionalEmail: string;
    firmSize: string;
    referralSource: string;
};

export async function completeOnboarding(data: OnboardingData) {
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // 1. Update User in Database
        await prisma.user.upsert({
            where: { id: userId },
            update: {
                name: `${data.firstName} ${data.lastName}`.trim(),
                firmName: data.firmName,
                professionalEmail: data.professionalEmail,
                firmSize: data.firmSize,
                referralSource: data.referralSource,
                onboardingCompleted: true,
            },
            create: {
                id: userId,
                email: data.professionalEmail, // Fallback, normally synced from webhook
                name: `${data.firstName} ${data.lastName}`.trim(),
                firmName: data.firmName,
                professionalEmail: data.professionalEmail,
                firmSize: data.firmSize,
                referralSource: data.referralSource,
                onboardingCompleted: true,
            },
        });

        // 2. Update Clerk Metadata (optional - may fail in some environments)
        // Temporarily disabled to avoid Turbopack issues
        // try {
        //     const { clerkClient } = await import("@clerk/nextjs/server");
        //     const client = await clerkClient();
        //     await client.users.updateUser(userId, {
        //         publicMetadata: {
        //             onboardingCompleted: true,
        //         },
        //     });
        // } catch (clerkError) {
        //     console.warn("Failed to update Clerk metadata:", clerkError);
        // }

        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to complete onboarding:", error);
        return { success: false, error: error.message };
    }
}
