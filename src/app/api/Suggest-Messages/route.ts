import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ----- In-memory cache to avoid hitting the API on every request -----
let cachedSuggestions: string[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION_MS = 1 * 60 * 1000; // 1 minute

// ----- Quota cooldown: skip API calls after a 429 error -----
let quotaExhaustedAt = 0;
const QUOTA_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes cooldown after 429

// ----- Fallback suggestions when API quota is exhausted -----
const FALLBACK_SUGGESTIONS = [
  "One thing I genuinely admire about you is how respectfully you speak, even during disagreement.",
  "You come across as confident and thoughtful, and your ideas usually make people think deeper.",
  "You explain complex things clearly, which makes collaborating with you much easier.",
  "A small improvement: try listening fully before replying; it could make your conversations even stronger.",
  "You are consistent and reliable, but delegating more could reduce your stress and improve outcomes.",
  "Your creativity stands out; sharing your process more often could inspire others.",
  "You have strong leadership energy; clearer priorities could make team alignment even better.",
  "I appreciate your honesty; balancing directness with warmth may help people receive feedback more openly.",
  "You motivate people naturally; checking in on quieter members could make your impact even bigger.",
  "Your work quality is strong; submitting a little earlier could reduce last-minute pressure.",
  "You are easy to trust; protecting your time boundaries might help your energy stay consistent.",
  "You communicate clearly in writing; adding concrete examples could make your points even more convincing.",
  "I admire your discipline; celebrating small wins might help you stay motivated long-term.",
  "You bring positive energy to the room and make teamwork smoother for everyone.",
  "Your curiosity is a strength; asking one extra follow-up question could unlock better insights.",
  "You are approachable and kind, which makes people comfortable sharing honest thoughts.",
  "What is one habit you could improve this month that would most positively affect your goals?",
  "What feedback do you hear repeatedly that feels true but is still hard to act on?",
  "What personal strength do you underestimate that others probably notice immediately?",
  "If you could improve one communication habit this week, which one would create the biggest change?",
  "Your resilience is impressive; taking intentional rest could help you sustain that performance longer.",
  "You are detail-oriented; stepping back to highlight the big picture might strengthen your influence.",
  "I appreciate how accountable you are; mentoring someone newer could amplify your strengths.",
  "You handle pressure well; asking for help sooner might prevent unnecessary burnout.",
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
  for (let i = availableIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableIndices[i], availableIndices[j]] = [
      availableIndices[j],
      availableIndices[i],
    ];
  }
  const pickedIndices = availableIndices.slice(0, 3);

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
          message: "Using suggested messages (AI quota cooling down)",
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

    const prompt = `You are writing suggestion messages for an anonymous feedback platform called Unsaid.

Goal:
- Generate exactly 3 high-quality anonymous feedback suggestions that a sender can submit directly.
- Suggestions must feel natural, respectful, and useful for personal growth.

Content requirements:
- Keep each suggestion between 12 and 24 words.
- Use clear, everyday language.
- Include this mix:
  1) One appreciation-style feedback message.
  2) One constructive improvement message.
  3) One reflective question message.
- Focus on themes like communication, attitude, consistency, collaboration, leadership, or self-improvement.

Safety and quality rules:
- No hate, harassment, bullying, explicit content, profanity, or violent language.
- No requests for personal data, money, passwords, addresses, or contact details.
- No political, medical, legal, or extremist topics.
- Avoid generic small-talk prompts (travel, movies, dinner with celebrities, etc.).

Formatting rules (strict):
- Return only one line.
- Separate the 3 suggestions with ||
- No numbering, bullets, emojis, surrounding quotes, labels, or extra explanation.

Output format:
message one||message two||message three`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the model output and normalize common formatting noise.
    const suggestions = text
      .split(/\|\||\n+/)
      .map((s) => s.trim())
      .map((s) => s.replace(/^[-*\d.)\s"'`]+/, ""))
      .filter((s) => s.length > 0)
      .slice(0, 3);

    if (suggestions.length < 3) {
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
            "AI quota exceeded — showing suggested messages. Fresh AI suggestions will be available later.",
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
