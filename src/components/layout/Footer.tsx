"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ChevronUp, Users, MessageSquare, Camera, Music, MessageCircle, Video, Headphones, Send, Bookmark, Briefcase, Gamepad2, Globe, Rss, CreditCard } from "lucide-react";
import { toast } from "sonner";



// --- STATIC LINKS ---
const footerLinks = {
  categories: [
    { key: "clothing", slug: "clothing" },
    { key: "shoes", slug: "shoes" },
    { key: "homeLiving", slug: "home-living" },
    { key: "jewelryAccessories", slug: "jewelry-accessories" },
    { key: "toysEntertainment", slug: "toys-entertainment" },
    { key: "graphicsPhotos", slug: "graphics-photos" },
    { key: "videoAudio", slug: "video-audio" },
    { key: "webTemplatesCode", slug: "web-templates-code" },
  ],
  quickLinks: [
    { key: "home", href: "/" },
    { key: "blog", slug: "blog" },
    { key: "shops", href: "/shops" },
    { key: "affiliateProgram", href: "/affiliate-program" },
    { key: "helpCenter", href: "/help-center" },
  ],
  information: [
    { key: "termsConditions", href: "/terms-conditions" },
    { key: "aboutUs", href: "/about-us" },
  ],
  legal: [
    { key: "privacyPolicy", href: "/privacy-policy" },
    { key: "cookiePolicy", href: "/cookie-policy" },
  ]
};

const socialMedia: { name: string; href: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { name: "Facebook", href: "#", icon: Users },
  { name: "Twitter", href: "#", icon: MessageSquare },
  { name: "Instagram", href: "#", icon: Camera },
  { name: "TikTok", href: "#", icon: Music },
  { name: "WhatsApp", href: "#", icon: MessageCircle },
  { name: "YouTube", href: "#", icon: Video },
  { name: "Discord", href: "#", icon: Headphones },
  { name: "Telegram", href: "#", icon: Send },
  { name: "Pinterest", href: "#", icon: Bookmark },
  { name: "LinkedIn", href: "#", icon: Briefcase },
  { name: "Twitch", href: "#", icon: Gamepad2 },
  { name: "VK", href: "#", icon: Globe },
  { name: "RSS", href: "#", icon: Rss },
];

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("You have successfully subscribed to our newsletter!");
    setEmail("");
  };

  const getLocalizedHref = (link: { href?: string; slug?: string }) => {
    if (link.slug) {
      return `/${locale}/${link.slug}`;
    }
    if (link.href) {
      if (link.href.startsWith("/")) {
        return `/${locale}${link.href === "/" ? "" : link.href}`;
      }
      return link.href;
    }
    return "#";
  };

  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto relative font-sans text-text-main">
      {/* Main Footer Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        
        {/* Column 1: Brand details & Social icons */}
        <div className="flex flex-col">
          <Link href={`/${locale}`} className="text-gray-900 text-[28px] font-bold tracking-tight select-none">
            <span>M</span><span className="text-primary font-bold">o</span><span>desy</span>
          </Link>
          <p className="text-gray-500 text-sm mt-4 leading-relaxed font-sans">
            Modesy is a modern e-commerce marketplace where buyers and sellers connect with ease. Whether you are looking to shop for unique items or grow your business by selling online, Modesy is here to help you every step of the way.
          </p>
          
          {/* Social Icons List */}
          <div className="flex flex-wrap gap-2 mt-6">
            {socialMedia.map((soc) => {
              const Icon = soc.icon;
              return (
                <a
                  key={soc.name}
                  href={soc.href}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-white hover:bg-primary hover:border-primary transition-all duration-150"
                  aria-label={soc.name}
                >
                  <Icon className="w-[14px] h-[14px]" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Column 2: Categories */}
        <div className="flex flex-col">
          <h3 className="text-gray-900 text-sm font-semibold mb-4 uppercase tracking-wider">
            {t("categories")}
          </h3>
          <ul className="space-y-2.5">
            {footerLinks.categories.map((link) => (
              <li key={link.key}>
                <Link href={getLocalizedHref(link)} className="text-gray-600 hover:text-primary transition-colors text-[14px]">
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Quick Links & Information */}
        <div className="flex flex-col">
          <h3 className="text-gray-900 text-sm font-semibold mb-4 uppercase tracking-wider">
            {t("quickLinks")}
          </h3>
          <ul className="space-y-2.5 mb-8">
            {footerLinks.quickLinks.map((link) => (
              <li key={link.key}>
                <Link href={getLocalizedHref(link)} className="text-gray-600 hover:text-primary transition-colors text-[14px]">
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="text-gray-900 text-sm font-semibold mb-4 uppercase tracking-wider">
            {t("information")}
          </h3>
          <ul className="space-y-2.5">
            {footerLinks.information.map((link) => (
              <li key={link.key}>
                <Link href={getLocalizedHref(link)} className="text-gray-600 hover:text-primary transition-colors text-[14px]">
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="flex flex-col">
          <h3 className="text-gray-900 text-sm font-semibold mb-4 uppercase tracking-wider">
            Newsletter
          </h3>
          <p className="text-gray-500 text-[13px] leading-relaxed mb-4 font-sans">
            Join our subscribers list to get the latest news, updates and special offers directly in your inbox.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full h-11 px-3.5 border border-gray-200 rounded-md text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-sans"
            />
            <button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-md transition-colors cursor-pointer flex items-center justify-center font-sans outline-none"
            >
              Subscribe
            </button>
          </form>

          {/* Payment Badges */}
          <div className="flex flex-wrap gap-1.5 mt-6">
            <CreditCard className="w-12 h-8" />
            <CreditCard className="w-12 h-8" />
            <CreditCard className="w-12 h-8" />
            <CreditCard className="w-12 h-8" />
            <CreditCard className="w-12 h-8" />
          </div>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-gray-200 py-5 w-full max-w-screen-xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-[13px] text-center sm:text-start select-none">
            Copyright {new Date().getFullYear()} Modesy - {t("copyright")}
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link key={link.key} href={getLocalizedHref(link)} className="text-gray-500 text-[13px] hover:text-primary transition-colors">
                {t(link.key)}
              </Link>
            ))}
          </div>
      </div>

      {/* Floating Scroll-To-Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 bg-[#1B2333] hover:bg-primary text-white w-10 h-10 rounded shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer ${
          showScrollTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp size={20} strokeWidth={2.5} />
      </button>
    </footer>
  );
}
