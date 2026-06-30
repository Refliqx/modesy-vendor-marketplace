import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { EditProfileClient } from "./EditProfileClient";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function EditProfilePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { tab = "profile" } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/callback`);
  }

  // Fetch profiles table details
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, phone_number")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    // Fallback if profile row is not yet created
    const fallbackProfile = {
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
      avatar_url: user.user_metadata?.avatar_url || null,
      phone_number: null,
    };
    return (
      <div className="flex flex-col flex-1 bg-gray-50/50 min-h-screen">
        <Breadcrumb items={[
          { label: "Home", href: `/${locale}` },
          { label: "Profile Settings" },
          { label: "Update Profile" },
        ]} />
        <div className="max-w-screen-xl mx-auto px-6 py-8 w-full flex-1">
          <h1 className="text-3xl font-bold text-text-main mb-8 font-sans">Profile Settings</h1>
          <EditProfileClient 
            profile={fallbackProfile} 
            email={user.email || ""} 
            locale={locale}
            initialTab={tab}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-gray-50/50 min-h-screen">
      <Breadcrumb items={[
        { label: "Home", href: `/${locale}` },
        { label: "Profile Settings" },
        { label: "Update Profile" },
      ]} />
      <div className="max-w-screen-xl mx-auto px-6 py-8 w-full flex-1">
        <h1 className="text-3xl font-bold text-text-main mb-8 font-sans">Profile Settings</h1>
        <EditProfileClient 
          profile={profile} 
          email={user.email || ""} 
          locale={locale}
          initialTab={tab}
        />
      </div>
    </div>
  );
}
