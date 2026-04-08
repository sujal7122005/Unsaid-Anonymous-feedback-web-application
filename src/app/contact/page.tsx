import Link from "next/link";
import { ArrowRight, Clock3, Mail, MessageSquareText, ShieldCheck, Wrench } from "lucide-react";

type ContactChannel = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  icon: typeof Mail;
};

const contactChannels: ContactChannel[] = [
  {
    title: "General inquiries",
    description:
      "Questions about Unsaid, collaboration requests, or account support.",
    actionLabel: "sujalpatel6624@gmail.com",
    actionHref: "mailto:sujalpatel6624@gmail.com",
    icon: Mail,
  },
  {
    title: "Product feedback",
    description:
      "Share feature ideas, improvement suggestions, or UX feedback for the platform.",
    actionLabel: "Send product feedback",
    actionHref:
      "mailto:sujalpatel6624@gmail.com?subject=Unsaid%20Product%20Feedback",
    icon: MessageSquareText,
  },
  {
    title: "Bug reports",
    description:
      "Report technical issues with steps to reproduce for faster resolution.",
    actionLabel: "Report a bug",
    actionHref: "mailto:sujalpatel6624@gmail.com?subject=Unsaid%20Bug%20Report",
    icon: Wrench,
  },
];

const messageChecklist = [
  "Your username or account email (if related to account issues)",
  "Short summary of your question or issue",
  "Expected behavior and what happened instead",
  "Screenshots or steps to reproduce when reporting bugs",
];

export default function ContactPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-b from-slate-50 via-zinc-50 to-slate-100 px-4 py-8 sm:px-6 lg:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-8 top-16 h-48 w-48 rounded-full bg-cyan-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-32 h-44 w-44 rounded-full bg-amber-200/35 blur-3xl"
      />

      <main className="relative mx-auto max-w-6xl space-y-6">
        <section className="animate-in fade-in-0 slide-in-from-top-3 duration-700 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-slate-600 uppercase">
            <Mail className="h-3.5 w-3.5" />
            Contact Us
          </div>

          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Reach out whenever you need support.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Whether you have a question, found a bug, or want to share ideas, we are happy to hear from you.
            Clear communication helps us make Unsaid more reliable and more useful for everyone.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 sm:text-sm">
            <Clock3 className="h-4 w-4" />
            Typical response time: 24 to 48 hours.
          </div>
        </section>

        <section className="animate-in fade-in-0 slide-in-from-bottom-3 duration-700 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">Contact channels</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Choose the right support route</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {contactChannels.map((channel) => {
              const Icon = channel.icon;

              return (
                <article
                  key={channel.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
                >
                  <div className="inline-flex rounded-xl border border-slate-200 bg-white p-2 text-slate-700">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 text-base font-extrabold text-slate-900">{channel.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{channel.description}</p>
                  <a
                    href={channel.actionHref}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors duration-200 hover:text-black"
                  >
                    {channel.actionLabel}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">Before you send</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Include these details for faster help</h2>

            <div className="mt-5 space-y-3">
              {messageChecklist.map((item) => (
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
            <h3 className="mt-3 text-lg font-extrabold text-slate-900">Privacy note</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Never share passwords or OTP codes in support emails. We only need details required to understand and resolve your request.
            </p>

            <Link
              href="/about"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-px hover:border-slate-300 hover:shadow-md"
            >
              Learn more about Unsaid
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>
      </main>
    </div>
  );
}
