import connectDB from "@/src/lib/DBConnection";
import UserModel from "@/src/models/user";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";

const deleteMessageSchema = z.object({
    messageId: z.string().min(1, "Message id is required"),
});

export async function DELETE(request: Request) {
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
        const parsedBody = deleteMessageSchema.safeParse(body);

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

        const updatedUser = await UserModel.findOneAndUpdate(
            {
                _id: userId,
                "messages._id": new mongoose.Types.ObjectId(messageId),
            },
            {
                $pull: {
                    messages: { _id: new mongoose.Types.ObjectId(messageId) },
                },
            },
            { new: false },
        );

        if (!updatedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Message not found",
                },
                { status: 404 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Message deleted successfully",
            },
            { status: 200 },
        );
    } catch (error) {
        console.log("Error in Delete-Message API", error);

        return NextResponse.json(
            {
                success: false,
                message: "Error in Delete-Message API",
            },
            { status: 500 },
        );
    }
}