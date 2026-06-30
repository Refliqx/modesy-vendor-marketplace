import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  fetchCartAuthenticated,
  fetchCartGuest,
} from "@/lib/queries/fetch-cart";

export function useCartItems(locale: string, userId?: string | null) {
  return useQuery({
    queryKey: ["cart", userId ?? "guest", locale],
    queryFn: async () => {
      const supabase = createClient();
      if (!userId) return fetchCartGuest(supabase, locale);
      return fetchCartAuthenticated(supabase, userId, locale);
    },
    staleTime: 15_000,
  });
}
