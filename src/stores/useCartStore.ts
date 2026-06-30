import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { DummyCoupon } from "@/lib/dummy/coupons";

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  address: string;
  useSameAddress: boolean;
}

interface CartStore {
  user: any | null;
  loading: boolean;
  initialized: boolean;
  appliedCoupon: DummyCoupon | null;
  shippingAddress: ShippingAddress | null;
  setAppliedCoupon: (coupon: DummyCoupon | null) => void;
  setShippingAddress: (address: ShippingAddress | null) => void;
  initializeAuth: (locale: string) => () => void;
  syncGuestData: (user: any, locale: string) => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => {
  const supabase = createClient();

  return {
    user: null,
    loading: false,
    initialized: false,
    appliedCoupon: null,
    shippingAddress: null,

    syncGuestData: async (user: any, locale: string) => {
      if (!user) return;
      const storedCart = localStorage.getItem("modesy_guest_cart");
      if (storedCart) {
        try {
          const guestItems = JSON.parse(storedCart);
          if (Array.isArray(guestItems) && guestItems.length > 0) {
            const { addToCartAction } = await import("@/actions/cart.actions");
            for (const item of guestItems) {
              await addToCartAction(item.product_id, item.quantity);
            }
            localStorage.removeItem("modesy_guest_cart");
          }
        } catch (e) {
          console.error("Error syncing guest cart:", e);
        }
      }
      const storedWishlist = localStorage.getItem("modesy_guest_wishlist");
      if (storedWishlist) {
        try {
          const wishlistIds = JSON.parse(storedWishlist);
          if (Array.isArray(wishlistIds) && wishlistIds.length > 0) {
            const { toggleWishlist } = await import("@/actions/wishlist.actions");
            for (const pId of wishlistIds) {
              await toggleWishlist(pId);
            }
            localStorage.removeItem("modesy_guest_wishlist");
          }
        } catch (e) {
          console.error("Error syncing guest wishlist:", e);
        }
      }
    },

    initializeAuth: (locale: string) => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          const user = session?.user || null;
          set({ user });

          if (event === "INITIAL_SESSION") {
            set({ initialized: true });
            await get().syncGuestData(user, locale);
            return;
          }

          if (event === "SIGNED_IN" && user) {
            await get().syncGuestData(user, locale);
            return;
          }

          if (event === "SIGNED_OUT") {
            set({ user: null });
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    },

    setAppliedCoupon: (coupon: DummyCoupon | null) => {
      set({ appliedCoupon: coupon });
    },

    setShippingAddress: (address: ShippingAddress | null) => {
      set({ shippingAddress: address });
    }
  };
});
