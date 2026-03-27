import connectDB from "@/src/lib/DBConnection";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import UserModel from "@/src/models/user";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


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

        const user = await UserModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(userId)}},
            {$unwind: "$messages"},
            {$sort: { "messages.createdAt": -1 }},
            {$group: { _id: "$_id", messages: { $push: "$messages" } }}
        ])

        if(!user || user.length === 0){
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
                message: "Messages fetched successfully",
                messages: user[0].messages,
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