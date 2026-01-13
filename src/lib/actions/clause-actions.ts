"use server";

import { prisma } from "../db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createClauseTemplate(data: {
    name: string;
    category: string;
    description?: string;
    content: string;
    variables?: string[];
    jurisdiction?: string;
    isPublic?: boolean;
}) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const clause = await prisma.clauseTemplate.create({
            data: {
                organizationId: "personal_" + userId,
                name: data.name,
                category: data.category,
                description: data.description,
                content: data.content,
                variables: data.variables || [],
                jurisdiction: data.jurisdiction,
                isPublic: data.isPublic || false,
                createdBy: userId,
            },
        });

        revalidatePath("/dashboard/clause-library");
        return { success: true, data: clause };
    } catch (error: any) {
        console.error("Failed to create clause template:", error);
        return { success: false, error: error.message };
    }
}

export async function getClauseTemplates(filters?: {
    category?: string;
    jurisdiction?: string;
    search?: string;
}) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const where: any = {
            OR: [
                { organizationId: "personal_" + userId },
                { isPublic: true },
            ],
        };

        if (filters?.category) {
            where.category = filters.category;
        }

        if (filters?.jurisdiction) {
            where.jurisdiction = filters.jurisdiction;
        }

        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: "insensitive" } },
                { content: { contains: filters.search, mode: "insensitive" } },
            ];
        }

        const clauses = await prisma.clauseTemplate.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        return { success: true, data: clauses };
    } catch (error: any) {
        console.error("Failed to fetch clause templates:", error);
        return { success: false, error: error.message };
    }
}

export async function updateClauseTemplate(
    id: string,
    data: Partial<{
        name: string;
        category: string;
        description: string;
        content: string;
        variables: string[];
        jurisdiction: string;
    }>
) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const clause = await prisma.clauseTemplate.update({
            where: { id },
            data,
        });

        revalidatePath("/dashboard/clause-library");
        return { success: true, data: clause };
    } catch (error: any) {
        console.error("Failed to update clause template:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteClauseTemplate(id: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        await prisma.clauseTemplate.delete({
            where: { id },
        });

        revalidatePath("/dashboard/clause-library");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete clause template:", error);
        return { success: false, error: error.message };
    }
}
