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
    <div className="relative min-h-[calc(100vh-80px)] bg-[#131313] px-4 py-12 sm:px-6 lg:px-10">
      <main className="relative mx-auto max-w-6xl space-y-12">
        <section className="rounded-[20px] border border-[#313131] bg-[#131313] p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-[2px] border border-[#3cffd0] bg-transparent px-3 py-1 font-mono-caps text-[10px] text-[#3cffd0]">
            <Sparkles className="h-3.5 w-3.5" />
            FAQ
          </div>

          <h1 className="mt-6 font-display text-[60px] sm:text-[80px] uppercase text-white leading-[0.9]">
            COMMON TRUST AND PRIVACY QUESTIONS.
          </h1>

          <p className="mt-6 max-w-3xl font-sans text-[18px] leading-relaxed text-white">
            These answers cover how anonymity works, how moderation is handled, and how account controls work on Unsaid.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 font-mono-caps text-[12px] text-[#3cffd0]">
            <BadgeCheck className="h-4 w-4" />
            UPDATED FOR THE CURRENT PLATFORM BEHAVIOR
          </div>
        </section>

        <section className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
          <div className="grid gap-4 md:grid-cols-2">
            {faqItems.map((item) => (
              <article
                key={item.question}
                className="rounded-[2px] border border-[#313131] bg-[#131313] p-6 transition-colors duration-200 hover:border-[#3cffd0] group flex flex-col"
              >
                <div className="inline-flex text-[#3cffd0]">
                  <MessageSquareText className="h-6 w-6" />
                </div>
                <h2 className="mt-4 font-display text-[24px] uppercase text-white">{item.question}</h2>
                <p className="mt-3 font-sans text-[14px] leading-relaxed text-[#949494] group-hover:text-white transition-colors flex-grow">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
            <p className="font-mono-caps text-[12px] text-[#949494]">NEED MORE HELP</p>
            <h2 className="mt-2 font-display text-[40px] uppercase text-white leading-[0.9]">CONTACT SUPPORT DIRECTLY</h2>
            <p className="mt-6 font-sans text-[18px] leading-relaxed text-white">
              For account-specific questions, send details from your registered email so support can verify ownership and assist safely.
            </p>

            <a
              href="mailto:sujalpatel6624@gmail.com?subject=Unsaid%20Support%20Question"
              className="mt-8 dark-slate-pill h-12 px-6 flex flex-wrap items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              SUJALPATEL6624@GMAIL.COM
            </a>
          </div>

          <aside className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
            <div className="inline-flex text-[#3cffd0]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-[30px] uppercase text-white leading-[0.9]">RELATED POLICIES</h3>
            <div className="mt-6 flex flex-col gap-4 font-mono-caps text-[12px]">
              <Link href="/privacy-policy" className="text-[#949494] hover:text-white transition-colors">
                PRIVACY POLICY
              </Link>
              <Link href="/terms-of-service" className="text-[#949494] hover:text-white transition-colors">
                TERMS OF SERVICE
              </Link>
              <Link href="/contact" className="text-[#949494] hover:text-white transition-colors">
                CONTACT PAGE
              </Link>
            </div>
            <Link
              href="/privacy-policy"
              className="mt-8 inline-flex items-center gap-2 font-mono-caps text-[11px] text-[#3cffd0] hover:text-white transition-colors uppercase"
            >
              READ POLICY DETAILS
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>
      </main>
    </div>
  );
}
