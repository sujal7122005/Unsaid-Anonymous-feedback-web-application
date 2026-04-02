import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { emailOTP } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import bcrypt from "bcryptjs";
import { sendVerificationMail } from "@/src/helpers/SendVerificationMail";

const client = new MongoClient(process.env.MONGO_URI as string);
const db = client.db();

const authBaseURL =
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: authBaseURL,

    user: {
        modelName: "users",
        fields: {
            emailVerified: "isVerified",
            name: "username",
        },
        additionalFields: {
            isAcceptingMessages: {
                type: "boolean",
                required: false,
                defaultValue: true,
            },
            //  removed messages from here
        },
    },

    // runs after every user creation (email or Google)
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    await db.collection("users").updateOne(
                        { email: user.email },
                        { $set: { 
                            messages: [],              // ✅ proper empty array
                            isAcceptingMessages: true,
                        }}
                    );
                }
            }
        }
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

    database: mongodbAdapter(db, { client }),

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});