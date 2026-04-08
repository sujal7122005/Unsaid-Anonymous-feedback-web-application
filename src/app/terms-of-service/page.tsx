import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Mail, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Unsaid",
  description:
    "Review acceptable use, account rules, and service terms for using Unsaid.",
};

const acceptableUseRules = [
  "Do not use Unsaid for harassment, hate speech, threats, or targeted abuse.",
  "Do not impersonate another person or organization.",
  "Do not post unlawful, deceptive, or intentionally harmful content.",
  "Do not attempt unauthorized access, scraping abuse, or service disruption.",
];

const accountRules = [
  "Users are responsible for account credentials and login security.",
  "Account creation requires accurate information and email verification.",
  "Users must follow local laws and all platform rules while using the service.",
  "Unsaid may suspend or remove accounts that violate these terms.",
];

export default function TermsOfServicePage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-b from-slate-50 via-zinc-50 to-slate-100 px-4 py-8 sm:px-6 lg:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-8 top-20 h-52 w-52 rounded-full bg-cyan-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-36 h-48 w-48 rounded-full bg-amber-200/35 blur-3xl"
      />

      <main className="relative mx-auto max-w-6xl space-y-6">
        <section className="animate-in fade-in-0 slide-in-from-top-3 duration-700 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-slate-600 uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Terms of Service
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Platform rules for safe and fair use.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            By using Unsaid, you agree to these terms. They define acceptable use, account responsibility, and the rights
            that protect both users and the platform.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 sm:text-sm">
            <BadgeCheck className="h-4 w-4" />
            Effective date: April 8, 2026
          </div>
        </section>

        <section className="animate-in fade-in-0 slide-in-from-bottom-3 duration-700 grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">Acceptable use</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">What is not allowed</h2>
            <div className="mt-5 space-y-3">
              {acceptableUseRules.map((rule) => (
                <div
                  key={rule}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {rule}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">Accounts</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">User responsibilities</h2>
            <div className="mt-5 space-y-3">
              {accountRules.map((rule) => (
                <div
                  key={rule}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">Enforcement and legal</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">How terms are applied</h2>

            <div className="mt-5 space-y-3 text-sm leading-relaxed text-slate-700">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                Unsaid can remove content, restrict features, or suspend accounts when platform rules are violated.
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                Service availability may change over time. Features can be updated, paused, or discontinued to maintain quality and security.
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                Unsaid is provided on an as-is basis. To the maximum extent allowed by law, liability is limited for indirect or consequential losses.
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                Terms may be updated as the product evolves. Continued use after updates means acceptance of revised terms.
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-2 text-slate-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-lg font-extrabold text-slate-900">Questions about these terms</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Contact the support email for legal or policy clarification requests.
            </p>

            <a
              href="mailto:sujalpatel6624@gmail.com?subject=Unsaid%20Terms%20Question"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-px hover:border-slate-300 hover:shadow-md"
            >
              <Mail className="h-4 w-4" />
              sujalpatel6624@gmail.com
            </a>
          </aside>
        </section>

        <section className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/privacy-policy"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-px hover:bg-black hover:shadow-lg"
            >
              Read Privacy Policy
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-px hover:border-slate-300 hover:shadow-md"
            >
              Go to FAQ
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
