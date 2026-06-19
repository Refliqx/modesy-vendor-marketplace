"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocale, useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First Name must be at least 2 characters"),
    lastName: z.string().min(2, "Last Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .regex(/[0-9]/, "Password must contain at least 1 number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character"),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms & Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const openAuthModal = useAuthModalStore((state) => state.open);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const turnstileRef = useRef<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: RegisterFormValues) => {
    if (!turnstileToken) {
      toast.error("Please complete Turnstile verification.");
      return;
    }

    setLoading(true);

    try {
      const verifyRes = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        turnstileRef.current?.reset();
        setTurnstileToken(null);
        toast.error("Security check failed. Please try again.");
        return;
      }

      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            full_name: `${values.firstName} ${values.lastName}`,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      toast.success("Account created! Please check your email.");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 px-4 sm:px-0">
      <h1 className="text-3xl font-bold text-center mb-4 text-text-main">{t("registerBtn")}</h1>

      <GoogleAuthButton />

      <div className="flex items-center justify-center my-2 select-none">
        <span className="text-sm text-text-light font-medium">{t("orWithEmail")}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder={t("firstName")}
            {...register("firstName")}
            className="w-full h-[52px] px-4 border border-border rounded-md text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder={t("lastName")}
            {...register("lastName")}
            className="w-full h-[52px] px-4 border border-border rounded-md text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <input
          type="email"
          placeholder={t("email")}
          {...register("email")}
          className="w-full h-[52px] px-4 border border-border rounded-md text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={t("password")}
          {...register("password")}
          className="w-full h-[52px] pl-4 pr-10 border border-border rounded-md text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-placeholder hover:text-text-main cursor-pointer"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder={t("confirmPassword")}
          {...register("confirmPassword")}
          className="w-full h-[52px] pl-4 pr-10 border border-border rounded-md text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-placeholder hover:text-text-main cursor-pointer"
        >
          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            {...register("agreeToTerms")}
            className="w-4 h-4 rounded border-border accent-primary cursor-pointer flex-shrink-0"
          />
          <span className="text-sm text-text-muted">
            {t("termsAgree")}{" "}
            <a
              href={`/${locale}/terms`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-main font-semibold underline hover:text-primary transition-colors"
            >
              {t("termsLink")}
            </a>
          </span>
        </label>
        {errors.agreeToTerms && (
          <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms.message}</p>
        )}
      </div>

      <div className="w-full">
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_CF_TURNSTILE_SITEKEY || "0x4AAAAAADjILkNXIAjY0t3f"}
          onSuccess={(token: string) => setTurnstileToken(token)}
          options={{
            theme: "light",
            size: "flexible",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !turnstileToken}
        className="w-full h-[52px] bg-primary hover:bg-primary-hover text-white font-semibold rounded-md flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none mt-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          t("registerBtn")
        )}
      </button>

      <div className="text-center mt-4 text-sm text-text-muted">
        <span>{t("hasAccount")} </span>
        <button
          type="button"
          onClick={openAuthModal}
          className="text-primary underline font-medium hover:text-primary-hover cursor-pointer"
        >
          {t("loginBtn")}
        </button>
      </div>
    </form>
  );
}