import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazy initialization effectively handles hot reloads and env var loading
const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set");
        throw new Error("Gemini API key is not configured");
    }
    return new GoogleGenerativeAI(apiKey);
};

// Helper for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateLegalResponse(prompt: string, context: string) {
    let retries = 3;
    let attempt = 0;

    while (attempt < retries) {
        try {
            // Validation happens in getGenAI()

            const fullPrompt = `
You are an expert legal assistant for the Counsyl platform, localized for law firms.
Your goal is to provide accurate, neutral, and professional legal information.

CONTEXT FROM SEARCH:
${context}

USER QUESTION:
${prompt}

RULES:
1. Use the provided context to answer the question.
2. If the context is insufficient, state that clearly but provide general legal principles based on Bangladesh law or Common Law as requested.
3. NEVER provide legal advice. Use phrases like "Under Bangladesh law..." or "Generally, the principle is...".
4. Cite the sources provided in the context using [1], [2], etc.
5. Keep the tone calm, enterprise, and trustworthy.
6. Refuse to hallucinate facts.
`;

            console.log(`Calling Gemini API (Attempt ${attempt + 1})...`);
            const genAI = getGenAI();
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();

            console.log("Gemini API response received successfully");
            return text;

        } catch (error: any) {
            console.error(`Gemini API error (Attempt ${attempt + 1}):`, error.message);

            // Allow retry only on 503 or 429 errors
            if ((error.message.includes('503') || error.message.includes('429')) && attempt < retries - 1) {
                const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
                console.log(`Retrying in ${waitTime}ms...`);
                await delay(waitTime);
                attempt++;
                continue;
            }

            console.error("Error details:", error.message);
            throw new Error(`Failed to generate AI response: ${error.message}`);
        }
    }

    throw new Error("Failed to generate AI response after multiple retries.");
}

// Serper Search Function
export async function searchWeb(query: string) {
    if (!process.env.SERPER_API_KEY) {
        console.warn("SERPER_API_KEY missing");
        return [];
    }

    try {
        const res = await fetch("https://google.serper.dev/search", {
            method: "POST",
            headers: {
                "X-API-KEY": process.env.SERPER_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ q: query })
        });

        const data = await res.json();
        return data.organic || [];
    } catch (e) {
        console.error("Serper search failed", e);
        return [];
    }
}

// Chat with Document Context
export async function chatWithDocumentContext(
    docText: string,
    chatHistory: { role: string, content: string }[],
    message: string,
    useWebSearch: boolean = false
) {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let searchContext = "";
    let sources: any[] = [];

    // Perform web search if requested
    if (useWebSearch) {
        const searchResults = await searchWeb(message);
        if (searchResults.length > 0) {
            sources = searchResults.map((r: any) => ({
                title: r.title,
                link: r.link,
                snippet: r.snippet,
                favicon: `https://www.google.com/s2/favicons?domain=${new URL(r.link).hostname}`
            })).slice(0, 4);

            searchContext = `
EXTERNAL SEARCH RESULTS (Cite these if relevant):
${sources.map((s, i) => `[${i + 1}] ${s.title}: ${s.snippet}`).join("\n")}
            `;
        }
    }

    const contextPrompt = `
You are a legal AI assistant. You are analyzing the following document:
"""
${docText.substring(0, 500000)} 
"""
(Note: Document text truncated to 500k chars for safety)

${searchContext}

STRICT RULE: You must answer the user's question primarily based on the provided "Document Text" above.
- If the answer is found in the document, provide it directly and cite the section if possible.
- If the answer is NOT in the document, check the "External Search Results" (if provided).
- If the answer is in neither, state clearly: "I cannot find this information in the document or search results."
- DO NOT makeup information or use general knowledge to answer specific questions about the document (e.g. "What is the termination date?").

User Question: ${message}
    `;

    // We can use the chat capability
    let validHistory = chatHistory.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
    }));

    // Gemini requires history to start with 'user'
    if (validHistory.length > 0 && validHistory[0].role === 'model') {
        validHistory.unshift({ role: 'user', parts: [{ text: 'Hello' }] });
    }

    const chat = model.startChat({
        history: validHistory
    });

    try {
        const result = await chat.sendMessage(contextPrompt);
        const text = result.response.text();
        return { text, sources };
    } catch (error: any) {
        console.error("Gemini Chat Error:", error);
        return { text: "I'm sorry, I encountered an error analyzing the document.", sources: [] };
    }
}

export async function extractTableData(docText: string) {
    // ... existing extractTableData implementation
}

export async function analyzeContractWithAI(docText: string) {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Analyze the following legal document and provide a comprehensive risk assessment.
Identify:
1. "risks": A list of potential legal or commercial risks. For each risk, include "clause" (section name), "risk" (description), "severity" (high/medium/low), and "recommendation" (how to mitigate).
2. "missingClauses": A list of important clauses that are typical for this type of document but are missing.
3. "summary": A concise (2-3 sentence) executive summary of the document's overall tone and fairness.

Document Text:
"""
${docText.substring(0, 500000)}
"""

Response Format: JSON only.
Structure:
{
  "risks": [{"clause": "", "risk": "", "severity": "high/medium/low", "recommendation": ""}],
  "missingClauses": ["", ""],
  "summary": ""
}
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (e) {
        console.error("Contract analysis failed", e);
        return {
            risks: [],
            missingClauses: [],
            summary: "Failed to analyze document."
        };
    }
}

