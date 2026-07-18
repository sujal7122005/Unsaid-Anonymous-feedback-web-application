"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/src/lib/auth-client";
import toast from "react-hot-toast";
import { loginSchema } from "@/src/velidationSchemas/loginSchemaVelidation";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { data: session, isPending } = authClient.useSession()
  useEffect(() => {
   if (session && !isPending) {
    redirect("/dashboard")
   }
  }, [session, isPending])
  

  const validateField = (field: "email" | "password", value: string) => {
    const fieldSchema = loginSchema.shape[field];
    const result = fieldSchema.safeParse(value);
    if (result.success) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } else {
      const message = result.error?.issues?.[0]?.message ?? "Invalid input";
      setErrors((prev) => ({ ...prev, [field]: message }));
    }
  };

    async function handleGoogleLogin() {
        const data = await authClient.signIn.social({
            provider: "google",
        });
        toast.success("Redirecting to Google for authentication...", { duration: 2000 });
        console.log("data", data);
    }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const nextErrors: typeof errors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof errors;
        if (!nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });
      setErrors(nextErrors);
      toast.error("Please fix the errors in the form.", { duration: 2000 });
      return;
    }

    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
      callbackURL: "/dashboard",
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
    <div className="relative min-h-[calc(100vh-80px)] bg-[#131313] flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-10 space-y-4 text-center flex flex-col items-center">
          <h1 className="font-display text-[40px] sm:text-[50px] leading-[0.9] text-white uppercase">
            WELCOME BACK
          </h1>
          <p className="font-mono-caps text-[12px] text-[#949494]">
            SIGN IN TO YOUR UNSAID ACCOUNT
          </p>
        </div>

        {/* Form Card */}
        <div className="relative border border-[#ffffff] rounded-[20px] p-8 bg-[#131313]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block font-mono-caps text-[11px] text-[#949494] mb-2"
              >
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  if (value.length === 0) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  } else {
                    validateField("email", value);
                  }
                }}
                placeholder="YOU@EXAMPLE.COM"
                className={`w-full px-4 py-3 border rounded-[2px] bg-[#131313] text-white text-[16px] font-sans placeholder-[#313131] outline-none transition-colors duration-150 focus:ring-0 ${
                  errors.email
                    ? "border-[#5200ff] focus:border-[#5200ff]"
                    : "border-[#313131] focus:border-[#3cffd0]"
                }`}
              />
              {errors.email && (
                <p className="mt-2 font-mono-caps text-[11px] text-[#5200ff]">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block font-mono-caps text-[11px] text-[#949494] mb-2"
              >
                PASSWORD
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPassword(value);
                    if (value.length === 0) {
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    } else {
                      validateField("password", value);
                    }
                  }}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border rounded-[2px] bg-[#131313] text-white text-[16px] font-sans placeholder-[#313131] outline-none transition-colors duration-150 focus:ring-0 pr-12 ${
                    errors.password
                      ? "border-[#5200ff] focus:border-[#5200ff]"
                      : "border-[#313131] focus:border-[#3cffd0]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#949494] hover:text-[#3cffd0] transition-colors duration-150"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 font-mono-caps text-[11px] text-[#5200ff]">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full jelly-mint-pill mt-4 flex items-center justify-center gap-2"
            >
              SIGN IN
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-[#313131]" />
            <span className="px-4 font-mono-caps text-[11px] text-[#949494]">OR</span>
            <div className="flex-1 h-px bg-[#313131]" />
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-[#ffffff] rounded-[24px] px-6 py-2.5 bg-transparent font-mono-caps text-[12px] text-white hover:bg-[#ffffff] hover:text-black transition-colors duration-150"
          >
            <svg width="14" height="14" viewBox="0 0 24 24">
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
            SIGN IN WITH GOOGLE
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-center font-sans-thin-caps text-[14px] text-[#949494] mt-8">
          DON'T HAVE AN ACCOUNT?{" "}
          <Link
            href="/signup"
            className="text-[#ffffff] verge-link"
          >
            SIGN UP
          </Link>
        </p>
      </div>
    </div>
  );
}