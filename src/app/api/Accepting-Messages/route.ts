import UserModel from "@/src/models/user";
import connectDB from "@/src/lib/DBConnection";
import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request){
    await connectDB();
    
    try {
        const {acceptingMessages} = await request.json();

        const session = await auth.api.getSession({
            headers: await headers()
        })

        const userId = session?.user.id;

        if(!userId && !session){
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized"
                },
                {status: 401}
            )
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            {isAcceptingMessages : acceptingMessages}, 
            {new: true}
        )
        
        if(!updatedUser){
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to update user"
                },
                {status: 500}
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "User updated successfully",
                userData: updatedUser
            },
            {status: 200}
        )

    } catch (error) {
        console.log("Error in Accepting-Messages API", error);

        return NextResponse.json(
            {
                success: false, 
                message: "Error in Accepting-Messages API"
            }, 
            {status: 500}
        );
    }
}

export async function GET(request: Request){
    await connectDB();

    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        const userId = session?.user.id;

        if(!userId && !session){
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized"
                },
                {status: 401}
            )
        }

        const user = await UserModel.findById(userId);

        if(!user){
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                {status: 404}
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "User fetched successfully",
                isAcceptingMessages: user.isAcceptingMessages,
            },
            {status: 200}
        )
    } catch (error) {
        console.log("Error in Accepting-Messages API", error);

        return NextResponse.json(
            {
                success: false, 
                message: "Error in Accepting-Messages API"
            }, 
            {status: 500}
        );
    }
}
