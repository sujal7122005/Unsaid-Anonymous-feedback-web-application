import { render } from "@react-email/render";
import { mailFrom, mailTransporter, generateMessageId } from "@/src/lib/emailsend";
import EmailVerification from "@/EmailTemplets/EmailVerification";

// Retry helper — retries transient SMTP failures
async function sendWithRetry(
    mailOptions: Parameters<typeof mailTransporter.sendMail>[0],
    maxRetries: number = 2
) {
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        try {
            return await mailTransporter.sendMail(mailOptions);
        } catch (error: unknown) {
            lastError = error;
            const isTransient =
                error instanceof Error &&
                (error.message.includes("ECONNRESET") ||
                    error.message.includes("ETIMEDOUT") ||
                    error.message.includes("ESOCKET") ||
                    error.message.includes("connection") ||
                    error.message.includes("timeout"));

            if (!isTransient || attempt > maxRetries) {
                throw error;
            }
            await new Promise((r) => setTimeout(r, attempt * 250));
            console.log(`Verification email retry attempt ${attempt + 1}...`);
        }
    }
    throw lastError;
}

export const sendVerificationMail = async (
    email: string,
    username: string, 
    verificationcode: string
) => {
    try {
        const html = await render(
            EmailVerification({ username, otp: verificationcode })
        );

        const response = await sendWithRetry({
            from: mailFrom,
            to: email,
            subject: `${verificationcode} is your Unsaid verification code`,
            html,
            text: `Your verification code is: ${verificationcode}`,

            // ── Anti-spam headers ─────────────────────────────────────
            messageId: generateMessageId(),

            headers: {
                // Precedence: transactional, not marketing
                "Precedence": "bulk",
                "X-Auto-Response-Suppress": "All",
                "Feedback-ID": "verification:unsaid",
            },
        });
        
        console.log("Verification email sent:", response.messageId);
        return response;
    } catch (error) {
        console.log("Error sending verification email:", error);
        
        console.error("Error sending verification email:", error);
        throw error;
    }
}