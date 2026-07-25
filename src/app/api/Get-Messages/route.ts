import connectDB from "@/src/lib/DBConnection";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import UserModel, { type CustomLink, type Message, type SentimentType } from "@/src/models/user";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";

const VALID_SENTIMENTS: SentimentType[] = ["positive", "constructive", "negative", "neutral"];

const getMessagesQuerySchema = z.object({
    inbox: z.enum(["general", "custom"]).default("general"),
    customLinkId: z.string().optional(),
    starred: z.enum(["true", "false"]).optional(),
    sentiment: z.enum(["positive", "constructive", "negative", "neutral"]).optional(),
});


export async function GET(request: Request){
    await connectDB();

    try {
        const { searchParams } = new URL(request.url);
        const parsedQuery = getMessagesQuerySchema.safeParse({
            inbox: searchParams.get("inbox") ?? undefined,
            customLinkId: searchParams.get("customLinkId") ?? undefined,
            starred: searchParams.get("starred") ?? undefined,
            sentiment: searchParams.get("sentiment") ?? undefined,
        });

        if (!parsedQuery.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: parsedQuery.error.issues[0]?.message || "Invalid query params",
                },
                { status: 400 }
            );
        }

        const { inbox, customLinkId, starred, sentiment } = parsedQuery.data;

        if (inbox === "custom" && !customLinkId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "customLinkId is required for custom inbox",
                },
                { status: 400 }
            );
        }

        if (customLinkId && !mongoose.Types.ObjectId.isValid(customLinkId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid custom link id",
                },
                { status: 400 }
            );
        }
        
        const session = await auth.api.getSession({
            headers: await headers()
        })

        const userId = session?.user.id;

        if(!session || !userId){
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized"
                },
                {status: 401}
            )
        }

        const user = await UserModel.findById(userId).select("messages customLinks");

        if(!user){
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                {status: 404}
            )
        }

        let selectedCustomLink: {
            id: string;
            productName: string;
            slug: string;
        } | null = null;

        if (inbox === "custom" && customLinkId) {
            const customLink = user.customLinks.find(
                (link: CustomLink) => String(link._id) === customLinkId && link.isActive !== false
            );

            if (!customLink || !customLink._id) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Custom link not found",
                    },
                    { status: 404 }
                );
            }

            selectedCustomLink = {
                id: String(customLink._id),
                productName: customLink.productName,
                slug: customLink.slug,
            };
        }

        // Base filter: inbox type
        let baseMessages = user.messages.filter((message: Message) => {
            if (inbox === "general") {
                // Legacy messages without inboxType are treated as general.
                return message.inboxType !== "custom";
            }

            return String(message.customLinkId ?? "") === customLinkId;
        });

        // Compute sentiment summary BEFORE applying sentiment/starred filters
        const sentimentSummary = { positive: 0, constructive: 0, negative: 0, neutral: 0 };
        for (const msg of baseMessages) {
            const s = (msg.sentiment as SentimentType) || "neutral";
            if (VALID_SENTIMENTS.includes(s)) {
                sentimentSummary[s]++;
            } else {
                sentimentSummary.neutral++;
            }
        }

        // Apply starred filter
        if (starred === "true") {
            baseMessages = baseMessages.filter((message: Message) => message.isStarred === true);
        }

        // Apply sentiment filter
        if (sentiment) {
            baseMessages = baseMessages.filter((message: Message) => {
                const msgSentiment = message.sentiment || "neutral";
                return msgSentiment === sentiment;
            });
        }

        const sortedMessages = baseMessages.sort(
            (a: Message, b: Message) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json(
            {
                success: true,
                message: "Messages fetched successfully",
                inbox,
                customLink: selectedCustomLink,
                messages: sortedMessages,
                sentimentSummary,
            },
            {status: 200}
        )

    } catch (error) {
        console.log("Error in Get-Messages API", error);

        return NextResponse.json(
            {
                success: false, 
                message: "Error in Get-Messages API"
            }, 
            {status: 500}
        );
    }
}