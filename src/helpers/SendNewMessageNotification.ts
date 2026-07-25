import { render } from "@react-email/render";
import { mailFrom, mailTransporter } from "@/src/lib/emailsend";
import NewMessageNotification from "@/EmailTemplets/NewMessageNotification";

interface SendNewMessageNotificationParams {
    recipientEmail: string;
    recipientUsername: string;
    messageContent: string;
    inboxLabel: string;
    appUrl: string;
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

        const html = await render(
            NewMessageNotification({
                username: recipientUsername,
                messagePreview,
                inboxLabel,
                dashboardUrl,
            })
        );

        const response = await mailTransporter.sendMail({
            from: mailFrom,
            to: recipientEmail,
            subject: "New anonymous message on Unsaid",
            html,
            text: `Hey ${recipientUsername}, you received a new anonymous message in your ${inboxLabel} inbox: "${messagePreview}" — View it in your dashboard: ${dashboardUrl}`,
        });

        console.log("New message notification email sent:", response.messageId);
        return response;
    } catch (error) {
        // Non-blocking: log error but don't throw — email failure should never break message delivery
        console.error("Failed to send new message notification email:", error);
    }
}
