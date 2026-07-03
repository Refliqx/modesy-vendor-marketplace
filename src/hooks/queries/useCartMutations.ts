"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToCartAction,
  updateCartQtyAction,
  removeFromCartAction,
} from "@/actions/cart.actions";
import { createSnapTokenAction } from "@/actions/payment.actions";
import { useCartStore } from "@/stores/useCartStore";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface AddToCartInput {
  productId: number;
  locale: string;
  quantity?: number;
}

export function useAddToCart() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity = 1 }: AddToCartInput) => {
      const res = await addToCartAction(productId, quantity);
      if (res.error) throw new Error(res.error);
      return res;
    },
    onSuccess: (_data, variables) => {
      const user = useCartStore.getState().user;
      toast.success("Product successfully added to your cart!");
      qc.invalidateQueries({ queryKey: ["cart", user?.id ?? "guest", variables.locale] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

interface UpdateQtyInput {
  itemId: number;
  quantity: number;
  locale: string;
}

export function useUpdateCartQty() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, quantity, locale }: UpdateQtyInput) => {
      const user = useCartStore.getState().user;
      if (!user) {
        const supabase = createClient();
        const { data: prod } = await (supabase.from("products") as any)
          .select("stock, product_translations!inner(title)")
          .eq("id", itemId)
          .single();
        if (prod && quantity > prod.stock) {
          const title = (prod.product_translations as any)[0]?.title || "Product";
          throw new Error(`Only ${prod.stock} units of "${title}" are available in stock.`);
        }
        const stored = localStorage.getItem("modesy_guest_cart");
        if (stored) {
          let guestItems = JSON.parse(stored);
          if (Array.isArray(guestItems)) {
            guestItems = guestItems.map((it: any) =>
              it.product_id === itemId ? { ...it, quantity } : it
            );
            localStorage.setItem("modesy_guest_cart", JSON.stringify(guestItems));
          }
        }
        return;
      }
      const res = await updateCartQtyAction(itemId, quantity);
      if (res.error) throw new Error(res.error);
    },
    onMutate: async ({ itemId, quantity, locale }) => {
      const user = useCartStore.getState().user;
      const key: [string, string, string] = ["cart", user?.id ?? "guest", locale];
      await qc.cancelQueries({ queryKey: key });
      const snapshot = qc.getQueriesData({ queryKey: key });
      qc.setQueriesData({ queryKey: key }, (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((item: any) =>
          item.id === itemId ? { ...item, quantity } : item
        );
      });
      return { snapshot };
    },
    onError: (err, _vars, context) => {
      if (context?.snapshot) {
        (context.snapshot as [any, unknown][]).forEach(([key, data]) =>
          qc.setQueryData(key as any, data as any)
        );
      }
      toast.error(err.message);
    },
    onSettled: (_data, _error, variables) => {
      const user = useCartStore.getState().user;
      qc.invalidateQueries({ queryKey: ["cart", user?.id ?? "guest", variables.locale] });
    },
  });
}

interface RemoveFromCartInput {
  itemId: number;
  locale: string;
}

export function useRemoveFromCart() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId }: RemoveFromCartInput) => {
      const user = useCartStore.getState().user;
      if (!user) {
        const stored = localStorage.getItem("modesy_guest_cart");
        if (stored) {
          try {
            let guestItems = JSON.parse(stored);
            if (Array.isArray(guestItems)) {
              guestItems = guestItems.filter((it: any) => it.product_id !== itemId);
              localStorage.setItem("modesy_guest_cart", JSON.stringify(guestItems));
            }
          } catch (e) {
            console.error(e);
          }
        }
        return;
      }
      const res = await removeFromCartAction(itemId);
      if (res.error) throw new Error(res.error);
    },
    onMutate: async ({ itemId, locale }) => {
      const user = useCartStore.getState().user;
      const key: [string, string, string] = ["cart", user?.id ?? "guest", locale];
      await qc.cancelQueries({ queryKey: key });
      const snapshot = qc.getQueriesData({ queryKey: key });
      qc.setQueriesData({ queryKey: key }, (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.filter((item: any) => item.id !== itemId);
      });
      return { snapshot };
    },
    onError: (err, _vars, context) => {
      if (context?.snapshot) {
        (context.snapshot as [any, unknown][]).forEach(([key, data]) =>
          qc.setQueryData(key as any, data as any)
        );
      }
      toast.error(err.message);
    },
    onSettled: (_data, _error, variables) => {
      const user = useCartStore.getState().user;
      qc.invalidateQueries({ queryKey: ["cart", user?.id ?? "guest", variables.locale] });
    },
  });
}

interface ShippingAddressPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  address?: string;
}

export function useCreateSnapToken() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (shippingAddress?: ShippingAddressPayload) => {
      const res = await createSnapTokenAction(shippingAddress as any);
      if (res.error) {
        if (res.error === "unauthorized") {
          throw new Error("Please login to continue with payment");
        }
        throw new Error(res.error);
      }
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
