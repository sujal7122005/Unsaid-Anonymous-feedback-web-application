import connectDB from "@/src/lib/DBConnection";
import UserModel from "@/src/models/user";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";

const starMessageSchema = z.object({
    messageId: z.string().min(1, "Message id is required"),
});

export async function PATCH(request: Request) {
    await connectDB();

    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const userId = session?.user.id;

        if (!session || !userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 },
            );
        }

        const body = await request.json();
        const parsedBody = starMessageSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: parsedBody.error.issues[0]?.message || "Invalid request body",
                },
                { status: 400 },
            );
        }

        const { messageId } = parsedBody.data;

        if (!mongoose.Types.ObjectId.isValid(messageId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid message id",
                },
                { status: 400 },
            );
        }

        const user = await UserModel.findById(userId).select("messages");

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 },
            );
        }

        const message = user.messages.id(messageId);

        if (!message) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Message not found",
                },
                { status: 404 },
            );
        }

        const newStarredState = !message.isStarred;

        await UserModel.updateOne(
            {
                _id: userId,
                "messages._id": new mongoose.Types.ObjectId(messageId),
            },
            {
                $set: {
                    "messages.$.isStarred": newStarredState,
                },
            },
        );

        return NextResponse.json(
            {
                success: true,
                message: newStarredState ? "Message starred" : "Message unstarred",
                isStarred: newStarredState,
            },
            { status: 200 },
        );
    } catch (error) {
        console.log("Error in Star-Message API", error);

        return NextResponse.json(
            {
                success: false,
                message: "Error in Star-Message API",
            },
            { status: 500 },
        );
    }
}
