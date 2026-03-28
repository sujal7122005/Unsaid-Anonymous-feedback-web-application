import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ----- In-memory cache to avoid hitting the API on every request -----
let cachedSuggestions: string[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// ----- Quota cooldown: skip API calls after a 429 error -----
let quotaExhaustedAt = 0;
const QUOTA_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes cooldown after 429

// ----- Fallback suggestions when API quota is exhausted -----
const FALLBACK_SUGGESTIONS = [
  "What's a hobby you've recently started that you're excited about?",
  "If you could have dinner with any historical figure, who would it be and why?",
  "What's a simple thing that never fails to make you happy?",
  "If you could instantly master any skill in the world, what would you choose?",
  "What's a movie or book that completely changed your perspective on life?",
  "If you could travel anywhere in the world tomorrow, where would you go?",
  "What's the best piece of advice someone has ever given you?",
  "What's one thing you're genuinely looking forward to this week?",
  "If you could relive one perfect day from your past, which would it be?",
  "What's a small act of kindness that someone did for you that you'll never forget?",
  "What's a song that always puts you in a good mood no matter what?",
  "If you could live in any era of history, which would you pick and why?",
  "What's a goal you're quietly working toward right now?",
  "If you could give your younger self one piece of advice, what would it be?",
  "What's something you've learned recently that genuinely surprised you?",
  "If your life had a theme song, what would it be?",
  "What's a tradition or ritual you have that means a lot to you?",
  "If you could switch lives with anyone for a day, who would it be?",
  "What's the most underrated thing about your personality that people don't notice?",
  "If you had an extra hour every day, how would you spend it?",
];

// Track previously served fallback suggestions to avoid repeats
let lastServedIndices: number[] = [];

function getRandomFallback(): string[] {
  // Get indices that haven't been served recently
  const availableIndices = FALLBACK_SUGGESTIONS.map((_, i) => i).filter(
    (i) => !lastServedIndices.includes(i)
  );

  // If not enough available, reset the tracker (all have been served)
  if (availableIndices.length < 3) {
    lastServedIndices = [];
    return getRandomFallback();
  }

  // Shuffle available indices and pick 3
  const shuffled = availableIndices.sort(() => Math.random() - 0.5);
  const pickedIndices = shuffled.slice(0, 3);

  // Track the served indices
  lastServedIndices.push(...pickedIndices);

  return pickedIndices.map((i) => FALLBACK_SUGGESTIONS[i]);
}

export async function POST() {
  try {
    // 1) If quota was recently exhausted, skip the API call entirely
    if (quotaExhaustedAt && Date.now() - quotaExhaustedAt < QUOTA_COOLDOWN_MS) {
      return NextResponse.json(
        {
          success: true,
          message: "Using suggested questions (AI quota cooling down)",
          suggestions: getRandomFallback(),
        },
        { status: 200 }
      );
    }

    // 2) Return cached suggestions if still fresh
    if (cachedSuggestions && Date.now() - cacheTimestamp < CACHE_DURATION_MS) {
      return NextResponse.json(
        {
          success: true,
          message: "Suggestions fetched from cache",
          suggestions: cachedSuggestions,
        },
        { status: 200 }
      );
    }

    // 3) Call Gemini API (gemini-2.0-flash-lite has higher free-tier limits)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the '||' separated string from the response
    const suggestions = text
      .split("||")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (suggestions.length === 0) {
      throw new Error("Failed to parse suggestions from AI response");
    }

    // Cache the result
    cachedSuggestions = suggestions;
    cacheTimestamp = Date.now();

    // Reset quota cooldown on success
    quotaExhaustedAt = 0;

    return NextResponse.json(
      {
        success: true,
        message: "Suggestions generated successfully",
        suggestions,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log("Error in Suggest-Messages API", error);

    // On quota errors, activate cooldown and return fallback suggestions
    if (error instanceof Error && error.message.includes("429")) {
      quotaExhaustedAt = Date.now(); // Start cooldown — no more API calls for 1 hour

      return NextResponse.json(
        {
          success: true,
          message:
            "AI quota exceeded — showing suggested questions. Fresh AI suggestions will be available later.",
          suggestions: getRandomFallback(),
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error generating suggestions",
      },
      { status: 500 }
    );
  }
}
