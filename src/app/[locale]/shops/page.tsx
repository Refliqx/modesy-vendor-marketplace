import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { Store, Package } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: "Shops",
  description: "Discover unique shops and talented sellers from around the world.",
};

export default async function ShopsPage({ params }: PageProps) {
  const { locale } = await params;

  if (!["en", "ar"].includes(locale)) notFound();

  const supabase = await createClient();

  const { data: vendors } = await supabase
    .from("vendors")
    .select("id, shop_name, shop_slug, shop_logo, shop_description, is_verified")
    .eq("status", true)
    .order("shop_name", { ascending: true }) as any;

  return (
    <div className="flex flex-col flex-1 bg-gray-50 pb-12">
      <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Shops" }]} />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-text-main">Shops</h1>
          <p className="text-sm text-gray-500 mt-1">Discover unique shops and talented sellers from around the world.</p>
        </div>

        {!vendors || vendors.length === 0 ? (
          <div className="bg-white rounded-md border border-gray-200 p-12 text-center">
            <Store size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">No shops found.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {vendors.map((v: any) => (
              <Link
                key={v.id}
                href={`/${locale}/profile/${v.shop_slug}`}
                className="bg-white rounded-md border border-gray-200 p-5 hover:border-primary/30 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 overflow-hidden">
                    {v.shop_logo ? (
                      <img src={v.shop_logo} alt={v.shop_name} className="w-full h-full object-cover" />
                    ) : (
                      <Store size={24} className="text-primary" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-text-main text-sm truncate group-hover:text-primary transition-colors">
                        {v.shop_name}
                      </h3>
                      {v.is_verified && (
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold shrink-0">
                          Verified
                        </span>
                      )}
                    </div>
                    {v.shop_description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{v.shop_description}</p>
                    )}
                    <div className="flex items-center gap-1 mt-2 text-[11px] text-gray-400">
                      <Package size={12} />
                      <span>View Products</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
