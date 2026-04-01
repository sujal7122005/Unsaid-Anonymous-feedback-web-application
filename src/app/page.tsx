import {
  ArrowRight,
  BadgeCheck,
  Link2,
  LockKeyhole,
  MessageSquareText,
  Sparkles,
  ToggleLeft,
  WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import ScrollVisualShowcase from "@/src/components/ScrollVisualShowcase";

type HomeFeature = {
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
};

type HomeStep = {
  id: string;
  title: string;
  description: string;
};

const features: HomeFeature[] = [
  {
    title: "Honest Anonymous Feedback",
    description:
      "People can message you freely without revealing identity.",
    detail:
      "This creates space for real, useful opinions that are often left unsaid in normal conversations.",
    icon: MessageSquareText,
  },
  {
    title: "OTP Secured Accounts",
    description:
      "Only verified users can manage inbox settings and message access.",
    detail:
      "Email OTP verification helps keep ownership secure while maintaining a frictionless experience.",
    icon: LockKeyhole,
  },
  {
    title: "AI Suggestion Support",
    description:
      "Smart suggestions help senders write clear and thoughtful feedback.",
    detail:
      "Great when someone wants to say something valuable but struggles to phrase it.",
    icon: WandSparkles,
  },
  {
    title: "Public Shareable Link",
    description:
      "Each user gets a personal feedback URL for easy sharing.",
    detail:
      "Post it on social media, portfolios, communities, or team channels to collect responses quickly.",
    icon: Link2,
  },
  {
    title: "Inbox Control Dashboard",
    description:
      "Manage incoming messages in one clean private dashboard.",
    detail:
      "Toggle acceptance mode on or off anytime and review all feedback in a structured way.",
    icon: ToggleLeft,
  },
];

const steps: HomeStep[] = [
  {
    id: "01",
    title: "Sign up & verify",
    description: "Create your account and verify your email with OTP.",
  },
  {
    id: "02",
    title: "Share your profile link",
    description:
      "Send your unique URL to audience, friends, or your team.",
  },
  {
    id: "03",
    title: "Receive and improve",
    description:
      "Read honest messages from your dashboard and use them to grow.",
  },
];

function SectionHeader({
  badge,
  title,
  description,
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase transition-colors duration-300">
        {badge}
      </p>
      <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
        {title}
      </h2>
      <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({ feature }: { feature: HomeFeature }) {
  const Icon = feature.icon;

  return (
    <article className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-lg motion-reduce:transition-none">
      <div className="inline-flex rounded-xl border border-slate-200 bg-white p-2 text-slate-700 transition-all duration-300 group-hover:scale-105 group-hover:shadow-sm">
        <Icon className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-6" />
      </div>
      <h3 className="mt-3 text-base font-extrabold text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
        {feature.title}
      </h3>
      <p className="mt-2 text-sm font-medium text-slate-700">
        {feature.description}
      </p>
      <p className="mt-2 text-sm text-slate-600">{feature.detail}</p>
    </article>
  );
}

function StepCard({ step }: { step: HomeStep }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md motion-reduce:transition-none">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-black text-slate-700 transition-all duration-300 group-hover:bg-slate-100">
        {step.id}
      </div>
      <h3 className="mt-3 text-base font-extrabold text-slate-900">{step.title}</h3>
      <p className="mt-1 text-sm text-slate-600">{step.description}</p>
    </article>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-b from-slate-50 via-zinc-50 to-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 top-20 h-48 w-48 rounded-full bg-cyan-200/35 blur-3xl motion-safe:animate-pulse"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-36 h-44 w-44 rounded-full bg-amber-200/35 blur-3xl motion-safe:animate-pulse"
      />

      <main className="relative mx-auto max-w-6xl space-y-6">
        <section className="animate-in fade-in-0 slide-in-from-top-3 duration-700 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-slate-600 uppercase">
            <Sparkles className="h-3.5 w-3.5 transition-transform duration-300 hover:rotate-12" />
            Unsaid
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            A place for the feedback
            <br />
            people usually keep unsaid.
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Unsaid helps you understand how people really feel. Create your
            anonymous inbox, share your personal link, and receive honest
            messages that help you grow as a creator, student, or professional.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Start for Free
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              Sign In
            </Link>
          </div>
        </section>

        <section className="animate-in fade-in-0 slide-in-from-bottom-3 duration-700 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <SectionHeader
            badge="Our Vision"
            title="Make honest feedback simple, safe, and useful"
            description="Unsaid is built to remove fear and friction from feedback. We help people express real thoughts anonymously while giving recipients control and clarity through a clean dashboard."
          />

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition-all duration-300 hover:bg-white hover:shadow-sm sm:text-sm">
            <BadgeCheck className="h-4 w-4" />
            Trusted flow: OTP verification, shareable links, private dashboard.
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>

        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <ScrollVisualShowcase />
        </div>

        <section className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <SectionHeader
            badge="How It Works"
            title="From sign-up to meaningful insights"
            description="Start in minutes: create your account, share your profile URL, and begin receiving honest anonymous responses."
          />

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <StepCard key={step.id} step={step} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
