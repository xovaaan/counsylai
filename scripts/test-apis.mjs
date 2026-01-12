// Test script to diagnose API issues
// Run with: node --env-file=.env.local scripts/test-apis.mjs

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SERPER_API_KEY = process.env.SERPER_API_KEY;

console.log("🔍 Testing API Connections...\n");

// Test 1: Gemini API
async function testGemini() {
    console.log("1️⃣ Testing Gemini API");
    console.log("   API Key:", GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : "❌ NOT SET");

    if (!GEMINI_API_KEY) {
        console.log("   ❌ GEMINI_API_KEY is not set\n");
        return false;
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("   Testing with simple prompt...");
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        const text = response.text();

        console.log("   ✅ Gemini API is working!");
        console.log("   Response:", text.substring(0, 50) + "...\n");
        return true;
    } catch (error) {
        console.log("   ❌ Gemini API Error:");
        console.log("   ", error.message);
        if (error.message.includes("API_KEY_INVALID")) {
            console.log("   💡 Your API key is invalid. Get a new one from https://aistudio.google.com/apikey");
        } else if (error.message.includes("quota")) {
            console.log("   💡 You've exceeded your quota. Check https://aistudio.google.com/");
        }
        console.log();
        return false;
    }
}

// Test 2: Serper API
async function testSerper() {
    console.log("2️⃣ Testing Serper API");
    console.log("   API Key:", SERPER_API_KEY ? `${SERPER_API_KEY.substring(0, 10)}...` : "❌ NOT SET");

    if (!SERPER_API_KEY) {
        console.log("   ❌ SERPER_API_KEY is not set\n");
        return false;
    }

    try {
        console.log("   Testing with sample query...");
        const response = await fetch("https://google.serper.dev/search", {
            method: "POST",
            headers: {
                "X-API-KEY": SERPER_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ q: "Bangladesh Contract Act" }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log("   ❌ Serper API Error:");
            console.log("   Status:", response.status);
            console.log("   ", errorText);
            if (response.status === 401) {
                console.log("   💡 Your API key is invalid. Get a new one from https://serper.dev/");
            } else if (response.status === 429) {
                console.log("   💡 Rate limit exceeded. Check your plan at https://serper.dev/");
            }
            console.log();
            return false;
        }

        const data = await response.json();
        console.log("   ✅ Serper API is working!");
        console.log("   Found", data.organic?.length || 0, "results\n");
        return true;
    } catch (error) {
        console.log("   ❌ Serper API Error:");
        console.log("   ", error.message);
        console.log();
        return false;
    }
}

// Run tests
async function runTests() {
    const geminiOk = await testGemini();
    const serperOk = await testSerper();

    console.log("📊 Summary:");
    console.log("   Gemini API:", geminiOk ? "✅ Working" : "❌ Failed");
    console.log("   Serper API:", serperOk ? "✅ Working" : "❌ Failed");

    if (!geminiOk || !serperOk) {
        console.log("\n⚠️  Some APIs are not working. Please fix the issues above.");
        process.exit(1);
    } else {
        console.log("\n✅ All APIs are working correctly!");
    }
}

runTests();
