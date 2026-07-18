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
    <div className="relative min-h-[calc(100vh-80px)] bg-[#131313] px-4 py-12 sm:px-6 lg:px-10">
      <main className="relative mx-auto max-w-6xl space-y-12">
        <section className="rounded-[20px] border border-[#313131] bg-[#131313] p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-[2px] border border-[#3cffd0] bg-transparent px-3 py-1 font-mono-caps text-[10px] text-[#3cffd0]">
            <Sparkles className="h-3.5 w-3.5" />
            TERMS OF SERVICE
          </div>

          <h1 className="mt-6 font-display text-[60px] sm:text-[80px] uppercase text-white leading-[0.9]">
            PLATFORM RULES FOR SAFE AND FAIR USE.
          </h1>

          <p className="mt-6 max-w-3xl font-sans text-[18px] leading-relaxed text-white">
            By using Unsaid, you agree to these terms. They define acceptable use, account responsibility, and the rights
            that protect both users and the platform.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 font-mono-caps text-[12px] text-[#3cffd0]">
            <BadgeCheck className="h-4 w-4" />
            EFFECTIVE DATE: APRIL 8, 2026
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
            <p className="font-mono-caps text-[12px] text-[#949494]">ACCEPTABLE USE</p>
            <h2 className="mt-2 font-display text-[40px] uppercase text-white leading-[0.9]">WHAT IS NOT ALLOWED</h2>
            <div className="mt-8 space-y-3">
              {acceptableUseRules.map((rule) => (
                <div
                  key={rule}
                  className="rounded-[2px] border border-[#313131] bg-[#131313] px-5 py-4 font-sans text-[16px] text-white"
                >
                  {rule}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
            <p className="font-mono-caps text-[12px] text-[#949494]">ACCOUNTS</p>
            <h2 className="mt-2 font-display text-[40px] uppercase text-white leading-[0.9]">USER RESPONSIBILITIES</h2>
            <div className="mt-8 space-y-3">
              {accountRules.map((rule) => (
                <div
                  key={rule}
                  className="rounded-[2px] border border-[#313131] bg-[#131313] px-5 py-4 font-sans text-[16px] text-white"
                >
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
            <p className="font-mono-caps text-[12px] text-[#949494]">ENFORCEMENT AND LEGAL</p>
            <h2 className="mt-2 font-display text-[40px] uppercase text-white leading-[0.9]">HOW TERMS ARE APPLIED</h2>

            <div className="mt-8 space-y-3 font-sans text-[16px] leading-relaxed text-white">
              <div className="rounded-[2px] border border-[#313131] bg-[#131313] px-5 py-4">
                Unsaid can remove content, restrict features, or suspend accounts when platform rules are violated.
              </div>
              <div className="rounded-[2px] border border-[#313131] bg-[#131313] px-5 py-4">
                Service availability may change over time. Features can be updated, paused, or discontinued to maintain quality and security.
              </div>
              <div className="rounded-[2px] border border-[#313131] bg-[#131313] px-5 py-4">
                Unsaid is provided on an as-is basis. To the maximum extent allowed by law, liability is limited for indirect or consequential losses.
              </div>
              <div className="rounded-[2px] border border-[#313131] bg-[#131313] px-5 py-4">
                Terms may be updated as the product evolves. Continued use after updates means acceptance of revised terms.
              </div>
            </div>
          </div>

          <aside className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
            <div className="inline-flex text-[#3cffd0]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-[30px] uppercase text-white leading-[0.9]">QUESTIONS ABOUT THESE TERMS</h3>
            <p className="mt-4 font-sans text-[16px] leading-relaxed text-[#949494]">
              Contact the support email for legal or policy clarification requests.
            </p>

            <a
              href="mailto:sujalpatel6624@gmail.com?subject=Unsaid%20Terms%20Question"
              className="mt-8 dark-slate-pill h-12 px-6 flex flex-wrap items-center justify-center gap-2 w-full text-center"
            >
              <Mail className="h-4 w-4" />
              SUJALPATEL6624@GMAIL.COM
            </a>
          </aside>
        </section>

        <section className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/privacy-policy"
              className="jelly-mint-pill h-12 px-6 flex items-center justify-center gap-2"
            >
              READ PRIVACY POLICY
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/faq"
              className="dark-slate-pill h-12 px-6 flex items-center justify-center gap-2"
            >
              GO TO FAQ
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
