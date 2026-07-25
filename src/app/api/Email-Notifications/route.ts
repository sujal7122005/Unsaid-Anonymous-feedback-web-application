import connectDB from "@/src/lib/DBConnection";
import { auth } from "@/src/lib/auth";
import UserModel from "@/src/models/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
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
                { status: 401 }
            );
        }

        const user = await UserModel.findById(userId).select("emailNotifications");

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Email notification settings fetched",
                emailNotifications: user.emailNotifications ?? true,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error in Email-Notifications GET API", error);

        return NextResponse.json(
            {
                success: false,
                message: "Error in Email-Notifications GET API",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
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
                { status: 401 }
            );
        }

        const body = await request.json();
        const { emailNotifications } = body;

        if (typeof emailNotifications !== "boolean") {
            return NextResponse.json(
                {
                    success: false,
                    message: "emailNotifications must be a boolean",
                },
                { status: 400 }
            );
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { emailNotifications },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: emailNotifications
                    ? "Email notifications enabled"
                    : "Email notifications disabled",
                emailNotifications: updatedUser.emailNotifications,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error in Email-Notifications POST API", error);

        return NextResponse.json(
            {
                success: false,
                message: "Error in Email-Notifications POST API",
            },
            { status: 500 }
        );
    }
}
