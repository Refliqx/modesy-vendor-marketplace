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
import { TopbarSkeleton } from "@/components/layout/TopbarSkeleton";
import { NavbarSkeleton } from "@/components/layout/NavbarSkeleton";
import { CategoryNavSkeleton } from "@/components/layout/CategoryNavSkeleton";

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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Modesy",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0BAF9A",
};

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

async function TopbarSection() {
  const supabase = await createClient();
  const { data: languages } = await (supabase
    .from("languages")
    .select("id, name, code, text_direction")
    .eq("status", true)
    .order("is_default", { ascending: false }) as any);

  return <Topbar languages={languages || []} />;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!["en", "ar"].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-body-bg text-text-main">
        <NextIntlClientProvider messages={messages}>
          <header className="w-full flex flex-col">
            <Suspense fallback={<TopbarSkeleton />}>
              <TopbarSection />
            </Suspense>
            <Suspense fallback={<NavbarSkeleton />}>
              <Navbar />
            </Suspense>
            <Suspense fallback={<CategoryNavSkeleton />}>
              <CategoryNav />
            </Suspense>
          </header>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <LoginModal />
          <Toaster />
          <SonnerToaster position="top-right" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
