import nodemailer from "nodemailer";

const smtpUser = (process.env.GOOGLE_SMTP_USER || "sujalpatel6624@gmail.com").trim();
const smtpPass = (process.env.GOOGLE_SMTP_APP_PASSWORD || "").replace(/\s+/g, "");

export const mailTransporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: smtpUser,
		pass: smtpPass,
	},
});

export const mailFrom = "sujalpatel6624@gmail.com";

