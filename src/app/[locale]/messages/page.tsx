import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { MessageSquare } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function MessagesPage({ params }: PageProps) {
  const { locale } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/callback`);
  }

  return (
    <div className="flex flex-col flex-1 bg-gray-50/50 min-h-screen">
      <Breadcrumb items={[
        { label: "Home", href: `/${locale}` },
        { label: "Messages" },
      ]} />

      <div className="max-w-screen-xl mx-auto px-6 py-8 w-full flex-1 flex flex-col">
        <h1 className="text-3xl font-bold text-text-main mb-8 font-sans">Messages</h1>

        <div className="flex-1 bg-white rounded-lg border border-gray-150 shadow-sm p-12 min-h-[400px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
            <MessageSquare size={32} className="text-primary" />
          </div>
          <p className="text-gray-500 font-semibold text-base mb-1 font-sans">No messages found!</p>
          <p className="text-gray-400 text-sm max-w-sm font-sans">Contact sellers from their product or profile pages to start a conversation.</p>
        </div>
      </div>
    </div>
  );
}
