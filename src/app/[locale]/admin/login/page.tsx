"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, Mail, Lock } from "lucide-react";
import { checkAdminExistsAction, registerAsAdminAction } from "@/actions/vendor.actions";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminExistsAction().then(r => setAdminExists(r.exists));
  }, []);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { toast.error(error.message); setLoading(false); return; }
    if (!data.user) { toast.error("Login failed"); setLoading(false); return; }

    const profile = await supabase.from("profiles").select("role").eq("id", data.user.id).single().then(r => r.data);
    if (profile?.role === "admin" || profile?.role === "moderator") {
      router.push(`/${locale}/admin`);
      return;
    }

    // If no admin exists yet, keep user logged in so they can register
    const { exists } = await checkAdminExistsAction();
    if (!exists) {
      setAdminExists(false);
      setLoading(false);
      return;
    }

    toast.error("You do not have admin or moderator access");
    await supabase.auth.signOut();
    setLoading(false);
  };

  const handleRegisterAdmin = async () => {
    const res = await registerAsAdminAction();
    if (res.error) { toast.error(res.error); return; }
    toast.success("You are now admin!");
    router.push(`/${locale}/admin`);
  };

  return (
    <div className="min-h-screen bg-[#d2d6de] flex items-center justify-center px-4 select-none">
      <div className="w-full max-w-[360px]">
        {/* Title */}
        <div className="text-center mb-5">
          <h1 className="text-[34px] font-light text-[#333333] tracking-wide leading-tight">
            <span className="font-semibold text-[#222222]">Modesy</span> Panel
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-300 p-5 rounded-none shadow-sm">
          <p className="text-center text-[#444444] text-[18px] font-normal mb-5">Login</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-[38px] px-3 pr-10 bg-white border border-[#d2d6de] rounded-none text-sm text-[#555555] placeholder-gray-400 focus:outline-none focus:border-[#3c8dbc]"
                placeholder="Email"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777]">
                <Mail size={16} />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full h-[38px] px-3 pr-10 bg-white border border-[#d2d6de] rounded-none text-sm text-[#555555] placeholder-gray-400 focus:outline-none focus:border-[#3c8dbc]"
                placeholder="Password"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777]">
                <Lock size={16} />
              </div>
            </div>

            {/* Login Button aligned to the right */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={loading}
                className="h-[38px] px-6 bg-[#3c8dbc] hover:bg-[#367fa9] active:bg-[#307196] disabled:opacity-50 text-white font-medium text-sm rounded-none transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          {adminExists === false && (
            <div className="mt-6 text-center border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500 mb-2">No admin account exists yet.</p>
              <button
                type="button"
                onClick={handleRegisterAdmin}
                className="h-9 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-none border border-gray-300 transition-colors cursor-pointer"
              >
                Register as First Admin
              </button>
            </div>
          )}
        </div>

        {/* Go to the Homepage Link */}
        <p className="text-center text-sm mt-4">
          <a href={`/${locale}`} className="text-[#3c8dbc] hover:text-[#2d689c] hover:underline transition-colors">
            Go to the Homepage
          </a>
        </p>
      </div>
    </div>
  );
}
