import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles, Target, Users2 } from "lucide-react";

type ValueCard = {
  title: string;
  description: string;
  icon: typeof Sparkles;
};

const values: ValueCard[] = [
  {
    title: "Honesty without pressure",
    description:
      "Anonymous messaging removes social pressure and helps people share what they truly think.",
    icon: Sparkles,
  },
  {
    title: "Privacy-first design",
    description:
      "Verified accounts, dashboard controls, and simple sharing keep feedback safe and manageable.",
    icon: ShieldCheck,
  },
  {
    title: "Feedback that drives growth",
    description:
      "Unsaid focuses on clarity so creators, students, and teams can act on meaningful input.",
    icon: Target,
  },
];

const trustPoints = [
  "Only verified users can manage inbox settings.",
  "Users can pause message acceptance any time from dashboard.",
  "Every account receives a unique shareable URL.",
  "The platform is designed for respectful and constructive feedback.",
];

export default function AboutPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-b from-slate-50 via-zinc-50 to-slate-100 px-4 py-8 sm:px-6 lg:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-8 h-52 w-52 rounded-full bg-cyan-200/35 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 right-4 h-52 w-52 rounded-full bg-amber-200/35 blur-3xl"
      />

      <main className="relative mx-auto max-w-6xl space-y-6">
        <section className="animate-in fade-in-0 slide-in-from-top-3 duration-700 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-slate-600 uppercase">
            <Users2 className="h-3.5 w-3.5" />
            About Unsaid
          </div>

          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            We built Unsaid to make honest feedback easier to share.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Great feedback often stays unsaid because people fear judgment or awkward conversations.
            Unsaid creates a safe channel where real thoughts can be shared anonymously, while recipients
            stay in control through privacy settings and a structured inbox.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 sm:text-sm">
            <BadgeCheck className="h-4 w-4" />
            Trusted by people who value clarity, growth, and privacy.
          </div>
        </section>

        <section className="animate-in fade-in-0 slide-in-from-bottom-3 duration-700 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">What we stand for</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Principles behind the product</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
                >
                  <div className="inline-flex rounded-xl border border-slate-200 bg-white p-2 text-slate-700">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 text-base font-extrabold text-slate-900">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{value.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">Trust and safety</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">How we protect user confidence</h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {trustPoints.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
              >
                {point}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-px hover:bg-black hover:shadow-lg"
            >
              Contact our team
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-px hover:border-slate-300 hover:shadow-md"
            >
              Create your account
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
