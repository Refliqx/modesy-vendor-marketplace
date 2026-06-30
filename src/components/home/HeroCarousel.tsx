"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    title: "New Summer Collection",
    subtitle: "Up to 50% Off on Premium Brands",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1600&auto=format&fit=crop",
    link: "/products/clothing",
  },
  {
    id: 2,
    title: "Minimalist Watch Collection",
    subtitle: "Timeless Design, Modern Elegance",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
    link: "/products/jewelry-accessories",
  },
  {
    id: 3,
    title: "Modern Home Accessories",
    subtitle: "Crafted for Comfort and Aesthetics",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
    link: "/products/home-living",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="w-full h-[320px] lg:h-[480px] relative overflow-hidden select-none">
      {/* Slides Container */}
      <div 
        className="w-full h-full flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div key={slide.id} className="w-full h-full relative shrink-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="100vw"
              priority
              className="object-cover object-center"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 z-10 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
              <h2 className="text-white text-3xl lg:text-[42px] font-bold leading-tight max-w-xl transition-all duration-300">
                {slide.title}
              </h2>
              <p className="text-white/80 text-sm lg:text-base mt-2 lg:mt-3 max-w-md">
                {slide.subtitle}
              </p>
              <button 
                type="button"
                className="mt-6 w-fit bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-md font-semibold text-sm transition-all duration-200 cursor-pointer shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prev Arrow */}
      <button
        onClick={prevSlide}
        type="button"
        className="absolute top-1/2 -translate-y-1/2 left-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white cursor-pointer z-20 transition-all"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Next Arrow */}
      <button
        onClick={nextSlide}
        type="button"
        className="absolute top-1/2 -translate-y-1/2 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white cursor-pointer z-20 transition-all"
        aria-label="Next Slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots Pagination */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            type="button"
            className={`transition-all duration-300 ${
              index === current 
                ? "w-6 h-2 bg-white rounded-full" 
                : "w-2 h-2 bg-white/50 rounded-full hover:bg-white/80"
            } cursor-pointer`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
