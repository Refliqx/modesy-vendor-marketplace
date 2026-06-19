"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";

interface Category {
  id: number;
  slug: string;
  name: string;
  image_path: string | null;
}

interface CategoryGridProps {
  categories: Category[];
}

const getPlaceholderImage = (slug: string) => {
  const mapping: Record<string, string> = {
    clothing: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=300&auto=format&fit=crop",
    shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop",
    "home-living": "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=300&auto=format&fit=crop",
    "jewelry-accessories": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=300&auto=format&fit=crop",
    "toys-entertainment": "https://images.unsplash.com/photo-1531256456869-ce942a665e80?q=80&w=300&auto=format&fit=crop",
    "graphics-photos": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=300&auto=format&fit=crop",
    "video-audio": "https://images.unsplash.com/photo-1487180142328-054b783fc471?q=80&w=300&auto=format&fit=crop",
    "web-templates-code": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=300&auto=format&fit=crop",
  };
  return mapping[slug] || "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=300&auto=format&fit=crop";
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  const locale = useLocale();

  return (
    <section className="py-12 px-6 max-w-screen-xl mx-auto select-none">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[22px] font-bold text-text-main">
          Shop By Category
        </h2>
        <Link 
          href={`/${locale}/categories`} 
          className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
        >
          View All &rarr;
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
        {categories.map((category) => {
          const imageUrl = category.image_path || getPlaceholderImage(category.slug);
          return (
            <Link
              key={category.id}
              href={`/${locale}/category/${category.slug}`}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Circle Wrapper */}
              <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden relative shadow-sm group-hover:shadow-md transition-all duration-200">
                <Image
                  src={imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  unoptimized
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                  <span className="text-white text-sm font-semibold bg-primary/80 px-3 py-1.5 rounded-full shadow-sm">
                    Shop Now &rarr;
                  </span>
                </div>
              </div>

              {/* Category Title */}
              <span className="text-text-main text-sm font-medium mt-3 text-center transition-colors group-hover:text-primary">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
