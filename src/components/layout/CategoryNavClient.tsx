"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface CategoryNode {
  id: number;
  slug: string;
  name: string;
  image_path: string | null;
  children: CategoryNode[];
}

const PLACEHOLDER: Record<string, string> = {
  // Top-level categories
  "clothing": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400&auto=format&fit=crop",
  "shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop",
  "home-living": "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=400&auto=format&fit=crop",
  "jewelry-accessories": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop",
  "toys-entertainment": "https://images.unsplash.com/photo-1531256456869-ce942a665e80?q=80&w=400&auto=format&fit=crop",
  "graphics-photos": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&auto=format&fit=crop",
  "video-audio": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
  "web-templates-code": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&auto=format&fit=crop",

  // Subcategories
  "clothing-women-s-clothing": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop",
  "clothing-men-s-clothing": "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=400&auto=format&fit=crop",
  "home-living-furniture": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&auto=format&fit=crop",
  "jewelry-accessories-necklaces-and-accessories": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop",
  "graphics-photos-graphics": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop",
  "home-living-painting": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400&auto=format&fit=crop",
  "shoes-women-s-shoes-boots": "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=400&auto=format&fit=crop",
  "home-living-home-decor-decorative-pillows": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=400&auto=format&fit=crop",
  "jewelry-accessories-bags-and-purses-handbags": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop",
};

const FALLBACK =
  "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=400&auto=format&fit=crop";

function getImage(slug: string, image_path: string | null): string {
  if (image_path) return image_path;
  return PLACEHOLDER[slug] ?? FALLBACK;
}

export function CategoryNavClient({
  categories,
  locale,
}: {
  categories: CategoryNode[];
  locale: string;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setActiveId(null); }, [pathname]);

  const clearTimer = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  const handleEnter = useCallback((id: number) => {
    clearTimer();
    setActiveId(id);
  }, [clearTimer]);

  const handleLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => setActiveId(null), 120);
  }, []);

  const visible = categories.slice(0, 8);
  const activeCategory = visible.find((c) => c.id === activeId) ?? null;
  const hasDropdown = Boolean(mounted && activeCategory && activeCategory.children.length > 0);

  return (
    <div
      className="w-full bg-white border-b border-gray-100 select-none z-30 relative"
      onMouseLeave={mounted ? handleLeave : undefined}
    >
      <div className="max-w-screen-xl mx-auto px-6 h-12 flex items-center gap-8 overflow-x-auto no-scrollbar">
        {visible.map((cat) => {
          const isActive = mounted && cat.id === activeId;
          return (
            <div
              key={cat.id}
              className="relative h-full flex items-center shrink-0"
              onMouseEnter={mounted ? () => handleEnter(cat.id) : undefined}
            >
              <Link
                href={`/${locale}/products/${cat.slug}`}
                className={cn(
                  "text-sm whitespace-nowrap transition-colors duration-150 py-1 border-b-2 -mb-px",
                  isActive
                    ? "text-primary border-primary font-medium"
                    : "text-text-main border-transparent hover:text-primary font-normal"
                )}
              >
                {cat.name}
              </Link>
            </div>
          );
        })}
      </div>

      <div
        className={cn(
          "absolute top-full left-0 w-full bg-white border border-gray-200 shadow-xl z-50",
          "transition-[opacity,transform] duration-200 ease-out origin-top",
          hasDropdown
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-95 pointer-events-none"
        )}
        onMouseEnter={mounted ? clearTimer : undefined}
      >
        {mounted && activeCategory && activeCategory.children.length > 0 && (
          <MegaPanel category={activeCategory} locale={locale} />
        )}
      </div>
    </div>
  );
}

function MegaPanel({
  category,
  locale,
}: {
  category: CategoryNode;
  locale: string;
}) {
  const subcategories = category.children;

  const thumbs: CategoryNode[] = [];
  for (const sub of subcategories) {
    if (thumbs.length >= 3) break;
    if (sub.image_path || PLACEHOLDER[sub.slug]) {
      thumbs.push(sub);
    }
  }
  if (thumbs.length === 0) thumbs.push(category);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-6 flex gap-8">
      <div className="flex gap-10 flex-1 flex-wrap">
        {subcategories.map((sub) => (
          <SubColumn
            key={sub.id}
            sub={sub}
            locale={locale}
            parentSlug={category.slug}
          />
        ))}
      </div>

      <div className="flex gap-3 shrink-0">
        {thumbs.map((thumb) => (
          <ThumbCard
            key={thumb.id}
            href={`/${locale}/products/${thumb.slug}`}
            src={getImage(thumb.slug, thumb.image_path)}
            label={thumb.name}
          />
        ))}
      </div>
    </div>
  );
}

function SubColumn({
  sub,
  locale,
  parentSlug,
}: {
  sub: CategoryNode;
  locale: string;
  parentSlug: string;
}) {
  return (
    <div className="min-w-[140px] max-w-[180px]">
      <Link
        href={`/${locale}/products/${sub.slug}`}
        className="text-sm font-bold text-text-main hover:text-primary transition-colors duration-150 block mb-3"
      >
        {sub.name}
      </Link>

      {sub.children.length > 0 && (
        <ul className="flex flex-col gap-2">
          {sub.children.map((leaf) => (
            <li key={leaf.id}>
              <Link
                href={`/${locale}/products/${leaf.slug}`}
                className="text-sm text-text-muted hover:text-primary transition-colors duration-150"
              >
                {leaf.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ThumbCard({
  href,
  src,
  label,
}: {
  href: string;
  src: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="relative w-[150px] h-[110px] rounded-lg overflow-hidden group shrink-0 block"
    >
      <Image
        src={src}
        alt={label}
        fill
        sizes="150px"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <span className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold leading-tight drop-shadow-sm">
        {label}
      </span>
    </Link>
  );
}
