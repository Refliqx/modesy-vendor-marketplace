"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocale, useTranslations } from "next-intl";
import { X, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginModal() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const { isOpen, close } = useAuthModalStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  if (!isOpen) return null;

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Welcome back to Modesy!");
      
      reset();
      close();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-50 overflow-y-auto px-4">
      <div className="relative bg-white rounded-xl max-w-md w-full mt-12 sm:mt-20 mx-4 sm:mx-auto p-8 shadow-2xl font-sans">
        {/* Close Button */}
        <button
          type="button"
          onClick={close}
          className="absolute top-4 right-4 text-placeholder hover:text-text-main cursor-pointer"
        >
          <X size={20} />
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center mb-2 text-text-main">{t("loginBtn")}</h2>
          
          <GoogleAuthButton />

          <div className="flex items-center justify-center my-2 select-none">
            <span className="text-sm text-text-light font-medium">{t("orWithEmailLogin")}</span>
          </div>

          {/* Email Address */}
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

          {/* Password Field */}
          <div>
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
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
            <div className="text-right mt-1">
              <button
                type="button"
                className="text-primary hover:text-primary-hover text-sm font-medium cursor-pointer"
              >
                {t("forgotPassword")}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] bg-primary hover:bg-primary-hover text-white font-semibold rounded-md flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              t("loginBtn")
            )}
          </button>

          {/* Footer Link */}
          <div className="text-center mt-4 text-sm text-text-muted">
            <span>{t("noAccount")} </span>
            <button
              type="button"
              onClick={() => {
                close();
                router.push(`/${locale}/register`);
              }}
              className="text-primary underline font-medium hover:text-primary-hover cursor-pointer"
            >
              {t("registerBtn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
