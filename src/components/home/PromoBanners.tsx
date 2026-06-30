"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

export function DoublePromoBanner() {
  const locale = useLocale();

  return (
    <section className="py-6 px-6 max-w-screen-xl mx-auto w-full select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Banner 1: Summer Promotion */}
        <div className="relative h-[240px] rounded-lg overflow-hidden border border-gray-100 group shadow-sm hover:shadow-md transition-shadow duration-300">
          <Image
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
            alt="Summer Promotion"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover object-top transition-transform duration-500 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-black/5" />
          
          {/* Overlay Box */}
          <div className="absolute inset-y-4 left-4 right-4 bg-white/95 backdrop-blur-[2px] rounded-lg p-6 flex flex-col justify-between items-center text-center max-w-[280px] md:max-w-[320px]">
            <div className="flex flex-col items-center">
              {/* Quote marks styled banner text */}
              <span className="text-yellow-500 text-3xl leading-none h-4">&ldquo;</span>
              <h3 className="text-3xl font-serif italic text-yellow-500 font-bold leading-tight">Summer</h3>
              <p className="text-gray-800 text-xs font-semibold uppercase tracking-wider mt-1.5 leading-relaxed">
                Choose your style, make your summer.
              </p>
            </div>
            
            {/* Promo date info */}
            <div className="text-[10px] text-gray-500 uppercase tracking-widest border-t border-gray-100 w-full pt-3 mt-2 flex justify-between items-center">
              <span>The promotion will begin</span>
              <span className="font-bold text-gray-700">on June 29</span>
            </div>
            
            {/* Circular Discount Badge */}
            <div className="absolute -bottom-3 -left-3 w-16 h-16 rounded-full bg-yellow-400 text-black flex flex-col items-center justify-center border-4 border-white shadow-md transform rotate-[-12deg] select-none">
              <span className="text-[9px] font-bold uppercase tracking-tighter leading-none">Discount</span>
              <span className="text-sm font-black leading-none mt-0.5">25%</span>
            </div>
          </div>
        </div>

        {/* Banner 2: Autumn Sale */}
        <div className="relative h-[240px] rounded-lg overflow-hidden border border-gray-100 group shadow-sm hover:shadow-md transition-shadow duration-300">
          <Image
            src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop"
            alt="Autumn Sale"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-black/15" />
          
          {/* Overlay Box */}
          <div className="absolute top-1/2 -translate-y-1/2 right-6 bg-[#4A5D4E]/90 backdrop-blur-[2px] rounded-lg p-6 text-white max-w-[240px] text-left">
            <p className="text-[10px] uppercase tracking-widest text-white/80 font-bold mb-1">Modesy</p>
            <h3 className="text-2xl font-bold leading-tight font-serif italic mb-2">Autumn Sale</h3>
            <div className="border-t border-white/20 pt-3 flex flex-col gap-1">
              <span className="text-3xl font-black tracking-tight">50% <span className="text-sm uppercase font-semibold">Off</span></span>
              <span className="text-[10px] text-white/70 tracking-wider font-semibold uppercase">Limited Time Only</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export function TriplePromoBanner() {
  const locale = useLocale();

  return (
    <section className="py-6 px-6 max-w-screen-xl mx-auto w-full select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Banner 1: New Summer Collection */}
        <div className="relative h-[180px] rounded-lg overflow-hidden border border-gray-100 group shadow-sm hover:shadow-md transition-shadow duration-300">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500&auto=format&fit=crop"
            alt="New Summer Collection"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-black/25" />
          
          {/* Content overlay */}
          <div className="absolute inset-4 flex flex-col justify-end text-white">
            <h4 className="text-lg font-bold leading-tight">New Summer<br/>Collection</h4>
            <div className="mt-2.5">
              <Link href={`/${locale}/clothing`} className="text-xs uppercase font-semibold tracking-wider hover:underline flex items-center gap-1">
                Shop Now &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Banner 2: SALE - Sale is start */}
        <div className="relative h-[180px] rounded-lg overflow-hidden border border-gray-100 group shadow-sm hover:shadow-md transition-shadow duration-300">
          <Image
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=500&auto=format&fit=crop"
            alt="SALE is start"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Content overlay */}
          <div className="absolute inset-4 flex flex-col items-center justify-center text-white border-2 border-white/30 rounded-md">
            <span className="text-[10px] uppercase tracking-widest text-white/80 font-bold mb-1">Limited Offer</span>
            <h4 className="text-2xl font-black uppercase tracking-tight">SALE</h4>
            <span className="text-xs font-semibold tracking-wider uppercase mt-1">Sale is starting now</span>
          </div>
        </div>

        {/* Banner 3: Summer Collection Sale */}
        <div className="relative h-[180px] rounded-lg overflow-hidden border border-gray-100 group shadow-sm hover:shadow-md transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
          <Image
            src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=500&auto=format&fit=crop"
            alt="Summer Collection Sale"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-black/25" />
          
          {/* Content overlay */}
          <div className="absolute inset-4 flex flex-col justify-between items-start text-white">
            <span className="bg-primary/95 text-white text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">17% Off</span>
            <div>
              <h4 className="text-lg font-bold leading-tight">Summer Collection</h4>
              <span className="text-[11px] text-white/80 font-medium">Limited time premium offers</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
