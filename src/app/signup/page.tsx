"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import toast from "react-hot-toast";
import { signupSchema } from "@/src/velidationSchemas/signupSchemaVelidation";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { data: session, isPending } = authClient.useSession()
    useEffect(() => {
     if (session && !isPending) {
      redirect("/dashboard")
     }
    }, [session, isPending])

  // Username uniqueness states
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameUnique, setIsUsernameUnique] = useState<boolean | null>(null);

  // Form validation errors (from Zod)
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});

  // Form submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced username uniqueness check
  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setUsernameMessage("");
        setIsUsernameUnique(null);
        setIsCheckingUsername(false);
        return;
      }

      // First validate username format with Zod before calling API
      const usernameValidation = signupSchema.shape.username.safeParse(username);
      if (!usernameValidation.success) {
        setUsernameMessage(usernameValidation.error.issues[0].message);
        setIsUsernameUnique(false);
        setIsCheckingUsername(false);
        return;
      }

      setIsCheckingUsername(true);
      setUsernameMessage("");

      try {
        const res = await fetch(`/api/CheckUniqueUsername?username=${encodeURIComponent(username)}`);
        const data = await res.json();

        if (res.ok) {
          setUsernameMessage(data.message);
          setIsUsernameUnique(data.isUnique);
        } else {
          setUsernameMessage(data.error || "Error checking username");
          setIsUsernameUnique(false);
        }
      } catch {
        setUsernameMessage("Failed to check username");
        setIsUsernameUnique(false);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    // Debounce: wait 500ms after user stops typing
    const debounceTimer = setTimeout(checkUsername, 500);

    return () => clearTimeout(debounceTimer);
  }, [username]);

  // Validate individual fields on change
  const validateField = useCallback(
    (field: "username" | "email" | "password", value: string) => {
      const fieldSchema = signupSchema.shape[field];
      const result = fieldSchema.safeParse(value);

      if (result.success) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      } else {
        const message = result.error?.issues?.[0]?.message ?? "Invalid input";
        setErrors((prev) => ({ ...prev, [field]: message }));
      }
    },
    []
  );

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setUsername(value);
    if (value.length > 0) {
      validateField("username", value);
    } else {
      setErrors((prev) => ({ ...prev, username: undefined }));
      setUsernameMessage("");
      setIsUsernameUnique(null);
    }
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEmail(value);
    if (value.length > 0) {
      validateField("email", value);
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPassword(value);
    if (value.length > 0) {
      validateField("password", value);
    } else {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Full form validation with Zod
    const result = signupSchema.safeParse({ username, email, password });

    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof errors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error("Please fix the errors in the form.", { duration: 3000 });
      return;
    }

    // Check if username is unique before submitting
    if (!isUsernameUnique) {
      toast.error("Please choose a unique username.", { duration: 3000 });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { data, error } = await authClient.signUp.email({
        name: username,
        email,
        password,
        callbackURL: "/verify-email",
      });

      console.log("Signup response:", { data, error });

      if (error) {
        const errorMessage = error.message || "Signup failed. Please try again.";
        console.error("Signup error:", error);
        toast.error(errorMessage, { duration: 4000 });
        return;
      }

      // Send OTP email
      const otpRes = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (otpRes.error) {
        toast.error("Failed to send verification email.", { duration: 3000 });
      } else {
        toast.success("Verification code sent to your email!", {
          duration: 3000,
        });
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch {
      toast.error("An unexpected error occurred.", { duration: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignup() {
    await authClient.signIn.social({ provider: "google" });
    toast.success("Redirecting to Google...", { duration: 2000 });
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-[#131313] flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md">
        <div className="mb-10 space-y-4 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-[2px] border border-[#ffffff] bg-transparent px-3 py-1 font-mono-caps text-[10px] tracking-[0.28em] text-[#3cffd0]">
            WELCOME TO UNSAID
          </div>
          <h1 className="font-display text-[40px] sm:text-[50px] leading-[0.9] text-white uppercase">
            CREATE ACCOUNT
          </h1>
          <p className="font-mono-caps text-[12px] text-[#949494]">
            JOIN UNSAID AND RECEIVE ANONYMOUS FEEDBACK
          </p>
        </div>

        <div className="relative border border-[#ffffff] rounded-[20px] p-8 bg-[#131313]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block font-mono-caps text-[11px] text-[#949494] mb-2">
                USERNAME
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="USERNAME"
                  className={`w-full px-4 py-3 border rounded-[2px] bg-[#131313] text-white text-[16px] font-sans placeholder-[#313131] outline-none transition-colors duration-150 focus:ring-0 pr-12 ${
                    errors.username
                      ? "border-[#5200ff] focus:border-[#5200ff]"
                      : isUsernameUnique === true
                        ? "border-[#3cffd0] focus:border-[#3cffd0]"
                        : "border-[#313131] focus:border-[#3cffd0]"
                  }`}
                />
                {/* Loading spinner or status icon */}
                {isCheckingUsername && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className="animate-spin h-4 w-4 text-[#949494]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                )}
                {!isCheckingUsername && isUsernameUnique === true && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className="h-4 w-4 text-[#3cffd0]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {!isCheckingUsername && isUsernameUnique === false && username.length >= 3 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className="h-4 w-4 text-[#5200ff]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {/* Validation error message */}
              {errors.username && (
                <p className="mt-2 font-mono-caps text-[11px] text-[#5200ff]">{errors.username}</p>
              )}
              {/* Username uniqueness message */}
              {!errors.username && usernameMessage && (
                <p className={`mt-2 font-mono-caps text-[11px] ${isUsernameUnique ? "text-[#3cffd0]" : "text-[#5200ff]"}`}>
                  {usernameMessage}
                </p>
              )}
              {/* Checking indicator text */}
              {isCheckingUsername && (
                <p className="mt-2 font-mono-caps text-[11px] text-[#949494]">CHECKING AVAILABILITY...</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block font-mono-caps text-[11px] text-[#949494] mb-2">
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
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

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block font-mono-caps text-[11px] text-[#949494] mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="MIN 6 CHARACTERS"
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

            {/* Submit Button with Loading State */}
            <button
              type="submit"
              disabled={isSubmitting || isCheckingUsername}
              className={`w-full mt-4 flex items-center justify-center gap-2 ${
                isSubmitting || isCheckingUsername
                  ? "border border-[#313131] bg-transparent text-[#949494] rounded-[24px] px-6 py-2.5 font-mono-caps text-xs font-semibold cursor-not-allowed"
                  : "jelly-mint-pill cursor-pointer"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-[#949494]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  CREATING ACCOUNT...
                </>
              ) : (
                "SIGN UP"
              )}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-[#313131]" />
            <span className="px-4 font-mono-caps text-[11px] text-[#949494]">OR</span>
            <div className="flex-1 h-px bg-[#313131]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 border border-[#ffffff] rounded-[24px] px-6 py-2.5 bg-transparent font-mono-caps text-[12px] text-white hover:bg-[#ffffff] hover:text-black transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.07l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            SIGN UP WITH GOOGLE
          </button>
        </div>

        <p className="text-center font-sans-thin-caps text-[14px] text-[#949494] mt-8">
          ALREADY HAVE AN ACCOUNT?{" "}
          <Link href="/login" className="text-[#ffffff] verge-link">
            LOG IN
          </Link>
        </p>
      </div>
    </div>
  );
}