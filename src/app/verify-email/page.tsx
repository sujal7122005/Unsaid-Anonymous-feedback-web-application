"use client";

import React, { useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
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
    if (code.length !== 6) {
      toast.error("Please enter the full 6-digit code.", { duration: 2000 });
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
      toast.success("Email verified successfully!", { duration: 3000 });
      router.push("/login");
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 border-t border-gray-200">
      <div className="w-full max-w-md animate-[fadeIn_0.5s_ease-out]">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-black tracking-tight">
            Verify Email
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Card */}
        <div className="border border-gray-600 rounded-2xl p-8 shadow-sm animate-[slideUp_0.4s_ease-out]">
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
                  className="w-12 h-14 text-center text-xl font-semibold text-black border border-gray-300 rounded-lg outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8 animate-[fadeIn_0.6s_ease-out]">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="text-black font-medium hover:underline underline-offset-4 transition-all duration-200 cursor-pointer"
          >
            Resend
          </button>
        </p>
      </div>

      {/* Keyframe Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}