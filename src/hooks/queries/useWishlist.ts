import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toggleWishlist } from "@/actions/wishlist.actions";
import { useCartStore } from "@/stores/useCartStore";
import {
  fetchWishlistAuthenticated,
  fetchWishlistGuest,
} from "@/lib/queries/fetch-wishlist";
import { toast } from "sonner";

export function useWishlistIds(userId?: string | null) {
  return useQuery({
    queryKey: ["wishlist", userId ?? "guest"],
    queryFn: async () => {
      if (!userId) return fetchWishlistGuest();
      const supabase = createClient();
      return fetchWishlistAuthenticated(supabase, userId);
    },
    staleTime: 30_000,
    select: (ids: number[]) => new Set(ids),
  });
}

export function useToggleWishlist() {
  const qc = useQueryClient();
  const userId = useCartStore((s) => s.user)?.id;

  return useMutation({
    mutationFn: async (productId: number) => {
      if (!userId) {
        const stored =
          typeof window !== "undefined"
            ? localStorage.getItem("modesy_guest_wishlist")
            : null;
        let ids: number[] = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(ids)) ids = [];

        const idx = ids.indexOf(productId);
        if (idx >= 0) ids.splice(idx, 1);
        else ids.push(productId);

        localStorage.setItem("modesy_guest_wishlist", JSON.stringify(ids));
        return { productId, wishlisted: idx < 0 };
      }

      const res = await toggleWishlist(productId);
      if (res.error) throw new Error(res.error);
      return { productId, wishlisted: res.wishlisted };
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(
        data.wishlisted
          ? "Product added to wishlist"
          : "Product removed from wishlist"
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update wishlist");
    },
  });
}
