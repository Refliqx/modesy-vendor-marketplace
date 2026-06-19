import { createClient } from "./supabase/client";

export async function signInWithGoogle() {
  const supabase = createClient();
  const redirectTo = `${window.location.origin}/auth/callback`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });
  if (error) throw error;
  return data;
}
