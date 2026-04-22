import {
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
import { DottedSurface } from "@/components/ui/dotted-surface";
import MessageTimeCarousel from "../components/MessageTimeCarousel";
import HomeHeroActions from "../components/HomeHeroActions";
import HomeFooterAccountLinks from "../components/HomeFooterAccountLinks";

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
    title: "Receive and improve with feedback",
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
    <div className="space-y-3">
      <p className="text-xs font-semibold tracking-[0.16em] text-slate-500/90 uppercase transition-colors duration-300">
        {badge}
      </p>
      <h2 className="text-2xl leading-tight font-black text-slate-900 sm:text-3xl md:text-4xl">
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
    <article className="group rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-sm backdrop-blur-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-xl motion-reduce:transition-none">
      <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700 transition-all duration-300 group-hover:scale-105 group-hover:bg-white group-hover:shadow-sm">
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
    <article className="group rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg motion-reduce:transition-none">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-black text-slate-700 transition-all duration-300 group-hover:bg-white group-hover:shadow-sm">
        {step.id}
      </div>
      <h3 className="mt-3 text-base font-extrabold text-slate-900">{step.title}</h3>
      <p className="mt-1 text-sm text-slate-600">{step.description}</p>
    </article>
  );
}

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#f4f6f8] py-8 text-slate-900 sm:py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-14 top-16 h-56 w-56 rounded-full bg-cyan-100/70 blur-3xl motion-safe:animate-pulse"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 top-36 h-52 w-52 rounded-full bg-indigo-100/65 blur-3xl motion-safe:animate-pulse"
      />

      <main className="relative mx-auto w-full max-w-7xl space-y-7 px-4 sm:px-6 lg:px-8">
        <section
          id="home"
          className="animate-in fade-in-0 slide-in-from-top-3 relative isolate w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-6 shadow-[0_35px_90px_-48px_rgba(15,23,42,0.45)] duration-700 sm:p-10"
        >
          <DottedSurface className="absolute inset-0 z-0 opacity-95 mask-[radial-gradient(ellipse_at_center,transparent_20%,black_34%,black_92%,transparent_100%)]" />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.56)_45%,rgba(255,255,255,0.9)_82%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-44 bg-linear-to-b from-white/90 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-16 z-10 h-64 w-64 rounded-full bg-cyan-100/60 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-10 z-10 h-64 w-64 rounded-full bg-amber-100/55 blur-3xl"
          />

          <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-slate-600 uppercase backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 transition-transform duration-300 hover:rotate-12" />
              Unsaid
            </div>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl xl:text-6xl">
              Feedback clarity,
              <br />
              without social pressure.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Build a trusted space where people can share what they really
              think. Unsaid gives you a private inbox, a shareable feedback
              link, and controls that keep conversations safe and useful.
            </p>

            <div className="w-full [&>div]:mt-8 [&>div]:justify-center">
              <HomeHeroActions />
            </div>

            <div className="mt-8 grid w-full max-w-3xl gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200/90 bg-white/90 px-4 py-3 text-left shadow-sm backdrop-blur-xs">
                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-700">
                  <LockKeyhole className="h-4 w-4" />
                </div>
                <p className="mt-2 text-sm font-bold text-slate-900">Private by default</p>
                <p className="text-xs text-slate-600">Anonymous responses with secure inbox ownership.</p>
              </div>

              <div className="rounded-xl border border-slate-200/90 bg-white/90 px-4 py-3 text-left shadow-sm backdrop-blur-xs">
                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-700">
                  <BadgeCheck className="h-4 w-4" />
                </div>
                <p className="mt-2 text-sm font-bold text-slate-900">OTP verified</p>
                <p className="text-xs text-slate-600">Protection against inbox spoofing and misuse.</p>
              </div>

              <div className="rounded-xl border border-slate-200/90 bg-white/90 px-4 py-3 text-left shadow-sm backdrop-blur-xs">
                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-700">
                  <Link2 className="h-4 w-4" />
                </div>
                <p className="mt-2 text-sm font-bold text-slate-900">One link sharing</p>
                <p className="text-xs text-slate-600">Collect feedback from communities in minutes.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="animate-in fade-in-0 slide-in-from-bottom-3 relative overflow-hidden duration-700 w-full rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xs sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-slate-100/80 blur-3xl"
          />

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

        <MessageTimeCarousel />

        <section id="how-it-works" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 w-full rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xs sm:p-8">
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

        <section id="trust-center" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 w-full rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xs sm:p-8">
          <SectionHeader
            badge="Trust Center"
            title="Policies and answers in one place"
            description="Read how data is handled, what platform rules apply, and common trust questions about anonymous feedback."
          />

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link
              href="/privacy-policy"
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
            >
              <div className="inline-flex rounded-xl border border-slate-200 bg-white p-2 text-slate-700">
                <LockKeyhole className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-base font-extrabold text-slate-900">Privacy Policy</h3>
              <p className="mt-2 text-sm text-slate-600">
                Learn what data we collect, what we do not collect, and data retention and deletion rules.
              </p>
            </Link>

            <Link
              href="/terms-of-service"
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
            >
              <div className="inline-flex rounded-xl border border-slate-200 bg-white p-2 text-slate-700">
                <BadgeCheck className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-base font-extrabold text-slate-900">Terms of Service</h3>
              <p className="mt-2 text-sm text-slate-600">
                Review acceptable use, account responsibilities, and enforcement policies for safe platform usage.
              </p>
            </Link>

            <Link
              href="/faq"
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
            >
              <div className="inline-flex rounded-xl border border-slate-200 bg-white p-2 text-slate-700">
                <MessageSquareText className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-base font-extrabold text-slate-900">FAQ</h3>
              <p className="mt-2 text-sm text-slate-600">
                Find quick answers about anonymity, abusive messages, moderation flow, and account controls.
              </p>
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative mt-10 w-full border-t border-slate-300 bg-slate-950 text-slate-200">
        <div className="grid gap-10 px-6 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-5 lg:px-12">
          <div className="space-y-4 sm:col-span-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-slate-300 uppercase">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              Unsaid
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300">
              Collect honest anonymous feedback in a secure and structured way.
              Unsaid helps individuals and teams turn candid input into clear
              action.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-300">
              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
                OTP Verification
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
                Private Dashboard
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
                AI Suggestions
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">
              Product
            </h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link
                href="#features"
                className="text-slate-200 transition-colors duration-200 hover:text-white"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-slate-200 transition-colors duration-200 hover:text-white"
              >
                How it works
              </Link>
              <Link
                href="/dashboard"
                className="text-slate-200 transition-colors duration-200 hover:text-white"
              >
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">
              Account
            </h3>
            <HomeFooterAccountLinks />
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">
              Legal
            </h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link
                href="/privacy-policy"
                className="text-slate-200 transition-colors duration-200 hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-slate-200 transition-colors duration-200 hover:text-white"
              >
                Terms of Service
              </Link>
              <Link
                href="/faq"
                className="text-slate-200 transition-colors duration-200 hover:text-white"
              >
                FAQ
              </Link>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-800 px-6 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:text-sm lg:px-12">
          <p>&copy; {currentYear} Unsaid. All rights reserved.</p>
          <p>Privacy-first anonymous feedback for creators, students, and teams.</p>
        </div>
      </footer>
    </div>
  );
}
