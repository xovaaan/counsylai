"use server";

import { prisma } from "./db";
import { revalidatePath } from "next/cache";

// --- Research Actions ---

export async function saveResearchQuery(data: {
    userId: string;
    organizationId?: string;
    query: string;
    jurisdiction?: string;
    answer: string;
    sources?: any;
}) {
    try {
        const result = await prisma.researchQuery.create({
            data: {
                userId: data.userId,
                organizationId: data.organizationId,
                query: data.query,
                jurisdiction: data.jurisdiction,
                answer: data.answer,
                sources: data.sources || [],
            },
        });
        return { success: true, data: result };
    } catch (error) {
        console.error("Failed to save research query:", error);
        return { success: false, error: "Failed to save research history" };
    }
}

export async function getResearchHistory(userId: string) {
    try {
        const history = await prisma.researchQuery.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 20,
        });
        return { success: true, data: history };
    } catch (error) {
        console.error("Failed to fetch research history:", error);
        return { success: false, error: "Failed to load history" };
    }
}

// --- Contract Actions ---

export async function saveContractAnalysis(data: {
    userId: string;
    fileName: string;
    risks: any;
    missingClauses: any;
    recommendations: any;
}) {
    try {
        const result = await prisma.contractAnalysis.create({
            data: {
                userId: data.userId,
                fileName: data.fileName,
                risks: data.risks || [],
                missingClauses: data.missingClauses || [],
                recommendations: data.recommendations || [],
            },
        });
        revalidatePath("/dashboard/contracts");
        return { success: true, data: result };
    } catch (error) {
        console.error("Failed to save contract analysis:", error);
        return { success: false, error: "Failed to save analysis" };
    }
}

// --- Client Actions ---

export async function createClient(data: {
    organizationId: string;
    name: string;
    email?: string;
    company?: string;
}) {
    try {
        const result = await prisma.client.create({
            data: {
                organizationId: data.organizationId,
                name: data.name,
                email: data.email,
                company: data.company,
            },
        });
        revalidatePath("/dashboard/clients");
        return { success: true, data: result };
    } catch (error) {
        console.error("Failed to create client:", error);
        return { success: false, error: "Failed to create client" };
    }
}

export async function getClients(organizationId: string) {
    try {
        const clients = await prisma.client.findMany({
            where: { organizationId },
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data: clients };
    } catch (error) {
        console.error("Failed to fetch clients:", error);
        return { success: false, error: "Failed to load clients" };
    }
}

// --- Onboarding Actions ---

export async function completeOnboarding(data: {
    userId: string;
    email: string;
    name: string;
    dateOfBirth: Date;
    firmName: string;
    country: string;
    firmSize: string;
    professionalEmail: string;
    website: string;
    referralSource: string;
    painPoints: string;
}) {
    try {
        // Upsert user to ensure it exists
        const user = await prisma.user.upsert({
            where: { id: data.userId },
            update: {
                name: data.name,
                dateOfBirth: data.dateOfBirth,
                firmName: data.firmName,
                country: data.country,
                firmSize: data.firmSize,
                professionalEmail: data.professionalEmail,
                website: data.website,
                referralSource: data.referralSource,
                painPoints: data.painPoints, // Storing simple string for now or JSON if changed
                onboardingCompleted: true
            },
            create: {
                id: data.userId,
                email: data.email,
                name: data.name,
                dateOfBirth: data.dateOfBirth,
                firmName: data.firmName,
                country: data.country,
                firmSize: data.firmSize,
                professionalEmail: data.professionalEmail,
                website: data.website,
                referralSource: data.referralSource,
                painPoints: data.painPoints,
                onboardingCompleted: true
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to complete onboarding:", error);
        return { success: false, error: "Failed to save profile" };
    }
}
