import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";

interface PageProps {
  params: { locale: string };
  searchParams: { orderNumber?: string };
}

export default function PaymentSuccessPage({ params, searchParams }: PageProps) {
  const { locale } = params;
  const orderNumber = searchParams.orderNumber || "ORD-UNKNOWN";

  return (
    <div className="flex flex-col flex-1 select-none">
      <Breadcrumb
        items={[
          { label: "Home", href: `/${locale}` },
          { label: "Cart", href: `/${locale}/cart` },
          { label: "Checkout", href: `/${locale}/cart/shipping` },
          { label: "Success" },
        ]}
      />

      <div className="max-w-md mx-auto px-6 py-16 flex-1 flex flex-col justify-center items-center text-center w-full">
        {/* Success Icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-75" />
          <div className="relative w-20 h-20 bg-green-50 border border-green-200 rounded-full flex items-center justify-center shadow-sm">
            <CheckCircle2 className="text-green-500" size={44} />
          </div>
        </div>

        {/* Headings */}
        <h1 className="text-2xl font-bold text-text-main font-sans">
          Order Placed Successfully!
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-sm font-sans leading-relaxed">
          Thank you for your purchase. Your order has been drafted successfully and is now pending payment confirmation.
        </p>

        {/* Order Details Card */}
        <div className="w-full bg-white border border-gray-150 rounded-lg p-5 mt-8 shadow-sm text-left">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 font-sans">
            Order Information
          </h2>
          
          <div className="space-y-2.5 text-sm font-sans">
            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Order Number</span>
              <span className="font-mono font-bold text-text-main bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                {orderNumber}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Status</span>
              <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs border border-amber-200/50">
                Pending Payment
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-gray-500">Confirmation</span>
              <span className="text-gray-500 text-xs text-right">
                Sent to registered email
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-8 font-sans">
          <Link
            href={`/${locale}`}
            className="flex-1 bg-primary hover:bg-primary-hover text-white h-11 rounded-md font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <ShoppingBag size={16} />
            Keep Shopping
          </Link>
          <Link
            href={`/${locale}`}
            className="flex-1 bg-gray-50 hover:bg-gray-100 text-text-main border border-gray-200 h-11 rounded-md font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            View Orders
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
