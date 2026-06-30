"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { Folder, Clock } from "lucide-react";
import { useLocale } from "next-intl";

const blogPosts = [
  {
    title: "Essential travel packing tips for fashion lovers",
    category: "Life Style",
    date: "10 months ago",
    excerpt: "Stay stylish and organized on your trips with these smart packing hacks",
    image: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=500&auto=format&fit=crop&q=80",
    slug: "essential-travel-packing-tips",
  },
  {
    title: "The psychology of colors in fashion",
    category: "Fashion",
    date: "10 months ago",
    excerpt: "Learn how the colors you wear influence mood, confidence, and perception",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=80",
    slug: "psychology-of-colors-in-fashion",
  },
  {
    title: "Gift ideas for every budget from affordable to luxury",
    category: "Life Style",
    date: "10 months ago",
    excerpt: "Find the perfect gift without breaking the bank. Our ideas suit every budget",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80",
    slug: "gift-ideas-for-every-budget",
  },
  {
    title: "A beginner's guide to home fragrances",
    category: "Business",
    date: "10 months ago",
    excerpt: "Learn how scents can transform your home atmosphere and boost your mood",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=80",
    slug: "beginners-guide-to-home-fragrances",
  },
];

function BlogCard({ post, locale }: { post: typeof blogPosts[0]; locale: string }) {
  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden group/card">
      <Link
        href={`/${locale}/blog/${post.slug}`}
        className="relative aspect-[4/3] w-full rounded-md overflow-hidden bg-gray-50 border border-gray-100 block"
      >
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
          sizes="(max-width: 780px) 100vw, 25vw"
        />
      </Link>
      <div className="pt-4 flex flex-col flex-1">
        <Link
          href={`/${locale}/blog/${post.slug}`}
          className="text-sm font-semibold text-text-main hover:text-primary transition-colors line-clamp-2 leading-snug font-sans"
        >
          {post.title}
        </Link>
        <div className="flex items-center gap-4 mt-2.5 text-xs text-gray-500 font-sans">
          <span className="flex items-center gap-1.5 font-medium">
            <Folder size={13} className="text-gray-400 shrink-0" />
            {post.category}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-gray-400 shrink-0" />
            {post.date}
          </span>
        </div>
        <p className="text-[13px] text-gray-600 mt-2.5 line-clamp-2 leading-relaxed font-sans">
          {post.excerpt}
        </p>
      </div>
    </div>
  );
}

export function BlogCarouselSection() {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="py-10 px-6 max-w-screen-xl mx-auto w-full select-none border-t border-gray-100 mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-bold text-text-main font-sans">Latest Blog Posts</h2>
      </div>

      {!mounted && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map((post, i) => <BlogCard key={i} post={post} locale={locale} />)}
        </div>
      )}

      {mounted && (
        <Carousel opts={{ align: "start", loop: false }} className="w-full relative group">
          <CarouselContent className="-ml-6">
            {blogPosts.map((post, i) => (
              <CarouselItem key={i} className="pl-6 basis-full sm:basis-1/2 lg:basis-1/4 shrink-0">
                <BlogCard post={post} locale={locale} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-[35%] -translate-y-1/2 z-10 w-8 h-8 bg-white/95 hover:bg-white text-gray-800 border border-gray-200 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:!opacity-0" />
          <CarouselNext className="absolute right-2 top-[35%] -translate-y-1/2 z-10 w-8 h-8 bg-white/95 hover:bg-white text-gray-800 border border-gray-200 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:!opacity-0" />
        </Carousel>
      )}
    </section>
  );
}
