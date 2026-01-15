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
    name: string;
    email?: string;
    company?: string;
    phone?: string;
    status?: string;
}) {
    const { auth } = await import("@clerk/nextjs/server");
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const organizationId = "personal_" + userId;
        const result = await prisma.client.create({
            data: {
                organizationId,
                name: data.name,
                email: data.email,
                company: data.company,
                phone: data.phone,
                status: data.status || "active",
            },
        });

        // Create audit log for new client
        await createAuditLog({
            action: `Created new client: ${data.name}`,
            resourceType: "client",
            resourceId: result.id,
        });

        revalidatePath("/dashboard/clients");
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Failed to create client:", error);
        return { success: false, error: error.message || "Failed to create client" };
    }
}

export async function updateClientStatus(clientId: string, status: string) {
    const { auth } = await import("@clerk/nextjs/server");
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const organizationId = "personal_" + userId;
        
        // Verify client belongs to user's organization
        const client = await prisma.client.findFirst({
            where: {
                id: clientId,
                organizationId,
            },
        });

        if (!client) {
            return { success: false, error: "Client not found" };
        }

        const result = await prisma.client.update({
            where: { id: clientId },
            data: { status },
        });

        // Create audit log for status change
        await createAuditLog({
            action: `Updated client status to ${status}`,
            resourceType: "client",
            resourceId: clientId,
        });

        revalidatePath("/dashboard/clients");
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Failed to update client status:", error);
        return { success: false, error: error.message || "Failed to update status" };
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

// --- Audit Log Actions ---

export async function createAuditLog(data: {
    action: string;
    resourceType?: string;
    resourceId?: string;
    ipAddress?: string;
    userAgent?: string;
}) {
    const { auth } = await import("@clerk/nextjs/server");
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const organizationId = "personal_" + userId;
        
        // Get IP and user agent from headers if available
        const ipAddress = data.ipAddress || null;
        const userAgent = data.userAgent || null;

        const log = await prisma.auditLog.create({
            data: {
                organizationId,
                userId,
                action: data.action,
                resourceType: data.resourceType || null,
                resourceId: data.resourceId || null,
                ipAddress,
                userAgent,
            },
        });

        revalidatePath("/dashboard/logs");
        return { success: true, data: log };
    } catch (error: any) {
        console.error("Failed to create audit log:", error);
        return { success: false, error: error.message || "Failed to create audit log" };
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
