import { createAuthClient } from "better-auth/react"
import { emailOTPClient } from "better-auth/client/plugins"

const clientBaseURL =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

export const authClient = createAuthClient({
    plugins: [
        emailOTPClient()
    ],
    baseURL: clientBaseURL
})

// const signIn = async () => {
//   const data = await authClient.signIn.social({
//     provider: "google",
//   });
// };