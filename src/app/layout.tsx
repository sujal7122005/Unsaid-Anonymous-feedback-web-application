import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import NavBar from "../components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UnSaid - Anonumous Messaging Platform",
  icons: {
    icon: [{ url: "/unsaid-logo.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/unsaid-logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/unsaid-logo.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar />
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
