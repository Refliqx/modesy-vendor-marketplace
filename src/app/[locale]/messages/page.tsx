import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { MessagesClient } from "./messages-client";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ conversation?: string }>;
}

export default async function MessagesPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { conversation } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/callback`);
  }

  const { data: conversations } = await supabase
    .from("conversation_participants")
    .select(`
      conversation_id,
      conversations!inner(id, subject, updated_at, created_at),
      last_read_at
    `)
    .eq("user_id", user.id)
    .order("conversations(updated_at)", { ascending: false }) as any;

  const selectedId = conversation ? Number(conversation) : (conversations?.[0]?.conversation_id || null);

  return (
    <MessagesClient
      locale={locale}
      userId={user.id}
      conversations={conversations || []}
      selectedConversationId={selectedId}
    />
  );
}
