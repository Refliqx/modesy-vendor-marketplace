"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { Mail, Phone, MapPin, Users, MessageSquare, Camera, Music, MessageCircle, Video, Headphones, Send, Bookmark, Briefcase, Gamepad2, Globe } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface SocialLink { name: string; url: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }

const socialLinks: SocialLink[] = [
  { name: "Facebook", url: "https://facebook.com", icon: Users },
  { name: "Twitter", url: "https://twitter.com", icon: MessageSquare },
  { name: "Instagram", url: "https://instagram.com", icon: Camera },
  { name: "TikTok", url: "https://tiktok.com", icon: Music },
  { name: "WhatsApp", url: "https://whatsapp.com", icon: MessageCircle },
  { name: "YouTube", url: "https://youtube.com", icon: Video },
  { name: "Discord", url: "https://discord.com", icon: Headphones },
  { name: "Telegram", url: "https://telegram.org", icon: Send },
  { name: "Pinterest", url: "https://pinterest.com", icon: Bookmark },
  { name: "LinkedIn", url: "https://linkedin.com", icon: Briefcase },
  { name: "Twitch", url: "https://twitch.tv", icon: Gamepad2 },
  { name: "VK", url: "https://vk.com", icon: Globe },
];

export default function ContactPage() {
  const t = useTranslations("contactPage");
  const locale = useLocale();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!agree) {
      toast.error(t("termsError"));
      return;
    }

    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      toast.success(t("successMessage"));
      setName("");
      setEmail("");
      setMessage("");
      setAgree(false);
    }, 800);
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50 pb-12 select-none">
      <Breadcrumb
        items={[
          { label: "Home", href: `/${locale}` },
          { label: t("title") },
        ]}
      />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="bg-white rounded-md border border-gray-200 p-6 sm:p-8">
          <h1 className="text-[28px] font-bold text-text-main mb-6 border-b border-gray-200 pb-4">
            {t("title")}
          </h1>

          <div className="space-y-4 text-text-main leading-relaxed text-sm mb-10">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-semibold text-text-main mb-6">{t("leaveMessage")}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <input
                      type="text"
                      placeholder={t("name")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-[52px] px-4 border border-border rounded-md text-sm text-text-main placeholder-placeholder bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-start"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="email"
                      placeholder={t("email")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-[52px] px-4 border border-border rounded-md text-sm text-text-main placeholder-placeholder bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-start"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <textarea
                    placeholder={t("message")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full border border-border rounded-md p-4 text-sm text-text-main placeholder-placeholder bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-none text-start"
                    required
                  />
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-1 cursor-pointer w-4 h-4 accent-primary"
                  />
                  <label htmlFor="terms-checkbox" className="text-xs text-gray-500 cursor-pointer select-none leading-relaxed text-start">
                    {t("termsAgree")}{" "}
                    <Link href={`/${locale}/terms`} className="text-primary hover:underline">
                      {t("termsLink")}
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary-hover text-white h-12 px-8 rounded-md font-semibold text-sm cursor-pointer transition-colors disabled:opacity-50 inline-flex items-center justify-center min-w-[120px] outline-none"
                >
                  {loading ? "..." : t("submit")}
                </button>
              </form>
            </div>

            <div>
              <div className="space-y-6 pt-4">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-semibold text-text-main mt-0.5" dir="ltr">(541) 754-3010</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-semibold text-text-main mt-0.5">edward_test@domain.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Address</p>
                    <p className="text-sm font-semibold text-text-main mt-0.5">
                      3111 Camino Del Rio N Suite 400 San Diego
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media Link Grid */}
              <div className="mt-8 pt-4">
                <div className="flex flex-wrap gap-2.5">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all hover:bg-primary/5 shrink-0"
                        title={social.name}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Embed Container */}
          <div className="mt-12 w-full rounded-md border border-gray-200 overflow-hidden shadow-sm aspect-[21/9] min-h-[300px]">
            <iframe
              src="https://maps.google.com/maps?q=3111%20Camino%20Del%20Rio%20N%20Suite%20400%2C%20San%20Diego%2C%20CA%2092108%2C%20USA&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
