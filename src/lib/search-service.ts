export interface SearchResult {
    title: string;
    link: string;
    snippet: string;
}

const apiKey = process.env.SERPER_API_KEY;

if (!apiKey) {
    console.error("SERPER_API_KEY is not set in environment variables");
}

export async function searchLegalSources(query: string, jurisdiction: string): Promise<SearchResult[]> {
    const serperQuery = `${query} ${jurisdiction} law statute case`;

    try {
        if (!apiKey) {
            console.warn("Serper API key not configured, returning empty results");
            return [];
        }

        console.log("Calling Serper API with query:", serperQuery);

        const response = await fetch("https://google.serper.dev/search", {
            method: "POST",
            headers: {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ q: serperQuery }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Serper API HTTP error:", response.status, errorText);
            throw new Error(`Serper API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Serper API response received:", data.organic?.length || 0, "results");

        const results = (data.organic || []).map((item: any) => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet,
        }));

        return results;
    } catch (error: any) {
        console.error("Serper API error:", error);
        console.error("Error details:", error.message);
        return [];
    }
}
