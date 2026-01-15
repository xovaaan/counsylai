"use server";

import { extractTableData, chatWithDocumentContext, searchWeb } from "@/lib/ai-service";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// import pdf from "pdf-parse"; 
// const pdf = require("pdf-parse");
import { analyzeContractWithAI } from "@/lib/ai-service";

// Function to parse PDF from FormData
async function parsePdf(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamic import for CommonJS module compatibility with Turbopack
    const pdf2jsonModule = await import("pdf2json");
    const PDFParser = pdf2jsonModule.default || pdf2jsonModule;
    
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, true); // true = enable raw text extraction

        pdfParser.on("pdfParser_dataError", (errData: any) => {
            console.error("PDF Parser Error", errData.parserError);
            reject(errData.parserError);
        });

        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
            // Manual extraction to ensure clean text
            try {
                let parsedText = "";
                // Navigate the PDF2JSON structure: formImage -> Pages -> Texts -> R -> T (URI encoded)
                if (pdfData && pdfData.formImage && pdfData.formImage.Pages) {
                    pdfData.formImage.Pages.forEach((page: any) => {
                        if (page.Texts) {
                            page.Texts.forEach((textItem: any) => {
                                if (textItem.R) {
                                    textItem.R.forEach((t: any) => {
                                        if (t.T) {
                                            parsedText += decodeURIComponent(t.T) + " ";
                                        }
                                    });
                                }
                            });
                            parsedText += "\n";
                        }
                    });
                }

                // Fallback if manual extraction failed/empty
                if (!parsedText.trim()) {
                    console.log("Manual extraction empty, trying getRawTextContent");
                    resolve(pdfParser.getRawTextContent());
                } else {
                    resolve(parsedText);
                }
            } catch (e) {
                console.error("Manual text extraction failed", e);
                // Fallback
                resolve(pdfParser.getRawTextContent());
            }
        });

        pdfParser.parseBuffer(buffer);
    });
}

export async function uploadAndExtract(formData: FormData) {
    const { userId, orgId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file provided" };

    // Check size again just in case (server side constraint)
    if (file.size > 10 * 1024 * 1024) {
        return { success: false, error: "File size exceeds 10MB limit" };
    }

    try {
        // Parse Text
        console.log("Parsing file:", file.name);
        let text = "";
        if (file.type === "application/pdf") {
            try {
                text = await parsePdf(file);
                console.log("PDF parsed, length:", text.length);
            } catch (pdfErr) {
                console.error("PDF Parse Error Internal:", pdfErr);
                return { success: false, error: "Failed to parse PDF file" };
            }
        } else {
            text = await file.text();
        }

        let documentId = "";
        try {
            // Save to Database
            console.log("Saving to DB...");
            const effectiveOrgId = "personal_" + userId;
            const newDocument = await prisma.document.create({
                data: {
                    organizationId: effectiveOrgId,
                    name: file.name,
                    textContent: text,
                    fileSize: file.size,
                    fileType: file.type,
                    fileUrl: "",
                    uploadedBy: userId
                }
            });
            documentId = newDocument.id;
            console.log("Saved to DB ID:", documentId);
        } catch (dbErr: any) {
            console.error("Database Save Failed:", dbErr);
            // If DB fails (e.g. schema mismatch due to lock), we might still want to allow chat?
            // For now, fail hard to let user know persistence is broken, OR return success but with warning?
            // "Failed to save to history, but you can chat."
            // But user asked for persistence.
            // Let's return error with hint.
            return { success: false, error: "Database error: " + (dbErr.message || "Unknown DB error") };
        }

        // Extract Data using Gemini
        const data = await extractTableData(text);

        // Use general classification logic or return the raw classification
        return { success: true, fileName: file.name, data, textContent: text, documentId };
    } catch (error: any) {
        console.error("Upload failed generic:", error);
        return { success: false, error: "Failed to process: " + error.message };
    }
}

export async function chatWithDocumentAction(
    docText: string,
    history: any[],
    message: string,
    useWebSearch: boolean,
    documentId?: string,
    sessionId?: string
) {
    const { userId } = await auth();
    if (!userId) return { response: "Unauthorized", sources: [] };

    // Determine context inside the service now based on useWebSearch flag
    const result = await chatWithDocumentContext(docText, history, message, useWebSearch);

    // Persist to DB if sessionId is provided
    if (sessionId) {
        try {
            // Save User Message
            await prisma.chatMessage.create({
                data: {
                    sessionId,
                    role: "user",
                    content: message
                }
            });

            // Save Model Response
            await prisma.chatMessage.create({
                data: {
                    sessionId,
                    role: "model",
                    content: result.text,
                    sources: result.sources || []
                }
            });
        } catch (e) {
            console.error("Failed to persist chat message:", e);
        }
    }

    return { response: result.text, sources: result.sources };
}

export async function getOrCreateChatSession(documentId: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const effectiveOrgId = "personal_" + userId;

        // Try to find an existing session for this document/user
        // Currently, we'll just create a new one for each upload, OR 
        // find the most recent one if we want to "resume".
        // Let's try to find the most recent one.
        const existingSession = await prisma.chatSession.findFirst({
            where: {
                userId,
                documentId
            },
            orderBy: { createdAt: 'desc' }
        });

        if (existingSession) {
            return { success: true, sessionId: existingSession.id };
        }

        const newSession = await prisma.chatSession.create({
            data: {
                userId,
                organizationId: effectiveOrgId,
                documentId
            }
        });

        return { success: true, sessionId: newSession.id };
    } catch (e: any) {
        console.error("Failed to get/create chat session:", e);
        return { success: false, error: e.message };
    }
}

