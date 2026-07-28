import { render } from "@react-email/render";
import { mailFrom, mailTransporter, generateMessageId } from "@/src/lib/emailsend";
import NewMessageNotification from "@/EmailTemplets/NewMessageNotification";

interface SendNewMessageNotificationParams {
    recipientEmail: string;
    recipientUsername: string;
    messageContent: string;
    inboxLabel: string;
    appUrl: string;
}

// Retry helper — retries transient SMTP failures (connection drops, timeouts)
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
            // Brief pause before retry (200ms, then 500ms)
            await new Promise((r) => setTimeout(r, attempt * 250));
            console.log(`Email send retry attempt ${attempt + 1}...`);
        }
    }
    throw lastError;
}

export async function sendNewMessageNotification({
    recipientEmail,
    recipientUsername,
    messageContent,
    inboxLabel,
    appUrl,
}: SendNewMessageNotificationParams) {
    try {
        // Truncate message preview to 100 characters
        const messagePreview =
            messageContent.length > 100
                ? messageContent.slice(0, 100) + "..."
                : messageContent;

        const dashboardUrl = `${appUrl}/dashboard`;
        const settingsUrl = `${appUrl}/dashboard`;

        const html = await render(
            NewMessageNotification({
                username: recipientUsername,
                messagePreview,
                inboxLabel,
                dashboardUrl,
            })
        );

        const response = await sendWithRetry({
            from: mailFrom,
            to: recipientEmail,
            subject: `${recipientUsername}, you have a new anonymous message`,
            html,
            text: `Hey ${recipientUsername}, you received a new anonymous message in your ${inboxLabel} inbox: "${messagePreview}" — View it in your dashboard: ${dashboardUrl}`,

            // ── Anti-spam headers ─────────────────────────────────────
            // These headers tell email providers this is a legitimate
            // transactional email and NOT spam.

            messageId: generateMessageId(),

            headers: {
                // List-Unsubscribe: Gmail, Outlook, Yahoo all look for this.
                // Emails WITHOUT this header are much more likely to go to spam.
                "List-Unsubscribe": `<${settingsUrl}>`,
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",

                // Precedence: marks this as transactional (not bulk marketing)
                "Precedence": "bulk",

                // X-Auto-Response-Suppress: prevents auto-replies/out-of-office
                // from being sent back (reduces bounce rate)
                "X-Auto-Response-Suppress": "All",

                // Feedback-ID: helps Gmail categorize and track sender reputation
                "Feedback-ID": `msg-notification:unsaid:${inboxLabel.toLowerCase()}`,
            },

            // Reply-To: professional touch, reduces spam suspicion
            replyTo: `"Unsaid (no-reply)" <${process.env.GOOGLE_SMTP_USER || "sujalpatel6624@gmail.com"}>`,
        });

        console.log("New message notification email sent:", response.messageId);
        return response;
    } catch (error) {
        // Non-blocking: log error but don't throw — email failure should never break message delivery
        console.error("Failed to send new message notification email:", error);
    }
}
