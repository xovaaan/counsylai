import { NextResponse } from "next/server";
import { searchLegalSources } from "@/lib/search-service";
import { generateLegalResponse } from "@/lib/ai-service";

export async function POST(req: Request) {
    try {
        const { query, jurisdiction } = await req.json();

        if (!query) {
            return NextResponse.json({ error: "Query is required" }, { status: 400 });
        }

        console.log("Research API called with query:", query, "jurisdiction:", jurisdiction);

        // 1. Search for sources
        console.log("Step 1: Searching for legal sources...");
        const sources = await searchLegalSources(query, jurisdiction);
        console.log("Found", sources.length, "sources");

        // 2. Format context for AI
        const context = sources.length > 0
            ? sources
                .map((s, i) => `[${i + 1}] ${s.title}\nLink: ${s.link}\nSnippet: ${s.snippet}`)
                .join("\n\n")
            : "No specific sources found. Please provide general legal principles.";

        // 3. Generate response
        console.log("Step 2: Generating AI response...");
        const answer = await generateLegalResponse(query, context);
        console.log("AI response generated successfully");

        return NextResponse.json({
            answer,
            sources: sources.slice(0, 4), // Return top 4 sources
        });
    } catch (error: any) {
        console.error("Research API error:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json(
            {
                error: "Failed to process research request",
                details: error.message
            },
            { status: 500 }
        );
    }
}
