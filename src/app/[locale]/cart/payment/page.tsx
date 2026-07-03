"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { useCreateSnapToken } from "@/hooks/queries/useCartMutations";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess: (result: any) => void;
        onPending: (result: any) => void;
        onError: (result: any) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

export default function PaymentPage() {
  const locale = useLocale();
  const router = useRouter();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { mutateAsync: createSnapToken, isPending: creatingToken } = useCreateSnapToken();
  const snapTokenRef = useRef<string | null>(null);
  const orderNumberRef = useRef<string | null>(null);
  const user = useCartStore((s) => s.user);
  const initialized = useCartStore((s) => s.initialized);
  const shippingAddress = useCartStore((s) => s.shippingAddress);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const initRef = useRef(false);

  // Redirect if not authenticated after auth has initialized
  useEffect(() => {
    if (initialized && !user) {
      toast.error("Please login to proceed with payment");
      router.replace(`/${locale}/cart`);
    }
  }, [initialized, user, locale, router]);

  // Load Midtrans script when user is confirmed
  useEffect(() => {
    if (!user || initRef.current) return;
    initRef.current = true;

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
    script.async = true;
    script.onload = async () => {
      setScriptLoaded(true);
      try {
        const res = await createSnapToken(shippingAddress ?? undefined);
        snapTokenRef.current = res.snapToken ?? null;
        orderNumberRef.current = res.orderNumber ?? null;
      } catch (err) {
        toast.error("Failed to create payment session. Please try again.");
      }
    };
    script.onerror = () => {
      console.error("Failed to load Midtrans script");
    };
    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }
    };
  }, [user]);

  // Show spinner while auth is initializing
  if (!initialized) {
    return (
      <div className="flex flex-col flex-1">
        <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Payment" }]} />
        <div className="flex-1 flex items-center justify-center py-24 select-none">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Auth initialized but no user — redirect will fire via useEffect
  if (!user) return null;

  const ready = scriptLoaded && !creatingToken && !!snapTokenRef.current;

  const handlePay = () => {
    if (!window.snap || !snapTokenRef.current) return;

    window.snap.pay(snapTokenRef.current, {
      onSuccess: (result) => {
        const no = result.order_id || orderNumberRef.current;
        router.push(`/${locale}/order/${no}?status=success`);
      },
      onPending: (result) => {
        const no = result.order_id || orderNumberRef.current;
        router.push(`/${locale}/order/${no}?status=pending`);
      },
      onError: (result) => {
        console.error("Payment error", result);
      },
      onClose: () => {
        if (orderNumberRef.current) {
          router.push(`/${locale}/order/${orderNumberRef.current}?status=unknown`);
        } else {
          router.push(`/${locale}/cart`);
        }
      },
    });
  };

  if (!scriptLoaded || creatingToken) {
    return (
      <div className="flex flex-col flex-1">
        <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Payment" }]} />
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-sm text-gray-500">
            {creatingToken ? "Creating order..." : "Loading payment gateway..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Payment" }]} />
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <span className="text-primary text-2xl">&#x2713;</span>
        </div>
        <h2 className="text-xl font-bold text-text-main mb-2">Ready to Pay</h2>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
          Your order has been created. Click the button below to proceed with payment via Midtrans.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-xs sm:max-w-none">
          <button
            type="button"
            onClick={handlePay}
            className="w-full sm:w-auto bg-primary text-white h-12 px-8 rounded-md font-semibold text-sm hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Pay Now
          </button>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/cart`)}
            className="w-full sm:w-auto border border-gray-300 text-gray-700 h-12 px-6 rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
