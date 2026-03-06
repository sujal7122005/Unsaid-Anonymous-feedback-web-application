import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { emailOTP } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import bcrypt from "bcryptjs";
import { sendVerificationMail } from "@/src/helpers/SendVerificationMail";

const client = new MongoClient(process.env.MONGO_URI as string);
const db = client.db();

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,

    user: {
        modelName: "users", // mongoose "User" model → "users" collection
        fields: {
            emailVerified: "isVerified", 
            name: "username",            
        },
        additionalFields: {
        verificationcode: {
            type: "string",
            required: false,
        },
        verificationcodeExpiry: {
            type: "date",
            required: false,
        },
        isAcceptingMessages: {
            type: "boolean",
            required: false,
            defaultValue: true,
        },
    },
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "email-verification") {
                    await sendVerificationMail(email, email, otp);
                }
            },
            otpLength: 6,
            expiresIn: 600,
        })
    ],

    emailAndPassword: { 
    enabled: true, 
    password: {
            hash: (password) => bcrypt.hash(password, 10),      
            verify: ({ password, hash }) => bcrypt.compare(password, hash) 
        }
    },
    database: mongodbAdapter(db, {
        // Optional: if you don't provide a client, database transactions won't be enabled.
        client
    }),


    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

});