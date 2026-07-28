import nodemailer from "nodemailer";
import crypto from "crypto";

const smtpUser = (process.env.GOOGLE_SMTP_USER || "sujalpatel6624@gmail.com").trim();
const smtpPass = (process.env.GOOGLE_SMTP_APP_PASSWORD || "").replace(/\s+/g, "");

// Connection pooling — reuses TCP connections across sends for faster delivery
export const mailTransporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	pool: true,
	maxConnections: 5,
	maxMessages: 100,
	auth: {
		user: smtpUser,
		pass: smtpPass,
	},
	// Timeouts to prevent hanging
	connectionTimeout: 10000,
	greetingTimeout: 10000,
	socketTimeout: 15000,
});

// Professional sender name — much less likely to be flagged as spam
export const mailFrom = `"Unsaid" <${smtpUser}>`;

// Generate a unique Message-ID for each email (helps avoid spam filters flagging duplicates)
export function generateMessageId(): string {
	const uniqueId = crypto.randomBytes(16).toString("hex");
	return `<${uniqueId}@unsaid.app>`;
}
