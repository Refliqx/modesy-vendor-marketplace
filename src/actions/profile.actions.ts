"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "unauthorized" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.fullName,
      phone_number: data.phoneNumber || null,
      avatar_url: data.avatarUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
