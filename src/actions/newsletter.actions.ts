"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribeNewsletterAction(email: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email } as any);

  if (error) {
    if (error.code === "23505") {
      return { error: "You are already subscribed!" };
    }
    return { error: error.message };
  }

  return { success: true };
}

export async function getNewsletterSubscribers() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const profile = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
    .then(r => r.data);

  if (profile?.role !== "admin") return [];

  const { data } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false }) as any;

  return data || [];
}
