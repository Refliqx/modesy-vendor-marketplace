"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImage {
  id: number;
  image_url: string;
  is_main: boolean | null;
  row_order: number | null;
}

interface ProductImageSliderProps {
  images: ProductImage[];
  title: string;
}

export function ProductImageSlider({ images, title }: ProductImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mainViewportRef, emblaMainApi] = useEmblaCarousel({
    loop: true,
    duration: 20,
  });

  const onSelect = useCallback(() => {
    if (!emblaMainApi) return;
    setActiveIndex(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    return () => {
      emblaMainApi.off("select", onSelect);
    };
  }, [emblaMainApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaMainApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi]
  );

  const scrollPrev = useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollPrev();
  }, [emblaMainApi]);

  const scrollNext = useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollNext();
  }, [emblaMainApi]);

  // Fallback if no images
  const displayImages =
    images.length > 0
      ? images
      : [
          {
            id: 0,
            image_url: `https://picsum.photos/seed/placeholder/600/600`,
            is_main: true,
            row_order: 0,
          },
        ];

  return (
    <div className="flex flex-col gap-3 w-full max-w-[650px] mx-auto select-none">
      {/* Main Slider */}
      <div className="relative group rounded-lg border border-gray-100 bg-gray-50 overflow-hidden aspect-square">
        <div className="overflow-hidden h-full" ref={mainViewportRef}>
          <div className="flex h-full">
            {displayImages.map((img, idx) => (
              <div key={img.id || idx} className="flex-[0_0_100%] min-w-0 h-full relative cursor-zoom-in">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative w-full h-full">
                      <Image
                        src={img.image_url}
                        alt={`${title} ${idx + 1}`}
                        fill
                        priority={idx === 0}
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 650px"
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
                    <DialogTitle className="sr-only">{title} zoom</DialogTitle>
                    <div className="relative aspect-square w-full">
                      <Image
                        src={img.image_url}
                        alt={`${title} zoom`}
                        fill
                        className="object-contain"
                        sizes="100vw"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 left-4 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-opacity duration-200 cursor-pointer outline-none z-10",
                "opacity-100 md:opacity-0 md:group-hover:opacity-100"
              )}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 right-4 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-opacity duration-200 cursor-pointer outline-none z-10",
                "opacity-100 md:opacity-0 md:group-hover:opacity-100"
              )}
              aria-label="Next slide"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-gray-200">
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => scrollTo(idx)}
              className={cn(
                "w-16 h-16 rounded-md border-2 overflow-hidden bg-gray-50 transition-colors cursor-pointer shrink-0 outline-none",
                idx === activeIndex ? "border-primary" : "border-transparent hover:border-gray-300"
              )}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.image_url}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
