"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { dummyBlogPosts } from "@/lib/dummy/blogPosts";

export default function BlogListingPage() {
  const locale = useLocale();

  return (
    <div className="flex flex-col flex-1">
      <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Blog" }]} />
      <div className="max-w-screen-xl mx-auto px-6 py-8 flex-1 w-full">
        <h1 className="text-[28px] font-bold text-text-main mb-8">Blog</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {dummyBlogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.category.toLowerCase()}/${post.slug}`}
              className="group block"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 relative">
                <Image
                  src={`https://picsum.photos/seed/${post.coverImageSeed}/600/450`}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <p className="text-primary text-xs uppercase font-semibold mt-3">{post.category}</p>
              <h3 className="font-bold text-base text-text-main line-clamp-2 mt-1 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">{post.excerpt}</p>
              <p className="text-xs text-gray-400 mt-2">{post.category} · {post.publishedAgo}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