export async function getChatHistory(sessionId: string) {
    try {
        const messages = await prisma.chatMessage.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' }
        });

        return {
            success: true,
            messages: messages.map((m: { role: string; content: string; sources: any }) => ({
                role: m.role as 'user' | 'model',
                content: m.content,
                sources: m.sources as any[]
            }))
        };
    } catch (e: any) {
        console.error("Failed to fetch chat history:", e);
        return { success: false, error: e.message };
    }
}

export async function getRecentChatSessions() {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const sessions = await prisma.chatSession.findMany({
            where: { userId },
            include: {
                document: {
                    select: { name: true }
                }
            },
            orderBy: { updatedAt: 'desc' },
            take: 10
        });

        return { success: true, sessions };
    } catch (e: any) {
        console.error("Failed to fetch recent chat sessions:", e);
        return { success: false, error: e.message };
    }
}
// DOCX Parser
async function parseDocx(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Dynamic import for CommonJS module compatibility with Turbopack
    const mammoth = await import("mammoth");
    const result = await mammoth.default.extractRawText({ buffer });
    return result.value;
}

// Excel Parser
async function parseExcel(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Dynamic import for CommonJS module compatibility with Turbopack
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    let text = "";
    workbook.SheetNames.forEach((sheetName: string) => {
        const worksheet = workbook.Sheets[sheetName];
        text += `Sheet: ${sheetName}\n`;
        text += XLSX.utils.sheet_to_txt(worksheet) + "\n\n";
    });
    return text;
}

export async function analyzeContractAction(formData: FormData) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file provided" };

    try {
        console.log("Analyzing contract:", file.name);
        let text = "";
        const fileType = file.name.split('.').pop()?.toLowerCase();

        if (fileType === "pdf") {
            text = await parsePdf(file);
        } else if (fileType === "docx") {
            text = await parseDocx(file);
        } else if (fileType === "xlsx" || fileType === "xls") {
            text = await parseExcel(file);
        } else {
            text = await file.text();
        }

        if (!text || text.trim().length === 0) {
            return { success: false, error: "No text could be extracted from the document." };
        }

        // AI Analysis
        const analysis = await analyzeContractWithAI(text);

        // Save to Database
        const effectiveOrgId = "personal_" + userId;
        const savedAnalysis = await prisma.contractAnalysis.create({
            data: {
                userId,
                organizationId: effectiveOrgId,
                fileName: file.name,
                risks: analysis.risks,
                missingClauses: analysis.missingClauses,
                summary: analysis.summary as any, // Cast if needed, or update schema
            }
        });

        return {
            success: true,
            analysis,
            analysisId: savedAnalysis.id
        };
    } catch (error: any) {
        console.error("Contract analysis action failed:", error);
        return { success: false, error: error.message };
    }
}

export async function getRecentAnalyses() {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const analyses = await prisma.contractAnalysis.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        return { success: true, analyses };
    } catch (e: any) {
        console.error("Failed to fetch analyses:", e);
        return { success: false, error: e.message };
    }
}
