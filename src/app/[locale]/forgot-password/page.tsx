"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { useAuthModalStore } from "@/stores/useAuthModalStore";

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col flex-1">
      <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Forgot Password" }]} />
      <div className="flex-1 flex items-center justify-center py-16 px-6">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-2">Forgot Password?</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your email and we&apos;ll send you a reset link
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full h-[52px] px-4 border border-border rounded-md text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
            <button
              type="submit"
              className="w-full h-12 bg-primary text-white rounded-md font-semibold text-sm hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Send Reset Link
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Back to{" "}
            <button
              type="button"
              onClick={() => useAuthModalStore.getState().open()}
              className="text-primary hover:underline font-medium cursor-pointer outline-none font-sans"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
