import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Gemini API key is not configured");
    }
    return new GoogleGenerativeAI(apiKey);
};

export async function generateClauseSuggestion(
    category: string,
    jurisdiction: string,
    context?: string
): Promise<string> {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Generate a professional legal clause for the following:

Category: ${category}
Jurisdiction: ${jurisdiction}
${context ? `Additional Context: ${context}` : ''}

Requirements:
1. Use formal legal language appropriate for ${jurisdiction}
2. Include standard protections and obligations
3. Make it clear and enforceable
4. Follow ${jurisdiction === 'Bangladesh' ? 'Bangladesh Contract Act 1872 and' : ''} common law principles
5. Use placeholder variables in {{variableName}} format where appropriate (e.g., {{partyName}}, {{amount}}, {{date}})

Provide ONLY the clause text, no explanations or additional commentary.
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return text.trim();
    } catch (error) {
        console.error("Failed to generate clause:", error);
        throw new Error("Failed to generate clause suggestion");
    }
}

export async function improveClause(
    originalClause: string,
    improvements: string[]
): Promise<string> {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Improve the following legal clause based on these requirements:

Original Clause:
"""
${originalClause}
"""

Improvements Requested:
${improvements.map((imp, i) => `${i + 1}. ${imp}`).join('\n')}

Provide the improved clause text only, maintaining legal formality and clarity.
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return text.trim();
    } catch (error) {
        console.error("Failed to improve clause:", error);
        throw new Error("Failed to improve clause");
    }
}

export async function suggestMissingClauses(
    contractType: string,
    existingClauses: string[]
): Promise<string[]> {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
For a ${contractType} contract, suggest important clauses that are missing.

Existing Clauses:
${existingClauses.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Provide a JSON array of missing clause categories that should be included.
Format: ["category1", "category2", ...]

Common categories include: termination, confidentiality, liability, payment, dispute resolution, force majeure, intellectual property, indemnification, governing law, etc.
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Failed to suggest missing clauses:", error);
        return [];
    }
}
