"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { useAuthModalStore } from "@/stores/useAuthModalStore";

export default function ResetPasswordPage() {
  const locale = useLocale();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col flex-1">
      <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Reset Password" }]} />
      <div className="flex-1 flex items-center justify-center py-16 px-6">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                required
                className="w-full h-[52px] px-4 pr-10 border border-border rounded-md text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer outline-none"
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm Password"
                required
                className="w-full h-[52px] px-4 pr-10 border border-border rounded-md text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer outline-none"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-primary text-white rounded-md font-semibold text-sm hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Reset Password
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            <button
              type="button"
              onClick={() => useAuthModalStore.getState().open()}
              className="text-primary hover:underline font-medium cursor-pointer outline-none font-sans"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
