import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Topbar } from "@/components/layout/Topbar";
import { Navbar } from "@/components/layout/Navbar";
import { CategoryNav } from "@/components/layout/CategoryNav";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { Toaster as SonnerToaster } from "sonner";

import { LoginModal } from "@/components/features/auth/LoginModal";
import { Toaster } from "@/components/ui/toaster";
import { CategoryNavSkeleton } from "@/components/layout/CategoryNavSkeleton";
import { CartInitializer } from "@/components/layout/CartInitializer";
import { PwaRegister } from "@/components/layout/PwaRegister";
import { Footer } from "@/components/layout/Footer";
import { CurrencyInitializer } from "@/components/currency/CurrencyInitializer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { QueryProvider } from "@/lib/query-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Modesy — Online Marketplace",
    template: "%s | Modesy",
  },
  description: "Buy and sell fashion, home goods, digital products, and more on Modesy.",
  keywords: ["marketplace", "fashion", "online shop", "modesy"],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Modesy",
  },
  icons: {
    icon: "/favicon.ico",
    apple: [
      { url: "/icons/icon-192.svg", sizes: "192x192" },
      { url: "/icons/icon-512.svg", sizes: "512x512" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Modesy",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "msapplication-TileColor": "#0BAF9A",
    "msapplication-TileImage": "/icons/icon-192.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0BAF9A" },
    { media: "(prefers-color-scheme: dark)", color: "#0BAF9A" },
  ],
};

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!["en", "ar"].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const supabase = await createClient();

  const [langRes, currRes] = await Promise.all([
    supabase
      .from("languages")
      .select("id, name, code, text_direction")
      .eq("status", true)
      .order("is_default", { ascending: false }),
    supabase
      .from("currencies")
      .select()
      .eq("status", true)
      .order("is_default", { ascending: false }),
  ]);

  const languages = langRes.data || [];
  const currencies = currRes.data || [];
  const langId = locale === "ar" ? 2 : 1;

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-body-bg text-text-main">
         <NextIntlClientProvider messages={messages}>
           <QueryProvider>
           <PwaRegister />
           <CartInitializer />
          <header className="w-full flex flex-col">
            <CurrencyInitializer currencies={currencies} />
            <Topbar languages={languages} />
            <Navbar langId={langId} />
            <Suspense fallback={<CategoryNavSkeleton />}>
              <CategoryNav />
            </Suspense>
          </header>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <CookieConsent />
          <LoginModal />
          <Toaster />
           <SonnerToaster position="top-right" richColors />
           </QueryProvider>
         </NextIntlClientProvider>
      </body>
    </html>
  );
}
