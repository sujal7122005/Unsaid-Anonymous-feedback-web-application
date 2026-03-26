import UserModel from "@/src/models/user";
import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/src/lib/DBConnection";
import { signupSchema } from "@/src/velidationSchemas/signupSchemaVelidation";

const CheckUsernameSchema = z.object({
    // Reuse the username field validation from the signup schema.
    username: signupSchema.shape.username,
});


export async function GET(request: Request) {
    await connectDB();

    try {
        const { searchParams } = new URL(request.url);

        const queryParam = {
            username: searchParams.get("username") || "",
        };

        const parsed = CheckUsernameSchema.safeParse(queryParam);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid username format" }, { status: 400 });
        }

        const { username } = parsed.data;

        const existingUser = await UserModel.findOne({ username, isVerified: true });

        if (existingUser) {
            return NextResponse.json(
                { isUnique: false, message: "Username is already taken" },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { isUnique: true, message: "Username is available" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error checking username:", error);
        return NextResponse.json({ error: "Error checking username" }, { status: 500 });
    }
}