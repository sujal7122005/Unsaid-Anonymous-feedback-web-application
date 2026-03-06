import { resend } from "@/src/lib/emailsend";
import EmailVerification from "@/EmailTemplets/EmailVerification";
import toast from 'react-hot-toast';

export const sendVerificationMail = async (
    email: string,
    username: string, 
    verificationcode: string
) => {
    try {
        const response = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Verification Code",
            react: EmailVerification({ username, otp: verificationcode }),
        });
        
        console.log("Verification email sent:", response);
        return response;
    } catch (error) {
        console.log("Error sending verification email:", error);
        
        console.error("Error sending verification email:", error);
        throw error;
    }
}