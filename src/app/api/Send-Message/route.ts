import connectDB from "@/src/lib/DBConnection";
import { NextResponse } from "next/server";
import UserModel from "@/src/models/user";
import { signupSchema } from "@/src/velidationSchemas/signupSchemaVelidation";
import { messageSchema } from "@/src/velidationSchemas/messageSchema";
import { z } from "zod";

const sendMessageBodySchema = z.object({
    username: signupSchema.shape.username,
    content: messageSchema.shape.content,
});

function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

        const newMessage = { content, createdAt: new Date() };

        await UserModel.findOneAndUpdate(
            { _id: user._id },
            { $push: { messages: newMessage } },
            { new: false }
        );

        return NextResponse.json(
            {
                success: true,
                message: "Message sent successfully",
                newMessage
            },
            {status: 200}
        )
        
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
    
