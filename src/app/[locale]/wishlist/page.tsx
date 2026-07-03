import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/server";
import { WishlistPageClient } from "@/components/features/products/WishlistPageClient";
import { fetchWishlistAuthenticated } from "@/lib/queries/fetch-wishlist";
import { fetchWishlistProducts } from "@/lib/queries/fetch-wishlist-products";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: "Wishlist",
  description: "View and manage your saved products on Modesy.",
};

export default async function WishlistPage({ params }: PageProps) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const queryClient = new QueryClient();

  if (user) {
    await queryClient.prefetchQuery({
      queryKey: ["wishlist", user.id],
      queryFn: () => fetchWishlistAuthenticated(supabase as any, user.id),
    });

    const products = await fetchWishlistProducts(supabase as any, user.id, locale);
    queryClient.setQueryData(["wishlist-products", locale], products);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WishlistPageClient locale={locale} />
    </HydrationBoundary>
  );
}
