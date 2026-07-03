"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { MessageSquare, Send, ChevronRight, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMessages, sendMessageAction, markConversationRead } from "@/actions/message.actions";

interface Convo {
  conversation_id: number;
  conversations: { id: number; subject: string; updated_at: string; created_at: string };
  last_read_at: string;
}

interface MessagesClientProps {
  locale: string;
  userId: string;
  conversations: Convo[];
  selectedConversationId: number | null;
}

export function MessagesClient({ locale, userId, conversations: initialConvos, selectedConversationId }: MessagesClientProps) {
  const router = useRouter();
  const [convos, setConvos] = useState(initialConvos);
  const [selectedId, setSelectedId] = useState<number | null>(selectedConversationId);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedId) {
      getMessages(selectedId).then(setMessages);
      markConversationRead(selectedId);
    }
  }, [selectedId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedId) return;
    setSending(true);
    const res = await sendMessageAction(selectedId, input.trim());
    if (res.success) {
      setInput("");
      const updated = await getMessages(selectedId);
      setMessages(updated);
      router.refresh();
    }
    setSending(false);
  };

  const selectedConvo = convos.find((c) => c.conversation_id === selectedId);

  return (
    <div className="flex flex-col flex-1 bg-gray-50/50 min-h-screen">
      <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Messages" }]} />
      <div className="max-w-screen-xl mx-auto px-6 py-8 w-full flex-1 flex">
        <div className="bg-white rounded-lg border border-gray-150 shadow-sm flex-1 flex overflow-hidden min-h-[500px]">
          {/* Sidebar */}
          <div className="w-72 border-e border-gray-150 flex flex-col shrink-0">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-text-main">Inbox</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {convos.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-400">No conversations yet.</div>
              ) : (
                convos.map((c) => (
                  <button
                    key={c.conversation_id}
                    type="button"
                    onClick={() => setSelectedId(c.conversation_id)}
                    className={cn(
                      "w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer outline-none",
                      selectedId === c.conversation_id && "bg-primary/5 border-s-2 border-s-primary"
                    )}
                  >
                    <p className="text-sm font-semibold text-text-main truncate">{c.conversations.subject || "No subject"}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {new Date(c.conversations.updated_at).toLocaleDateString()}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Main Chat */}
          <div className="flex-1 flex flex-col">
            {selectedId && selectedConvo ? (
              <>
                <div className="p-4 border-b border-gray-100 bg-white">
                  <h3 className="text-sm font-bold text-text-main">{selectedConvo.conversations.subject || "Conversation"}</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-sm text-gray-400">No messages yet. Start the conversation!</div>
                  ) : (
                    messages.map((msg: any) => {
                      const isMe = msg.sender_id === userId;
                      return (
                        <div key={msg.id} className={cn("flex gap-2", isMe ? "justify-end" : "justify-start")}>
                          {!isMe && (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-1">
                              <User size={14} className="text-gray-400" />
                            </div>
                          )}
                          <div className={cn(
                            "max-w-[70%] rounded-lg px-4 py-2.5",
                            isMe ? "bg-primary text-white rounded-br-sm" : "bg-gray-100 text-text-main rounded-bl-sm"
                          )}>
                            <p className="text-sm leading-relaxed">{msg.body}</p>
                            <p className={cn("text-[10px] mt-1", isMe ? "text-white/70" : "text-gray-400")}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>
                <div className="p-4 border-t border-gray-100 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 h-10 px-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={sending || !input.trim()}
                      className="h-10 w-10 bg-primary text-white rounded-md flex items-center justify-center hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                  <MessageSquare size={32} className="text-primary" />
                </div>
                <p className="text-gray-500 font-semibold text-sm">Select a conversation</p>
                <p className="text-gray-400 text-xs mt-1">Choose a conversation from the sidebar or start a new one from a product page.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
