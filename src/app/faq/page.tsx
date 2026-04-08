import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Mail, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ | Unsaid",
  description:
    "Frequently asked questions about anonymity, moderation, privacy, and account controls on Unsaid.",
};

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "Is feedback really anonymous?",
    answer:
      "Yes. The sender flow does not ask for sender name or email when submitting feedback to a user profile.",
  },
  {
    question: "Can abusive messages be reported?",
    answer:
      "There is no dedicated in-app report button yet. Recipients can delete abusive messages and email support with context for review.",
  },
  {
    question: "Can I stop receiving new messages?",
    answer:
      "Yes. You can toggle message acceptance from your dashboard settings at any time.",
  },
  {
    question: "Can I delete messages from my inbox?",
    answer:
      "Yes. You can remove individual messages from your dashboard when they are no longer needed.",
  },
  {
    question: "Is my email visible to anonymous senders?",
    answer:
      "No. Anonymous senders use your public username link and do not see your account email address.",
  },
  {
    question: "How long are messages stored?",
    answer:
      "Messages stay in your inbox until you delete them, unless policy or legal requirements require otherwise.",
  },
  {
    question: "How do I request account or data deletion?",
    answer:
      "Send a request to the official support email from your registered account email for identity verification.",
  },
  {
    question: "Why is OTP verification required?",
    answer:
      "OTP verification helps secure account ownership and reduces unauthorized account usage.",
  },
  {
    question: "Can anonymous senders edit or delete sent messages later?",
    answer:
      "No. Sender edit or sender delete is not available at this time.",
  },
];

export default function FaqPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-b from-slate-50 via-zinc-50 to-slate-100 px-4 py-8 sm:px-6 lg:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-8 top-16 h-52 w-52 rounded-full bg-cyan-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-32 h-48 w-48 rounded-full bg-amber-200/35 blur-3xl"
      />

      <main className="relative mx-auto max-w-6xl space-y-6">
        <section className="animate-in fade-in-0 slide-in-from-top-3 duration-700 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-slate-600 uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            FAQ
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Common trust and privacy questions.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            These answers cover how anonymity works, how moderation is handled, and how account controls work on Unsaid.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 sm:text-sm">
            <BadgeCheck className="h-4 w-4" />
            Updated for the current platform behavior
          </div>
        </section>

        <section className="animate-in fade-in-0 slide-in-from-bottom-3 duration-700 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            {faqItems.map((item) => (
              <article
                key={item.question}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
              >
                <div className="inline-flex rounded-xl border border-slate-200 bg-white p-2 text-slate-700">
                  <MessageSquareText className="h-4 w-4" />
                </div>
                <h2 className="mt-3 text-base font-extrabold text-slate-900">{item.question}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">Need more help</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Contact support directly</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              For account-specific questions, send details from your registered email so support can verify ownership and assist safely.
            </p>

            <a
              href="mailto:sujalpatel6624@gmail.com?subject=Unsaid%20Support%20Question"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-px hover:border-slate-300 hover:shadow-md"
            >
              <Mail className="h-4 w-4" />
              sujalpatel6624@gmail.com
            </a>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-2 text-slate-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-lg font-extrabold text-slate-900">Related policies</h3>
            <div className="mt-3 flex flex-col gap-2 text-sm font-semibold">
              <Link href="/privacy-policy" className="text-slate-700 transition-colors duration-200 hover:text-slate-900">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-slate-700 transition-colors duration-200 hover:text-slate-900">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-slate-700 transition-colors duration-200 hover:text-slate-900">
                Contact Page
              </Link>
            </div>
            <Link
              href="/privacy-policy"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
            >
              Read policy details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>
      </main>
    </div>
  );
}
