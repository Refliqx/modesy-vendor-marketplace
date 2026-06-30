"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductGalleryProps {
  title: string;
  images: string[];
}

export function ProductGallery({ title, images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No image available</span>
      </div>
    );
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="aspect-square rounded-lg border border-gray-100 overflow-hidden bg-gray-50 relative cursor-pointer max-w-[500px]">
            <Image
              src={`https://picsum.photos/seed/${images[activeIndex]}/600/600`}
              alt={title}
              fill
              priority
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-3xl p-0 bg-transparent border-none">
          <div className="relative aspect-square w-full">
            <Image
              src={`https://picsum.photos/seed/${images[activeIndex]}/1200/1200`}
              alt={title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex gap-2 mt-3">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "w-16 h-16 rounded-md border-2 overflow-hidden bg-gray-50 transition-colors cursor-pointer",
              idx === activeIndex ? "border-primary" : "border-transparent hover:border-gray-300"
            )}
          >
            <div className="relative w-full h-full">
              <Image
                src={`https://picsum.photos/seed/${img}/150/150`}
                alt={`${title} ${idx + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
