import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/src/lib/emailsend";
import  {sendVerificationMail}  from "@/src/helpers/SendVerificationMail";
import connectDB  from "@/src/lib/DBConnection";
import UserModel from "@/src/models/user";
import bcrypt from "bcryptjs";
import toast from "react-hot-toast";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { username, email, password } = await request.json();

        // Check if user already exists with the same username
        const existingUserWithUsername = await UserModel.findOne({ username, isVerified: true });

        if (existingUserWithUsername) {
            toast.error("Username already exists", { duration: 2000 });
            return NextResponse.json({ error: "Username already exists" }, { status: 400 });
        }

        // Check if user already exists with the same email
        const verificationcode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationcodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // Code expires in 60 minutes

        const existingUserWithEmail = await UserModel.findOne({ email });

        if (existingUserWithEmail) {
            if (existingUserWithEmail && existingUserWithEmail.isVerified) {
                toast.error("Email already exists", { duration: 2000 });
                return NextResponse.json({ error: "Email already exists" }, { status: 400 });
            } else {
                // If user exists but is not verified, update the existing user
                await UserModel.findByIdAndUpdate(existingUserWithEmail._id, {
                    username,
                    password: hashedPassword,
                    verificationcode,
                    verificationcodeExpiry
                });
            }
        } else {
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verificationcode,
                verificationcodeExpiry,
                isVerified: false,
                isAcceptingMessages: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                messages: []
            }).save();
            toast.success("User created successfully", { duration: 2000 });
            return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
        }

        // Send verification email
        const emailResponse = await sendVerificationMail(email,username, verificationcode);

        if (emailResponse.error) {
            toast.error("Failed to send verification email", { duration: 2000 });
            return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
        }

        return NextResponse.json({ message: "User created successfully. Verification email sent." }, { status: 201 });

    } catch (error) {
        toast.error("Error creating user", { duration: 2000 });
        console.log("Error creating user", error);
        return NextResponse.json({ error: "Error creating user" }, { status: 500 });
        
    }
}