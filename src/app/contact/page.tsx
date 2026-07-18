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
    <div className="relative min-h-[calc(100vh-80px)] bg-[#131313] px-4 py-12 sm:px-6 lg:px-10">
      <main className="relative mx-auto max-w-6xl space-y-12">
        <section className="rounded-[20px] border border-[#313131] bg-[#131313] p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-[2px] border border-[#3cffd0] bg-transparent px-3 py-1 font-mono-caps text-[10px] text-[#3cffd0]">
            <Mail className="h-3.5 w-3.5" />
            CONTACT US
          </div>

          <h1 className="mt-6 font-display text-[60px] sm:text-[80px] uppercase text-white leading-[0.9]">
            REACH OUT WHENEVER YOU NEED SUPPORT.
          </h1>

          <p className="mt-6 max-w-3xl font-sans text-[18px] leading-relaxed text-white">
            Whether you have a question, found a bug, or want to share ideas, we are happy to hear from you.
            Clear communication helps us make Unsaid more reliable and more useful for everyone.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 font-mono-caps text-[12px] text-[#3cffd0]">
            <Clock3 className="h-4 w-4" />
            TYPICAL RESPONSE TIME: 24 TO 48 HOURS.
          </div>
        </section>

        <section className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
          <p className="font-mono-caps text-[12px] text-[#949494]">CONTACT CHANNELS</p>
          <h2 className="mt-2 font-display text-[40px] uppercase text-white leading-[0.9]">CHOOSE THE RIGHT SUPPORT ROUTE</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {contactChannels.map((channel) => {
              const Icon = channel.icon;

              return (
                <article
                  key={channel.title}
                  className="rounded-[2px] border border-[#313131] bg-[#131313] p-6 transition-colors duration-200 hover:border-[#3cffd0] group flex flex-col"
                >
                  <div className="inline-flex text-[#3cffd0]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-[24px] uppercase text-white">{channel.title}</h3>
                  <p className="mt-3 font-sans text-[14px] leading-relaxed text-[#949494] group-hover:text-white transition-colors flex-grow">{channel.description}</p>
                  <a
                    href={channel.actionHref}
                    className="mt-6 inline-flex items-center gap-2 font-mono-caps text-[11px] text-[#3cffd0] hover:text-white transition-colors uppercase"
                  >
                    {channel.actionLabel}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
            <p className="font-mono-caps text-[12px] text-[#949494]">BEFORE YOU SEND</p>
            <h2 className="mt-2 font-display text-[40px] uppercase text-white leading-[0.9]">INCLUDE THESE DETAILS FOR FASTER HELP</h2>

            <div className="mt-8 space-y-3">
              {messageChecklist.map((item) => (
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
            <h3 className="mt-4 font-display text-[30px] uppercase text-white leading-[0.9]">PRIVACY NOTE</h3>
            <p className="mt-4 font-sans text-[16px] leading-relaxed text-[#949494]">
              Never share passwords or OTP codes in support emails. We only need details required to understand and resolve your request.
            </p>

            <Link
              href="/about"
              className="mt-8 dark-slate-pill h-12 px-6 flex flex-wrap items-center justify-center gap-2"
            >
              LEARN MORE ABOUT UNSAID
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>
      </main>
    </div>
  );
}
