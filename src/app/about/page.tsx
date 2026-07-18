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
    <div className="relative min-h-[calc(100vh-80px)] bg-[#131313] px-4 py-12 sm:px-6 lg:px-10">
      <main className="relative mx-auto max-w-6xl space-y-12">
        <section className="rounded-[20px] border border-[#313131] bg-[#131313] p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-[2px] border border-[#3cffd0] bg-transparent px-3 py-1 font-mono-caps text-[10px] text-[#3cffd0]">
            <Users2 className="h-3.5 w-3.5" />
            ABOUT UNSAID
          </div>

          <h1 className="mt-6 font-display text-[60px] sm:text-[80px] uppercase text-white leading-[0.9]">
            WE BUILT UNSAID TO MAKE HONEST FEEDBACK EASIER TO SHARE.
          </h1>

          <p className="mt-6 max-w-3xl font-sans text-[18px] leading-relaxed text-white">
            Great feedback often stays unsaid because people fear judgment or awkward conversations.
            Unsaid creates a safe channel where real thoughts can be shared anonymously, while recipients
            stay in control through privacy settings and a structured inbox.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 font-mono-caps text-[12px] text-[#3cffd0]">
            <BadgeCheck className="h-4 w-4" />
            TRUSTED BY PEOPLE WHO VALUE CLARITY, GROWTH, AND PRIVACY.
          </div>
        </section>

        <section className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
          <p className="font-mono-caps text-[12px] text-[#949494]">WHAT WE STAND FOR</p>
          <h2 className="mt-2 font-display text-[40px] uppercase text-white leading-[0.9]">PRINCIPLES BEHIND THE PRODUCT</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="rounded-[2px] border border-[#313131] bg-[#131313] p-6 transition-colors duration-200 hover:border-[#3cffd0] group"
                >
                  <div className="inline-flex text-[#3cffd0]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-[24px] uppercase text-white">{value.title}</h3>
                  <p className="mt-3 font-sans text-[14px] leading-relaxed text-[#949494] group-hover:text-white transition-colors">{value.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
          <p className="font-mono-caps text-[12px] text-[#949494]">TRUST AND SAFETY</p>
          <h2 className="mt-2 font-display text-[40px] uppercase text-white leading-[0.9]">HOW WE PROTECT USER CONFIDENCE</h2>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {trustPoints.map((point) => (
              <div
                key={point}
                className="rounded-[2px] border border-[#313131] bg-[#131313] px-5 py-4 font-sans text-[16px] text-white"
              >
                {point}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="jelly-mint-pill h-12 px-6 flex items-center justify-center gap-2"
            >
              CONTACT OUR TEAM
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="dark-slate-pill h-12 px-6 flex items-center justify-center gap-2"
            >
              CREATE YOUR ACCOUNT
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
