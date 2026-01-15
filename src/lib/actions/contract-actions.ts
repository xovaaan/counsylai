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
    customizations?: string,
    templateData?: any // Allow passing template data directly
) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        let template: any = null;

        // If template data is provided, use it (for sample templates)
        if (templateData) {
            template = templateData;
        } else {
            // Otherwise, fetch from database
            template = await prisma.contractTemplate.findUnique({
                where: { id: templateId },
            });

            if (!template) {
                return { success: false, error: "Template not found" };
            }
        }

        // Generate contract content with proper formatting (no markdown)
        let content = "";
        const sections = template.sections as any[];

        for (const section of sections) {
            // Add section title (formatted, not markdown)
            content += `\n\n${section.title}\n`;
            content += "=".repeat(section.title.length) + "\n\n";
            
            // Process section content - replace variables and format
            let sectionContent = section.content || "";
            
            // Replace variables
            for (const [key, value] of Object.entries(variables)) {
                const regex = new RegExp(`{{${key}}}`, "g");
                sectionContent = sectionContent.replace(regex, value);
            }
            
            // Format content - convert markdown-like patterns to plain text with formatting hints
            // Remove markdown headers, convert to plain text
            sectionContent = sectionContent
                .replace(/^###\s+/gm, "") // Remove ### headers
                .replace(/^##\s+/gm, "") // Remove ## headers
                .replace(/^\*\*(.+?)\*\*/gm, "**$1**") // Keep bold markers for PDF processing
                .replace(/^\*\s+/gm, "• ") // Convert markdown bullets to bullet points
                .replace(/^-\s+/gm, "• "); // Convert dashes to bullets
            
            content += sectionContent + "\n";
        }

        // Replace any remaining variables in the full content
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, "g");
            content = content.replace(regex, value);
        }

        // Add customizations if provided
        if (customizations) {
            content += `\n\nAdditional Terms\n`;
            content += "=".repeat("Additional Terms".length) + "\n\n";
            content += customizations;
        }

        // Add signature section for both parties at the end
        content += `\n\n\nSignatures\n`;
        content += "=".repeat("Signatures".length) + "\n\n";
        content += "IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.\n\n";
        
        // Determine party names from variables
        const party1Name = variables.disclosingParty || variables.employerName || variables.clientName || variables.providerName || "Party 1";
        const party2Name = variables.receivingParty || variables.employeeName || variables.providerName || variables.clientName || "Party 2";
        
        content += `\n\n${party1Name}\n`;
        content += "_________________________\n";
        content += "Signature\n\n";
        content += "_________________________\n";
        content += "Print Name\n\n";
        content += "_________________________\n";
        content += "Date\n\n\n";
        
        content += `\n\n${party2Name}\n`;
        content += "_________________________\n";
        content += "Signature\n\n";
        content += "_________________________\n";
        content += "Print Name\n\n";
        content += "_________________________\n";
        content += "Date\n";

        // Save generated contract
        const contract = await prisma.generatedContract.create({
            data: {
                organizationId: "personal_" + userId,
                userId,
                templateId: template.id || templateId,
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
