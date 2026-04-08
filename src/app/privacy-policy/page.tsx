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
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-b from-slate-50 via-zinc-50 to-slate-100 px-4 py-8 sm:px-6 lg:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-8 top-16 h-52 w-52 rounded-full bg-cyan-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-28 h-48 w-48 rounded-full bg-amber-200/35 blur-3xl"
      />

      <main className="relative mx-auto max-w-6xl space-y-6">
        <section className="animate-in fade-in-0 slide-in-from-top-3 duration-700 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-slate-600 uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Privacy Policy
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Your privacy matters at every step.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            This page explains what data Unsaid collects, what data is not collected, and how retention and deletion are handled.
            The policy is written to match the current behavior of the platform.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 sm:text-sm">
            <Clock3 className="h-4 w-4" />
            Last updated: April 8, 2026
          </div>
        </section>

        <section className="animate-in fade-in-0 slide-in-from-bottom-3 duration-700 grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">What we collect</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Data collected to operate Unsaid</h2>
            <div className="mt-5 space-y-3">
              {collectedData.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">What we do not collect</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Identity and payment limits</h2>
            <div className="mt-5 space-y-3">
              {notCollected.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">Retention and deletion</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">How long data is kept</h2>
            <div className="mt-5 space-y-3">
              {retentionPolicy.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-2 text-slate-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-lg font-extrabold text-slate-900">Need a deletion request</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Send an email from your registered account address so we can verify ownership before processing sensitive requests.
            </p>

            <a
              href="mailto:sujalpatel6624@gmail.com?subject=Unsaid%20Data%20Deletion%20Request"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-px hover:border-slate-300 hover:shadow-md"
            >
              <Mail className="h-4 w-4" />
              sujalpatel6624@gmail.com
            </a>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
              <div className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                <Trash2 className="h-3.5 w-3.5" />
                Deletion Scope
              </div>
              <p className="mt-1 leading-relaxed">
                Account deletion request removes account access and associated profile data from active use systems, subject to legal and security obligations.
              </p>
            </div>
          </aside>
        </section>

        <section className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/terms-of-service"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-px hover:bg-black hover:shadow-lg"
            >
              Read Terms of Service
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-px hover:border-slate-300 hover:shadow-md"
            >
              Open FAQ
              <BadgeCheck className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
