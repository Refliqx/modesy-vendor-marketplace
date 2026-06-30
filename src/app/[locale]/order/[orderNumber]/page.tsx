"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { CheckCircle, Clock, AlertCircle, Package } from "lucide-react";
import { checkPaymentStatusAction } from "@/actions/payment.actions";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";

export default function OrderConfirmationPage() {
  const locale = useLocale();
  const params = useParams<{ orderNumber: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const queryStatus = searchParams.get("status");

  useEffect(() => {
    if (queryStatus === "success") {
      setStatus("success");
      setLoading(false);
      return;
    }

    // Poll for payment status
    const poll = async () => {
      const res = await checkPaymentStatusAction(params.orderNumber);
      if (res.status === "paid") {
        setStatus("success");
        setLoading(false);
      } else if (res.status === "failed") {
        setStatus("failed");
        setLoading(false);
      } else {
        setStatus("pending");
        // Keep polling
        setTimeout(poll, 3000);
      }
    };
    poll();
  }, [params.orderNumber, queryStatus]);

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Order" }]} />
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-sm text-gray-500">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 select-none">
      <Breadcrumb items={[
        { label: "Home", href: `/${locale}` },
        { label: "Cart", href: `/${locale}/cart` },
        { label: "Order" },
      ]} />
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-6">
        <div className="max-w-md w-full bg-white border border-gray-100 rounded-xl p-8 shadow-sm text-center">
          {status === "success" && (
            <>
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={44} className="text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-text-main mb-2">Payment Successful!</h1>
              <p className="text-sm text-gray-500 mb-6">
                Your order <span className="font-semibold text-text-main">{params.orderNumber}</span> has been placed.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm text-gray-600">
                <p className="flex items-center gap-2 mb-2">
                  <Package size={16} className="text-primary" />
                  Your items are being processed by the seller.
                </p>
                <p className="text-xs text-gray-400">
                  You will receive an email confirmation shortly.
                </p>
              </div>
            </>
          )}

          {status === "pending" && (
            <>
              <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Clock size={44} className="text-yellow-500" />
              </div>
              <h1 className="text-2xl font-bold text-text-main mb-2">Payment Pending</h1>
              <p className="text-sm text-gray-500 mb-6">
                Your payment for <span className="font-semibold text-text-main">{params.orderNumber}</span> is being processed.
              </p>
              <p className="text-sm text-gray-400 mb-6">
                This may take a few moments. Please check back later.
              </p>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <AlertCircle size={44} className="text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-text-main mb-2">Payment Failed</h1>
              <p className="text-sm text-gray-500 mb-6">
                We could not process your payment for <span className="font-semibold">{params.orderNumber}</span>.
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Please try again or use a different payment method.
              </p>
            </>
          )}

          <div className="flex flex-col gap-3">
            <Link
              href={`/${locale}`}
              className="w-full bg-primary text-white h-11 rounded-md font-semibold text-sm flex items-center justify-center hover:bg-primary-hover transition-colors"
            >
              Continue Shopping
            </Link>
            {status === "failed" && (
              <button
                type="button"
                onClick={() => router.push(`/${locale}/cart`)}
                className="w-full border border-gray-300 text-gray-700 h-11 rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Return to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
