import { render } from "@react-email/render";
import { mailFrom, mailTransporter } from "@/src/lib/emailsend";
import EmailVerification from "@/EmailTemplets/EmailVerification";

export const sendVerificationMail = async (
    email: string,
    username: string, 
    verificationcode: string
) => {
    try {
        const html = await render(
            EmailVerification({ username, otp: verificationcode })
        );

        const response = await mailTransporter.sendMail({
            from: mailFrom,
            to: email,
            subject: "Verification Code",
            html,
            text: `Your verification code is: ${verificationcode}`,
        });
        
        console.log("Verification email sent:", response);
        return response;
    } catch (error) {
        console.log("Error sending verification email:", error);
        
        console.error("Error sending verification email:", error);
        throw error;
    }
}