"use server";

import { prisma } from "../db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createContractTemplate(data: {
    name: string;
    type: string;
    description?: string;
    sections: any[];
    variables?: string[];
    isPublic?: boolean;
}) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const template = await prisma.contractTemplate.create({
            data: {
                organizationId: "personal_" + userId,
                name: data.name,
                type: data.type,
                description: data.description,
                sections: data.sections,
                variables: data.variables || [],
                isPublic: data.isPublic || false,
                createdBy: userId,
            },
        });

        revalidatePath("/dashboard/templates");
        return { success: true, data: template };
    } catch (error: any) {
        console.error("Failed to create contract template:", error);
        return { success: false, error: error.message };
    }
}

export async function getContractTemplates(type?: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const where: any = {
            OR: [
                { organizationId: "personal_" + userId },
                { isPublic: true },
            ],
        };

        if (type) {
            where.type = type;
        }

        const templates = await prisma.contractTemplate.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        return { success: true, data: templates };
    } catch (error: any) {
        console.error("Failed to fetch contract templates:", error);
        return { success: false, error: error.message };
    }
}

export async function generateContractFromTemplate(
    templateId: string,
    variables: Record<string, string>,
    customizations?: string
) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        // Fetch template
        const template = await prisma.contractTemplate.findUnique({
            where: { id: templateId },
        });

        if (!template) {
            return { success: false, error: "Template not found" };
        }

        // Generate contract content
        let content = "";
        const sections = template.sections as any[];

        for (const section of sections) {
            content += `\n\n## ${section.title}\n\n`;
            content += section.content || "";
        }

        // Replace variables
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, "g");
            content = content.replace(regex, value);
        }

        // Add customizations if provided
        if (customizations) {
            content += `\n\n## Additional Terms\n\n${customizations}`;
        }

        // Save generated contract
        const contract = await prisma.generatedContract.create({
            data: {
                organizationId: "personal_" + userId,
                userId,
                templateId,
                title: variables.contractTitle || template.name,
                type: template.type,
                content,
                variables,
                status: "draft",
            },
        });

        revalidatePath("/dashboard/generate");
        return { success: true, data: contract };
    } catch (error: any) {
        console.error("Failed to generate contract:", error);
        return { success: false, error: error.message };
    }
}

export async function getGeneratedContracts() {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const contracts = await prisma.generatedContract.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return { success: true, data: contracts };
    } catch (error: any) {
        console.error("Failed to fetch generated contracts:", error);
        return { success: false, error: error.message };
    }
}

export async function updateContractStatus(id: string, status: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const contract = await prisma.generatedContract.update({
            where: { id },
            data: { status },
        });

        revalidatePath("/dashboard/generate");
        return { success: true, data: contract };
    } catch (error: any) {
        console.error("Failed to update contract status:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteGeneratedContract(id: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        await prisma.generatedContract.delete({
            where: { id },
        });

        revalidatePath("/dashboard/generate");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete contract:", error);
        return { success: false, error: error.message };
    }
}
