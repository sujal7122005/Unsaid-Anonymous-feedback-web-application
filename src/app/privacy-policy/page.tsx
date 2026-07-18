import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, Mail, ShieldCheck, Sparkles, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Unsaid",
  description:
    "Learn what data Unsaid collects, what is not collected, and how retention and deletion are handled.",
};

const collectedData = [
  "Account details: username, email address, encrypted password hash, verification status.",
  "Message data: anonymous message content and message creation timestamp.",
  "Security metadata: OTP verification flow details and account preference settings such as message acceptance mode.",
  "Technical logs: basic server and platform diagnostics used for security and reliability.",
];

const notCollected = [
  "Unsaid does not ask anonymous senders for name or email when sending a message.",
  "Unsaid does not provide recipient email addresses to anonymous senders.",
  "Unsaid does not collect payment card data because no card-based billing is currently used.",
];

const retentionPolicy = [
  "Anonymous messages remain in recipient inbox until deleted by the account owner.",
  "Email verification OTP codes expire in around 10 minutes.",
  "Account records remain active until account deletion is requested and completed.",
  "Users can request account and related data deletion by contacting support.",
];

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-[#131313] px-4 py-12 sm:px-6 lg:px-10">
      <main className="relative mx-auto max-w-6xl space-y-12">
        <section className="rounded-[20px] border border-[#313131] bg-[#131313] p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-[2px] border border-[#3cffd0] bg-transparent px-3 py-1 font-mono-caps text-[10px] text-[#3cffd0]">
            <Sparkles className="h-3.5 w-3.5" />
            PRIVACY POLICY
          </div>

          <h1 className="mt-6 font-display text-[60px] sm:text-[80px] uppercase text-white leading-[0.9]">
            YOUR PRIVACY MATTERS AT EVERY STEP.
          </h1>

          <p className="mt-6 max-w-3xl font-sans text-[18px] leading-relaxed text-white">
            This page explains what data Unsaid collects, what data is not collected, and how retention and deletion are handled.
            The policy is written to match the current behavior of the platform.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 font-mono-caps text-[12px] text-[#3cffd0]">
            <Clock3 className="h-4 w-4" />
            LAST UPDATED: APRIL 8, 2026
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
            <p className="font-mono-caps text-[12px] text-[#949494]">WHAT WE COLLECT</p>
            <h2 className="mt-2 font-display text-[40px] uppercase text-white leading-[0.9]">DATA COLLECTED TO OPERATE UNSAID</h2>
            <div className="mt-8 space-y-3">
              {collectedData.map((item) => (
                <div
                  key={item}
                  className="rounded-[2px] border border-[#313131] bg-[#131313] px-5 py-4 font-sans text-[16px] text-white"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
            <p className="font-mono-caps text-[12px] text-[#949494]">WHAT WE DO NOT COLLECT</p>
            <h2 className="mt-2 font-display text-[40px] uppercase text-white leading-[0.9]">IDENTITY AND PAYMENT LIMITS</h2>
            <div className="mt-8 space-y-3">
              {notCollected.map((item) => (
                <div
                  key={item}
                  className="rounded-[2px] border border-[#313131] bg-[#131313] px-5 py-4 font-sans text-[16px] text-white"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
            <p className="font-mono-caps text-[12px] text-[#949494]">RETENTION AND DELETION</p>
            <h2 className="mt-2 font-display text-[40px] uppercase text-white leading-[0.9]">HOW LONG DATA IS KEPT</h2>
            <div className="mt-8 space-y-3">
              {retentionPolicy.map((item) => (
                <div
                  key={item}
                  className="rounded-[2px] border border-[#313131] bg-[#131313] px-5 py-4 font-sans text-[16px] text-white"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
            <div className="inline-flex text-[#3cffd0]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-[30px] uppercase text-white leading-[0.9]">NEED A DELETION REQUEST</h3>
            <p className="mt-4 font-sans text-[16px] leading-relaxed text-[#949494]">
              Send an email from your registered account address so we can verify ownership before processing sensitive requests.
            </p>

            <a
              href="mailto:sujalpatel6624@gmail.com?subject=Unsaid%20Data%20Deletion%20Request"
              className="mt-8 dark-slate-pill h-12 px-6 flex flex-wrap items-center justify-center gap-2 w-full text-center"
            >
              <Mail className="h-4 w-4" />
              SUJALPATEL6624@GMAIL.COM
            </a>

            <div className="mt-8 rounded-[2px] border border-[#313131] bg-[#131313] p-5 font-mono-caps text-[11px] text-[#949494]">
              <div className="inline-flex items-center gap-1.5 text-[#3cffd0] mb-2">
                <Trash2 className="h-3.5 w-3.5" />
                DELETION SCOPE
              </div>
              <p className="leading-relaxed">
                Account deletion request removes account access and associated profile data from active use systems, subject to legal and security obligations.
              </p>
            </div>
          </aside>
        </section>

        <section className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/terms-of-service"
              className="jelly-mint-pill h-12 px-6 flex items-center justify-center gap-2"
            >
              READ TERMS OF SERVICE
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/faq"
              className="dark-slate-pill h-12 px-6 flex items-center justify-center gap-2"
            >
              GO TO FAQ
              <BadgeCheck className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
