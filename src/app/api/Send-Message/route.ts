import connectDB from "@/src/lib/DBConnection";
import { NextResponse } from "next/server";
import UserModel, { type CustomLink } from "@/src/models/user";
import { signupSchema } from "@/src/velidationSchemas/signupSchemaVelidation";
import { messageSchema } from "@/src/velidationSchemas/messageSchema";
import { analyzeSentiment } from "@/src/lib/analyzeSentiment";
import { sendNewMessageNotification } from "@/src/helpers/SendNewMessageNotification";
import mongoose from "mongoose";
import { z } from "zod";

const sendMessageBodySchema = z.object({
    username: signupSchema.shape.username,
    content: messageSchema.shape.content,
    customLinkSlug: z.string().trim().min(1).max(100).optional(),
});

function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getAppUrl(): string {
    if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
        return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
    }
    if (process.env.BETTER_AUTH_URL) {
        return process.env.BETTER_AUTH_URL;
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return "http://localhost:3000";
}

export async function POST(request: Request){
    await connectDB();

    try {
        const body = await request.json();
        const parsedBody = sendMessageBodySchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: parsedBody.error.issues[0]?.message || "Invalid request body",
                },
                { status: 400 }
            );
        }

        const username = parsedBody.data.username.trim();
        const content = parsedBody.data.content.trim();
        const customLinkSlug = parsedBody.data.customLinkSlug?.trim().toLowerCase();

        const escapedUsername = escapeRegex(username);

        const user = await UserModel.findOne({
            username: { $regex: `^${escapedUsername}$`, $options: "i" },
        });

        if (!user || !user.isVerified) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        if(!user.isAcceptingMessages){
            return NextResponse.json(
                {
                    success: false,
                    message: "User is not accepting messages"
                },
                {status: 400}
            )
        }

        let inboxType: "general" | "custom" = "general";
        let customLinkId: mongoose.Types.ObjectId | null = null;
        let inboxLabel = "GENERAL";

        if (customLinkSlug) {
            const selectedCustomLink = user.customLinks?.find(
                (link: CustomLink) => link.isActive !== false && link.slug === customLinkSlug
            );

            if (!selectedCustomLink || !selectedCustomLink._id) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Custom link not found",
                    },
                    { status: 404 }
                );
            }

            inboxType = "custom";
            customLinkId = selectedCustomLink._id;
            inboxLabel = selectedCustomLink.productName.toUpperCase();
        }

        const newMessage = {
            content,
            createdAt: new Date(),
            inboxType,
            customLinkId,
            sentiment: "neutral" as const,
            isStarred: false,
        };

        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: user._id },
            { $push: { messages: newMessage } },
            { new: true }
        );

        // Get the ID of the newly pushed message
        const savedMessage = updatedUser?.messages?.[updatedUser.messages.length - 1];
        const savedMessageId = savedMessage?._id;

        // Return response immediately — background tasks run async
        const response = NextResponse.json(
            {
                success: true,
                message: "Message sent successfully",
                newMessage
            },
            {status: 200}
        );

        // Fire background tasks (non-blocking)
        // 1. Sentiment analysis — updates the message in DB
        // 2. Email notification — sends email to recipient
        const backgroundTasks: Promise<unknown>[] = [];

        // Sentiment analysis task
        if (savedMessageId) {
            backgroundTasks.push(
                analyzeSentiment(content).then(async (sentiment) => {
                    if (sentiment !== "neutral") {
                        await UserModel.updateOne(
                            {
                                _id: user._id,
                                "messages._id": savedMessageId,
                            },
                            {
                                $set: { "messages.$.sentiment": sentiment },
                            }
                        );
                    }
                }).catch((error) => {
                    console.log("Background sentiment analysis failed:", error);
                })
            );
        }

        // Email notification task
        if (user.emailNotifications !== false && user.email) {
            backgroundTasks.push(
                sendNewMessageNotification({
                    recipientEmail: user.email,
                    recipientUsername: user.username,
                    messageContent: content,
                    inboxLabel,
                    appUrl: getAppUrl(),
                }).catch((error) => {
                    console.log("Background email notification failed:", error);
                })
            );
        }

        // Don't await — let them run in background
        if (backgroundTasks.length > 0) {
            Promise.allSettled(backgroundTasks).catch(() => {
                // Silently catch any unexpected errors
            });
        }

        return response;
        
    } catch (error) {
        console.log("Error in Send-Message API", error);

        const errorMessage =
            error instanceof Error ? error.message : "Error in Send-Message API";

        return NextResponse.json(
            {
                success: false, 
                message: errorMessage
            }, 
            {status: 500}
        );
    }
}
