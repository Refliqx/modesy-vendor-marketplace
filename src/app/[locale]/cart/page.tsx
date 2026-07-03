import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/server";
import { fetchCartAuthenticated, fetchCartGuest } from "@/lib/queries/fetch-cart";
import { CartPageView } from "./cart-page-view";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your items, update quantities, and proceed to checkout on Modesy.",
};

export default async function CartPage({ params }: PageProps) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const queryClient = new QueryClient();

  if (user) {
    await queryClient.prefetchQuery({
      queryKey: ["cart", user.id, locale],
      queryFn: () => fetchCartAuthenticated(supabase as any, user.id, locale),
    });
  } else {
    await queryClient.prefetchQuery({
      queryKey: ["cart", "guest", locale],
      queryFn: () => fetchCartGuest(supabase as any, locale),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CartPageView userId={user?.id} />
    </HydrationBoundary>
  );
}
