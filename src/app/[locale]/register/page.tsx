import Link from "next/link";
import { getLocale } from "next-intl/server";
import { RegisterForm } from "@/components/features/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  robots: { index: false },
};

export default async function RegisterPage() {
  const locale = await getLocale();

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-lg mx-auto py-16 px-6 font-sans">
        <div className="text-sm text-text-muted mb-8 flex items-center gap-1.5 select-none">
          <Link href={`/${locale}`} className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <span className="font-medium text-text-main">Register</span>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
