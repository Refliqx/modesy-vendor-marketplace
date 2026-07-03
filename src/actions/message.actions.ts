"use server";

import { createClient } from "@/lib/supabase/server";

export async function getConversations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("conversation_participants")
    .select(`
      conversation_id,
      conversations!inner(id, subject, updated_at, created_at,
        messages(id, body, created_at, sender_id, profiles!inner(full_name, avatar_url))
      ),
      last_read_at
    `)
    .eq("user_id", user.id)
    .order("conversations(updated_at)", { ascending: false }) as any;

  return data || [];
}

export async function getMessages(conversationId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("messages")
    .select(`
      id, body, created_at, sender_id,
      profiles!inner(full_name, avatar_url)
    `)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true }) as any;

  return data || [];
}

export async function sendMessageAction(conversationId: number, body: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body,
  } as any);

  if (error) return { error: error.message };

  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() } as any)
    .eq("id", conversationId);

  await supabase
    .from("conversation_participants")
    .update({ last_read_at: new Date().toISOString() } as any)
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id);

  return { success: true };
}

export async function startConversationAction(productId: number, vendorId: number, message: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  const { data: convo, error: convoErr } = await supabase
    .from("conversations")
    .insert({ subject: `Inquiry about product #${productId}` } as any)
    .select()
    .single() as any;

  if (convoErr) return { error: convoErr.message };

  const vendor = await supabase
    .from("vendors")
    .select("user_id")
    .eq("id", vendorId)
    .single()
    .then(r => r.data);

  const participants = [user.id];
  if (vendor?.user_id && vendor.user_id !== user.id) {
    participants.push(vendor.user_id);
  }

  for (const uid of participants) {
    await supabase.from("conversation_participants").insert({
      conversation_id: convo.id,
      user_id: uid,
    } as any);
  }

  const { error: msgErr } = await supabase.from("messages").insert({
    conversation_id: convo.id,
    sender_id: user.id,
    body: message,
  } as any);

  if (msgErr) return { error: msgErr.message };
  return { success: true, conversationId: convo.id };
}

export async function markConversationRead(conversationId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("conversation_participants")
    .update({ last_read_at: new Date().toISOString() } as any)
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id);
}
