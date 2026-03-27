import connectDB from "@/src/lib/DBConnection";
import { NextResponse } from "next/server";
import UserModel from "@/src/models/user";
import { Message } from "@/src/models/user";

export async function POST(request: Request){
    await connectDB();

    try {
        const { username, content } = await request.json();

        const user = await UserModel.findOne({username});

        if(!user){
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                {status: 404}
            )
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

        user.messages.push(newMessage as Message);
        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "Message sent successfully",
                user,
                newMessage
            },
            {status: 200}
        )
        
    } catch (error) {
        console.log("Error in Send-Message API", error);

        return NextResponse.json(
            {
                success: false, 
                message: "Error in Send-Message API"
            }, 
            {status: 500}
        );
    }
}
    
