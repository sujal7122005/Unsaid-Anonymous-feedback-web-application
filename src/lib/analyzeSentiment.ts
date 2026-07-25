import { GoogleGenerativeAI } from "@google/generative-ai";
import type { SentimentType } from "@/src/models/user";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const VALID_SENTIMENTS: SentimentType[] = ["positive", "constructive", "negative", "neutral"];

export async function analyzeSentiment(content: string): Promise<SentimentType> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are a sentiment classifier for an anonymous feedback platform.

Classify the following message into exactly ONE of these categories:
- positive (appreciation, compliment, encouragement, gratitude)
- constructive (improvement suggestion, respectful critique, actionable advice)
- negative (complaint, frustration, criticism without constructive intent)
- neutral (general observation, question, neither clearly positive nor negative)

Message:
"""
${content}
"""

Rules:
- Return ONLY one word: positive, constructive, negative, or neutral
- No explanation, no punctuation, no extra text
- If uncertain, return neutral`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text().trim().toLowerCase().replace(/[^a-z]/g, "");

        if (VALID_SENTIMENTS.includes(text as SentimentType)) {
            return text as SentimentType;
        }

        // Try to extract a valid sentiment if the model returned extra text
        for (const sentiment of VALID_SENTIMENTS) {
            if (text.includes(sentiment)) {
                return sentiment;
            }
        }

        return "neutral";
    } catch (error) {
        console.log("Sentiment analysis failed, defaulting to neutral:", error);
        return "neutral";
    }
}
