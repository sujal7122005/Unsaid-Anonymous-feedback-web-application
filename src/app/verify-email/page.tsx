"use client";

import React, { Suspense, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { verifySchema } from "@/src/velidationSchemas/verifySchema";
import toast from "react-hot-toast";

function VerifyEmailContent() {

  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // const { data: session, isPending } = authClient.useSession()
  //     useEffect(() => {
  //      if (session && !isPending) {
  //       redirect("/")
  //      }
  //     }, [session, isPending])

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (errorText) setErrorText("");
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    const validation = verifySchema.safeParse({ verificationcode: code });
    if (!validation.success) {
      const message = validation.error.issues[0]?.message || "Invalid code.";
      setErrorText(message);
      toast.error(message, { duration: 2000 });
      return;
    }
    setLoading(true);
    const { error } = await authClient.emailOtp.verifyEmail({
      email,
      otp: code,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Invalid OTP. Please try again.", { duration: 3000 });
    } else {
      const signOutResult = await authClient.signOut();
      if (signOutResult?.error) {
        toast.error(signOutResult.error.message || "Verified, but failed to clear session.", { duration: 3000 });
        return;
      }
      toast.success("Email verified successfully! Please login.", { duration: 3000 });
      window.location.assign("/login");
    }
  }

  async function handleResend() {
    if (!email) {
      toast.error("Email not found. Please sign up again.", { duration: 2000 });
      return;
    }
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });
    if (error) {
      toast.error("Failed to resend code.", { duration: 2000 });
    } else {
      toast.success("New code sent to your email!", { duration: 2000 });
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-[#131313] flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-10 space-y-4 text-center flex flex-col items-center">
          <h1 className="font-display text-[40px] sm:text-[50px] leading-[0.9] text-white uppercase">
            VERIFY EMAIL
          </h1>
          <p className="font-mono-caps text-[12px] text-[#949494]">
            ENTER THE 6-DIGIT CODE SENT TO YOUR EMAIL
          </p>
        </div>

        {/* Card */}
        <div className="relative border border-[#ffffff] rounded-[20px] p-8 bg-[#131313]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* OTP Inputs */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-14 text-center text-[24px] font-sans font-bold text-white border border-[#313131] bg-[#131313] rounded-[2px] outline-none transition-colors duration-150 focus:border-[#3cffd0] focus:ring-0"
                />
              ))}
            </div>

            {errorText && (
              <p className="text-center font-mono-caps text-[11px] text-[#5200ff]">{errorText}</p>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 flex items-center justify-center gap-2 ${
                loading
                  ? "border border-[#313131] bg-transparent text-[#949494] rounded-[24px] px-6 py-2.5 font-mono-caps text-xs font-semibold cursor-not-allowed"
                  : "jelly-mint-pill cursor-pointer"
              }`}
            >
              {loading ? "VERIFYING..." : "VERIFY"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center font-sans-thin-caps text-[14px] text-[#949494] mt-8">
          DIDN'T RECEIVE THE CODE?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="text-[#ffffff] verge-link cursor-pointer uppercase"
          >
            RESEND
          </button>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-80px)] bg-[#131313] flex items-center justify-center px-4">
          <p className="font-mono-caps text-[12px] text-[#949494]">LOADING...</p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}