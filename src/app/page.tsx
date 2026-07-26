import {
  ArrowRight,
  BadgeCheck,
  LayoutDashboard,
  Link2,
  LockKeyhole,
  MessageSquareText,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import MessageTimeCarousel from "../components/MessageTimeCarousel";
import HomeHeroActions from "../components/HomeHeroActions";
import HomeFooterAccountLinks from "../components/HomeFooterAccountLinks";
import Logo from "../components/Logo";

type HomeFeature = {
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
  color?: "mint" | "ultraviolet" | "yellow" | "pink" | "dark";
};

const features: HomeFeature[] = [
  {
    title: "HONEST ANONYMOUS FEEDBACK",
    description: "People can message you freely without revealing identity.",
    detail: "This creates space for real, useful opinions that are often left unsaid in normal conversations.",
    icon: MessageSquareText,
    color: "mint",
  },
  {
    title: "OTP SECURED ACCOUNTS",
    description: "Only verified users can manage inbox settings and message access.",
    detail: "Email OTP verification helps keep ownership secure while maintaining a frictionless experience.",
    icon: LockKeyhole,
    color: "dark",
  },
  {
    title: "AI SUGGESTION SUPPORT",
    description: "Smart suggestions help senders write clear and thoughtful feedback.",
    detail: "Great when someone wants to say something valuable but struggles to phrase it.",
    icon: WandSparkles,
    color: "dark",
  },
  {
    title: "PUBLIC SHAREABLE LINK",
    description: "Each user gets a personal feedback URL for easy sharing.",
    detail: "Post it on social media, portfolios, communities, or team channels to collect responses quickly.",
    icon: Link2,
    color: "ultraviolet",
  },
  {
    title: "INBOX CONTROL DASHBOARD",
    description: "Manage incoming messages in one clean private dashboard.",
    detail: "Toggle acceptance mode on or off anytime and review all feedback in a structured way.",
    icon: ToggleLeft,
    color: "dark",
  },
];

function StreamCard({ feature, timestamp }: { feature: HomeFeature; timestamp: string }) {
  const Icon = feature.icon;
  const isDark = feature.color === "dark";
  const isMint = feature.color === "mint";
  const isUV = feature.color === "ultraviolet";

  let containerClass = "relative w-full rounded-[20px] p-6 sm:p-8 transition-colors duration-150 ";
  if (isDark) containerClass += "bg-[#131313] border border-[#ffffff] text-white";
  if (isMint) containerClass += "bg-[#3cffd0] border-none text-[#000000]";
  if (isUV) containerClass += "bg-[#5200ff] border-none text-white";

  let titleClass = "font-display text-[34px] leading-[0.9] mt-4 mb-2 ";
  if (isDark) titleClass += "verge-link cursor-pointer";
  if (isMint) titleClass += "verge-link cursor-pointer text-black";
  if (isUV) titleClass += "text-white verge-link cursor-pointer";

  return (
    <div className="relative flex items-start gap-4 sm:gap-8 group">
      {/* Timeline Rail & Timestamp */}
      <div className="relative flex flex-col items-center shrink-0 w-[40px] sm:w-[60px]">
        <div className="absolute top-0 bottom-[-40px] left-1/2 w-px bg-white border-l border-white" />
        <div className="relative z-10 bg-[#131313] py-2 font-mono-caps text-[11px] text-[#949494] bg-clip-padding">
          {timestamp}
        </div>
      </div>

      {/* Card Body */}
      <article className={containerClass}>
        <div className="flex items-center gap-3">
          <span className="font-sans-thin-caps text-[14px]">
            {isMint ? "FEATURE HIGHLIGHT" : "CORE FUNCTION"}
          </span>
          <Icon className="h-4 w-4" />
        </div>
        <h3 className={titleClass}>{feature.title}</h3>
        <p className={`text-[16px] font-bold ${isDark ? 'text-white' : 'text-inherit'} mb-2`}>
          {feature.description}
        </p>
        <p className={`text-[13px] ${isDark ? 'text-[#949494]' : 'opacity-80'}`}>
          {feature.detail}
        </p>
      </article>
    </div>
  );
}

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen w-full bg-[#131313] text-[#ffffff] font-sans">
      
      {/* Container max-width typical for editorial (~1280px) */}
      <main className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Editorial Hero */}
        <section className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col items-start">
            <p className="font-sans-thin-caps text-[15px] sm:text-[17px] mb-3 text-[#949494]">
              INTRODUCING UNSAID
            </p>
            <h1 className="font-display text-[60px] sm:text-[75px] lg:text-[85px] xl:text-[95px] leading-[0.85] mb-6">
              FEEDBACK CLARITY,<br />
              WITHOUT PRESSURE.
            </h1>
            <p className="font-sans text-[20px] sm:text-[24px] font-bold leading-[1.2] max-w-2xl text-white mb-5">
              Build a trusted space where people can share what they really think.
            </p>
            <p className="text-[#949494] text-[15px] max-w-xl mb-8 leading-[1.5]">
              Unsaid gives you a private inbox, a shareable feedback link, and controls that keep conversations safe and useful.
            </p>
            
            <HomeHeroActions />
          </div>
          <div className="relative w-full hidden lg:flex items-center justify-center min-h-[500px]">
             {/* Decorative Background Elements */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#3cffd0]/10 blur-[100px] rounded-full pointer-events-none" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/4 w-[250px] h-[250px] bg-[#5200ff]/15 blur-[100px] rounded-full pointer-events-none" />

             {/* Floating Cards Container */}
             <div className="relative w-full max-w-[450px] h-[450px] flex items-center justify-center">
                
                {/* Card 1 (Back Right) */}
                <div className="absolute top-8 right-0 w-[280px] p-6 rounded-[20px] border border-[#313131] bg-[#131313] shadow-2xl transform rotate-[12deg] translate-x-8 opacity-80 hover:rotate-[15deg] hover:opacity-100 transition-all duration-500 cursor-default">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#5200ff]" />
                    <div className="font-mono-caps text-[10px] text-[#949494]">ANONYMOUS</div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-3/4 bg-[#313131] rounded-full" />
                    <div className="h-2 w-full bg-[#313131] rounded-full" />
                    <div className="h-2 w-5/6 bg-[#313131] rounded-full" />
                  </div>
                </div>

                {/* Card 2 (Middle Left) */}
                <div className="absolute top-24 -left-4 w-[320px] p-6 rounded-[20px] border border-[#313131] bg-[#131313] shadow-2xl transform -rotate-[6deg] -translate-x-4 hover:-rotate-[8deg] transition-all duration-500 z-10 cursor-default">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#fef08a]" />
                    <div className="font-mono-caps text-[10px] text-[#949494]">ANONYMOUS</div>
                  </div>
                  <p className="font-sans text-[15px] text-white leading-relaxed">
                    "I've been meaning to say this for a while, but your recent work on the new product design has been incredibly inspiring."
                  </p>
                </div>

                {/* Card 3 (Front Focus) */}
                <div className="absolute bottom-12 right-4 w-[360px] p-8 rounded-[20px] border border-[#3cffd0] bg-[#131313] shadow-[0_0_40px_rgba(60,255,208,0.15)] transform rotate-[2deg] hover:-translate-y-2 hover:shadow-[0_0_60px_rgba(60,255,208,0.25)] hover:-rotate-[1deg] transition-all duration-500 z-20 cursor-default">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#3cffd0] animate-pulse" />
                      <div className="font-mono-caps text-[11px] text-[#3cffd0]">NEW MESSAGE</div>
                    </div>
                    <div className="font-mono-caps text-[10px] text-[#949494]">JUST NOW</div>
                  </div>
                  <p className="font-sans text-[18px] text-white font-bold leading-[1.5]">
                    "This platform is exactly what our team needed. It removes all the friction from sharing honest thoughts."
                  </p>
                </div>

             </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Main StoryStream Timeline (Left Column, 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <h2 className="font-sans-thin-caps text-[20px] border-b border-[#313131] pb-4 mb-2">
              THE STORYSTREAM
            </h2>
            
            <div className="flex flex-col gap-10">
              {features.map((feature, i) => (
                <StreamCard 
                  key={i} 
                  feature={feature} 
                  timestamp={`10:${(i + 1) * 12} AM`} 
                />
              ))}
            </div>
            
            {/* End of rail cap */}
            <div className="relative flex items-start gap-4 sm:gap-8">
              <div className="relative flex flex-col items-center shrink-0 w-[40px] sm:w-[60px]">
                <div className="absolute top-0 h-[40px] left-1/2 w-px bg-white" />
                <div className="relative z-10 bg-[#131313] py-2 mt-8 font-mono-caps text-[11px] text-[#949494]">
                  END FEED
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Features (Right Column, 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <h2 className="font-sans-thin-caps text-[20px] border-b border-[#313131] pb-4 mb-2">
              TRUST CENTER
            </h2>
            
            <Link href="/privacy-policy" className="group p-6 rounded-[24px] border border-[#ffffff] bg-[#131313] transition-colors hover:border-[#3cffd0]">
              <div className="font-mono-caps text-[11px] text-[#3cffd0] mb-2">01 / POLICY</div>
              <h3 className="font-display text-[32px] leading-[0.9] text-white group-hover:text-[#3860be] transition-colors">PRIVACY</h3>
              <p className="mt-3 text-[#949494] text-[13px]">Learn what data we collect and our retention rules.</p>
            </Link>

            <Link href="/terms-of-service" className="group p-6 rounded-[24px] border border-[#ffffff] bg-[#131313] transition-colors hover:border-[#3cffd0]">
              <div className="font-mono-caps text-[11px] text-[#3cffd0] mb-2">02 / LEGAL</div>
              <h3 className="font-display text-[32px] leading-[0.9] text-white group-hover:text-[#3860be] transition-colors">TERMS OF SERVICE</h3>
              <p className="mt-3 text-[#949494] text-[13px]">Review acceptable use and enforcement policies.</p>
            </Link>

            <Link href="/faq" className="group p-6 rounded-[24px] bg-[#fef08a] transition-colors hover:opacity-90">
              <div className="font-mono-caps text-[11px] text-black mb-2">03 / HELP</div>
              <h3 className="font-display text-[32px] leading-[0.9] text-black group-hover:text-[#3860be] transition-colors">FAQ</h3>
              <p className="mt-3 text-black opacity-80 text-[13px]">Find quick answers about anonymity and moderation.</p>
            </Link>
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="mt-32 border-t border-[#313131] pt-16 scroll-mt-24">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-[2px] border border-[#3cffd0] bg-transparent px-3 py-1 font-mono-caps text-[10px] text-[#3cffd0] mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              HOW IT WORKS
            </div>
            <h2 className="font-display text-[50px] sm:text-[60px] lg:text-[75px] leading-[0.85] text-white">
              THREE STEPS TO
              <br />
              HONEST FEEDBACK.
            </h2>
            <p className="mt-4 max-w-2xl text-[#949494] text-[15px] leading-[1.6]">
              No complicated setup. Create your account, share one link, and start receiving anonymous messages in minutes.
            </p>
          </div>

          {/* Steps Timeline */}
          <div className="flex flex-col gap-10">

            {/* Step 01 — Sign Up */}
            <div className="relative flex items-start gap-4 sm:gap-8">
              <div className="relative flex flex-col items-center shrink-0 w-[40px] sm:w-[60px]">
                <div className="absolute top-0 bottom-[-40px] left-1/2 w-px bg-[#3cffd0]" />
                <div className="relative z-10 bg-[#131313] py-2 font-display text-[28px] sm:text-[34px] text-[#3cffd0]">
                  01
                </div>
              </div>
              <article className="relative w-full rounded-[20px] p-6 sm:p-8 bg-[#3cffd0] text-[#000000] transition-colors duration-150">
                <div className="flex items-center gap-3">
                  <span className="font-sans-thin-caps text-[14px] text-black/70">GETTING STARTED</span>
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="font-display text-[34px] leading-[0.9] mt-4 mb-2 text-black">SIGN UP & VERIFY</h3>
                <p className="text-[16px] font-bold text-black mb-2">
                  Create your account with email or Google sign-in.
                </p>
                <p className="text-[13px] opacity-80">
                  Verify your email with a quick OTP code. Once verified, your unique feedback link is instantly generated — something like <span className="font-mono-caps text-[11px]">unsaidfacts.me/u/yourname</span>.
                </p>
              </article>
            </div>

            {/* Step 02 — Share Link */}
            <div className="relative flex items-start gap-4 sm:gap-8">
              <div className="relative flex flex-col items-center shrink-0 w-[40px] sm:w-[60px]">
                <div className="absolute top-0 bottom-[-40px] left-1/2 w-px bg-[#5200ff]" />
                <div className="relative z-10 bg-[#131313] py-2 font-display text-[28px] sm:text-[34px] text-[#5200ff]">
                  02
                </div>
              </div>
              <article className="relative w-full rounded-[20px] p-6 sm:p-8 bg-[#5200ff] text-white transition-colors duration-150">
                <div className="flex items-center gap-3">
                  <span className="font-sans-thin-caps text-[14px] text-white/70">COLLECT FEEDBACK</span>
                  <Share2 className="h-4 w-4" />
                </div>
                <h3 className="font-display text-[34px] leading-[0.9] mt-4 mb-2 text-white">SHARE YOUR LINK</h3>
                <p className="text-[16px] font-bold text-white mb-2">
                  Post your link on social media, portfolios, resumes, or team channels.
                </p>
                <p className="text-[13px] opacity-80">
                  Anyone who opens the link can send you an anonymous message — no account needed on their end. You can also create up to 2 product-specific links for targeted feedback.
                </p>
              </article>
            </div>

            {/* Step 03 — Read & Manage */}
            <div className="relative flex items-start gap-4 sm:gap-8">
              <div className="relative flex flex-col items-center shrink-0 w-[40px] sm:w-[60px]">
                <div className="absolute top-0 bottom-[-40px] left-1/2 w-px bg-white" />
                <div className="relative z-10 bg-[#131313] py-2 font-display text-[28px] sm:text-[34px] text-white">
                  03
                </div>
              </div>
              <article className="relative w-full rounded-[20px] p-6 sm:p-8 bg-[#131313] border border-[#3cffd0] text-white transition-colors duration-150">
                <div className="flex items-center gap-3">
                  <span className="font-sans-thin-caps text-[14px] text-[#949494]">YOUR DASHBOARD</span>
                  <LayoutDashboard className="h-4 w-4 text-[#3cffd0]" />
                </div>
                <h3 className="font-display text-[34px] leading-[0.9] mt-4 mb-2 text-white">READ & MANAGE</h3>
                <p className="text-[16px] font-bold text-white mb-2">
                  All messages arrive in your private dashboard — organized, filterable, and fully under your control.
                </p>
                <p className="text-[13px] text-[#949494]">
                  Toggle message acceptance on or off. Filter by sentiment. Star important messages. Delete what you don&apos;t need. Create product-specific inboxes. Get email alerts for new messages.
                </p>
              </article>
            </div>

            {/* End of rail cap */}
            <div className="relative flex items-start gap-4 sm:gap-8">
              <div className="relative flex flex-col items-center shrink-0 w-[40px] sm:w-[60px]">
                <div className="absolute top-0 h-[40px] left-1/2 w-px bg-white" />
                <div className="relative z-10 bg-[#131313] py-2 mt-8 font-mono-caps text-[11px] text-[#3cffd0]">
                  DONE
                </div>
              </div>
            </div>
          </div>

          {/* Sender Callout */}
          <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_auto] items-center">
            <article className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
              <div className="flex items-center gap-3 mb-4">
                <Send className="h-5 w-5 text-[#3cffd0]" />
                <span className="font-mono-caps text-[11px] text-[#3cffd0]">FOR SENDERS</span>
              </div>
              <h3 className="font-display text-[30px] sm:text-[40px] leading-[0.9] text-white mb-3">
                WANT TO SEND FEEDBACK?
              </h3>
              <p className="text-[16px] text-white font-bold mb-2">No account needed. Just open any Unsaid link, type your message, and hit send.</p>
              <p className="text-[13px] text-[#949494]">
                Stuck on what to say? The AI suggestion engine generates thoughtful prompts — one appreciation, one constructive thought, and one reflective question — so your feedback is always meaningful.
              </p>
            </article>
            <div className="flex flex-col gap-3">
              <Link href="/signup" className="jelly-mint-pill h-12 px-8 flex items-center justify-center gap-2 text-center">
                GET YOUR LINK
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/faq" className="dark-slate-pill h-12 px-8 flex items-center justify-center gap-2 text-center">
                READ THE FAQ
              </Link>
            </div>
          </div>
        </section>

        {/* Carousel Section Full Width */}
        <div className="mt-32 border-t border-[#313131] pt-16">
          <MessageTimeCarousel />
        </div>
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#ffffff] bg-[#131313] mt-20 pt-16 pb-12">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-6 group transition-transform hover:scale-[1.02]">
                <Logo />
              </Link>
              <p className="max-w-md text-[#949494] text-[16px] leading-[1.6]">
                Privacy-first anonymous feedback. Collect candid input in a secure and structured way to turn opinions into action.
              </p>
            </div>

            <div>
              <h3 className="font-mono-caps text-[11px] text-[#949494] mb-4">PRODUCT</h3>
              <nav className="flex flex-col gap-4">
                <Link href="#features" className="font-sans-thin-caps text-[16px] text-white verge-link">FEATURES</Link>
                <Link href="#how-it-works" className="font-sans-thin-caps text-[16px] text-white verge-link">WORKFLOW</Link>
                <Link href="/dashboard" className="font-sans-thin-caps text-[16px] text-white verge-link">DASHBOARD</Link>
              </nav>
            </div>

            <div>
              <h3 className="font-mono-caps text-[11px] text-[#949494] mb-4">ACCOUNT & LEGAL</h3>
              <div className="flex flex-col gap-4">
                <HomeFooterAccountLinks />
                <Link href="/privacy-policy" className="font-sans-thin-caps text-[16px] text-white verge-link">PRIVACY</Link>
                <Link href="/terms-of-service" className="font-sans-thin-caps text-[16px] text-white verge-link">TERMS</Link>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-[#313131] flex justify-between font-mono-caps text-[11px] text-[#949494]">
            <p>&copy; {currentYear} UNSAID.</p>
            <p>DESIGNED FOR CLARITY</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
