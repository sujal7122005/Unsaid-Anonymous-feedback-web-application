import connectDB from "@/src/lib/DBConnection";
import { checkRateLimit, getRetryAfterSeconds } from "@/src/lib/rate-limit";
import UserModel, { type Message } from "@/src/models/user";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PUBLIC_FEED_LIMIT = 10;
const IP_RATE_LIMIT = { limit: 30, windowMs: 60_000 };
const TOKEN_RATE_LIMIT = { limit: 120, windowMs: 60_000 };

const querySchema = z.object({
  token: z.string().trim().min(1, "Token is required"),
});

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function applyCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Vary", "Origin");
  return response;
}

function rateLimitResponse(message: string, resetAt: number, status = 429) {
  const response = NextResponse.json(
    { success: false, message },
    { status }
  );
  response.headers.set("Retry-After", String(getRetryAfterSeconds(resetAt)));
  return applyCors(response);
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return applyCors(response);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  await connectDB();

  try {
    const { username } = await params;
    const usernameParam = decodeURIComponent(username ?? "").trim();

    if (!usernameParam) {
      return applyCors(
        NextResponse.json(
          { success: false, message: "Username is required" },
          { status: 400 }
        )
      );
    }

    const { searchParams } = new URL(request.url);
    const parsedQuery = querySchema.safeParse({
      token: searchParams.get("token") ?? "",
    });

    if (!parsedQuery.success) {
      return applyCors(
        NextResponse.json(
          {
            success: false,
            message: parsedQuery.error.issues[0]?.message || "Invalid token",
          },
          { status: 400 }
        )
      );
    }

    const clientIp = getClientIp(request);
    const ipRate = checkRateLimit(
      `public-feed:ip:${clientIp}`,
      IP_RATE_LIMIT.limit,
      IP_RATE_LIMIT.windowMs
    );

    if (!ipRate.allowed) {
      return rateLimitResponse("Rate limit exceeded", ipRate.resetAt);
    }

    const escapedUsername = escapeRegex(usernameParam);
    const user = await UserModel.findOne({
      username: { $regex: `^${escapedUsername}$`, $options: "i" },
    }).select("messages publicFeedToken isVerified");

    if (!user || !user.isVerified) {
      return applyCors(
        NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        )
      );
    }

    const { token } = parsedQuery.data;

    if (!user.publicFeedToken || token !== user.publicFeedToken) {
      return applyCors(
        NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        )
      );
    }

    const tokenRate = checkRateLimit(
      `public-feed:token:${token}`,
      TOKEN_RATE_LIMIT.limit,
      TOKEN_RATE_LIMIT.windowMs
    );

    if (!tokenRate.allowed) {
      return rateLimitResponse("Rate limit exceeded", tokenRate.resetAt);
    }

    const messages = user.messages
      .filter((message: Message) => message.inboxType !== "custom")
      .sort(
        (a: Message, b: Message) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, PUBLIC_FEED_LIMIT)
      .map((message: Message) => ({
        id: String(message._id),
        content: message.content,
        createdAt: new Date(message.createdAt).toISOString(),
      }));

    const response = NextResponse.json(
      {
        success: true,
        message: "Public messages fetched",
        username: user.username,
        limit: PUBLIC_FEED_LIMIT,
        messages,
      },
      { status: 200 }
    );

    response.headers.set(
      "Cache-Control",
      "public, max-age=30, stale-while-revalidate=300"
    );

    return applyCors(response);
  } catch (error) {
    console.log("Error in Public messages API", error);

    return applyCors(
      NextResponse.json(
        { success: false, message: "Error in Public messages API" },
        { status: 500 }
      )
    );
  }
}
