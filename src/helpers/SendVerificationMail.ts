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
            subject: "UnSeen Verification Code",
            react: EmailVerification({ username, otp: verificationcode }),
        });
        toast.success("Verification email sent successfully", { duration: 2000 });
        console.log("Verification email sent:", response);
        return response;
    } catch (error) {
        toast.error("Failed to send verification email", { duration: 2000 });
        console.error("Error sending verification email:", error);
        throw error;
    }
}