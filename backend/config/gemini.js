import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

let aiClient = null;

if (apiKey && !apiKey.startsWith("your_")) {
    try {
        aiClient = new GoogleGenAI({ apiKey });
    } catch (err) {
        console.warn("⚠️ Warning: Failed to initialize GoogleGenAI:", err.message);
    }
} else {
    console.warn("⚠️ Warning: GEMINI_API_KEY is missing or contains placeholder in backend/.env. AI analysis features will require this key.");
}

export const getAiClient = () => aiClient;

/**
 * Analyzes code and produces structured feedback via Gemini API.
 */
export const generateCodeAnalysis = async ({
    code,
    language = "cpp",
    problemName = "",
    problemCode = "",
    problemDescription = "",
    verdict = null,
    timeTaken = null,
    memoryUsed = null
}) => {
    const client = getAiClient();
    if (!client) {
        throw new Error(
            "Gemini API key is not configured. Please set GEMINI_API_KEY in your backend/.env file."
        );
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const prompt = `You are an elite competitive programming coach and performance optimization engineer.
Analyze the following competitive programming submission:

Problem Code: ${problemCode || "N/A"}
Problem Title: ${problemName || "N/A"}
Problem Description / Constraints:
${problemDescription || "Not provided"}

User Solution Code (${language}):
\`\`\`${language}
${code}
\`\`\`

Execution Results:
- Verdict: ${verdict || "Not evaluated yet / Pending"}
- Execution Time: ${timeTaken !== null && timeTaken !== undefined ? `${timeTaken} ms` : "N/A"}
- Memory Used: ${memoryUsed !== null && memoryUsed !== undefined ? `${memoryUsed} KB` : "N/A"}

Please provide:
1. High-level summary of the solution's logic, correctness, and efficiency.
2. In-depth verdict diagnosis (e.g. why did it get ${verdict || 'this verdict'}? If WA, what testcase or logic edge case likely failed? If TLE, what is the asymptotic bottleneck? If CE, what failed? If AC, what was done well?).
3. Asymptotic Time & Space complexity for both the user's current code and the theoretical optimal approach for this problem.
4. Key issues, potential pitfalls, and edge cases (e.g. integer overflow, 1-based vs 0-based indexing, large constraints without fast I/O, empty containers).
5. Concrete algorithmic and performance optimizations to make the solution cleaner and faster.
6. A clean, optimized, and thoroughly commented implementation in ${language} demonstrating best practices (e.g., fast I/O, optimal data structures, zero unnecessary copies).
7. Explanation of the suggested code.`;

    const response = await client.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING },
                    verdictDiagnosis: { type: Type.STRING },
                    complexity: {
                        type: Type.OBJECT,
                        properties: {
                            currentTime: { type: Type.STRING },
                            currentSpace: { type: Type.STRING },
                            optimalTime: { type: Type.STRING },
                            optimalSpace: { type: Type.STRING },
                            explanation: { type: Type.STRING }
                        },
                        required: ["currentTime", "currentSpace", "optimalTime", "optimalSpace", "explanation"]
                    },
                    issuesAndEdgeCases: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    optimizations: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                description: { type: Type.STRING }
                            },
                            required: ["title", "description"]
                        }
                    },
                    suggestedCode: { type: Type.STRING },
                    suggestedCodeExplanation: { type: Type.STRING }
                },
                required: [
                    "summary",
                    "verdictDiagnosis",
                    "complexity",
                    "issuesAndEdgeCases",
                    "optimizations",
                    "suggestedCode",
                    "suggestedCodeExplanation"
                ]
            }
        }
    });

    const text = response.text;
    if (!text) {
        throw new Error("Empty response received from Gemini API.");
    }

    return JSON.parse(text);
};
