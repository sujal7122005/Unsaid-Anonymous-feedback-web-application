"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authClient } from "@/src/lib/auth-client";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleGoogleLogin() {
        const data = await authClient.signIn.social({
            provider: "google",
        });
        toast.success("Redirecting to Google for authentication...", { duration: 2000 });
        console.log("data", data);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const { data, error } = await authClient.signIn.email({
        email: email, // required
        password: password, // required
        rememberMe: true,
        callbackURL: "/dashboard" // optional, defaults to "/"
        });

        if (error) {
            toast.error(error.message || "An error occurred during sign in", { duration: 2000 });
        }
        if (data) {
            toast.success("Signed in successfully!", { duration: 2000 });
        }
        console.log("data", data);
        

    }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-200 flex items-center justify-center px-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-black/5 blur-3xl animate-[fadeSoft_7s_ease-in-out_infinite]" />
        <div className="absolute -right-16 top-10 h-64 w-64 rounded-full bg-black/8 blur-3xl animate-[fadeSoft_9s_ease-in-out_infinite]" />
      </div>

      <div className="relative w-full max-w-md animate-[fadeIn_0.5s_ease-out] drop-shadow-[0_30px_80px_-50px_rgba(0,0,0,0.55)]">
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-4xl font-black text-black tracking-tight">
            Welcome Back
          </h1>
          <p className="text-base text-gray-600 font-medium">
            Sign in to your Unsaid account
          </p>
        </div>

        {/* Form Card */}
        <div className="relative border border-gray-200 rounded-3xl p-8 shadow-xl bg-white/90 backdrop-blur-sm animate-[slideUp_0.4s_ease-out]">
          <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/60" />
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="group">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800 mb-1.5 uppercase tracking-wider"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-black text-lg font-semibold placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-gray-900/30 focus:border-black"
              />
            </div>

            {/* Password */}
            <div className="group">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800 mb-1.5 uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-black text-lg font-semibold placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-gray-900/30 focus:border-black pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-black text-white text-base font-semibold rounded-xl hover:-translate-y-[1px] hover:shadow-[0_12px_30px_-18px_rgba(0,0,0,0.85)] transition-all duration-200 cursor-pointer"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <span className="px-4 text-xs text-gray-500 font-semibold uppercase tracking-[0.3em]">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-3 text-base font-semibold text-black bg-white transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_10px_28px_-20px_rgba(0,0,0,0.65)] cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.07l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-center text-base text-gray-600 font-medium mt-8 animate-[fadeIn_0.6s_ease-out]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-black font-semibold hover:underline underline-offset-4 transition-all duration-200"
          >
            Sign Up
          </Link>
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
        @keyframes fadeSoft { 0%, 100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.05); } }
      `}</style>
    </div>
  );
}