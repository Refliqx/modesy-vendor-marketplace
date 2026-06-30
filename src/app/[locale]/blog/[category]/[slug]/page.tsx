"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { ChevronLeft } from "lucide-react";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { dummyBlogPosts } from "@/lib/dummy/blogPosts";
import { notFound } from "next/navigation";

export default function BlogDetailPage() {
  const locale = useLocale();
  const params = useParams();
  const slug = params.slug as string;
  const post = dummyBlogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  const related = dummyBlogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="flex flex-col flex-1">
      <Breadcrumb items={[
        { label: "Home", href: `/${locale}` },
        { label: "Blog", href: `/${locale}/blog` },
        { label: post.category },
        { label: post.title },
      ]} />
      <article className="max-w-3xl mx-auto px-6 py-8 flex-1 w-full">
        <div className="aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 relative mb-6">
          <Image
            src={`https://picsum.photos/seed/${post.coverImageSeed}/1200/675`}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
        <p className="text-primary text-xs uppercase font-semibold mb-2">{post.category}</p>
        <h1 className="text-3xl font-bold text-text-main mb-2">{post.title}</h1>
        <p className="text-sm text-gray-400 mb-6">{post.category} · {post.publishedAgo}</p>
        <div className="prose prose-sm md:prose-base prose-gray max-w-none">
          {post.body.split('\n').map((line, i) => {
            if (line.startsWith('## ')) {
              return <h2 key={i} className="text-xl font-bold mt-6 mb-3 text-text-main">{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('### ')) {
              return <h3 key={i} className="text-lg font-bold mt-4 mb-2 text-text-main">{line.replace('### ', '')}</h3>;
            }
            if (line.startsWith('- **')) {
              const match = line.match(/- \*\*(.+?)\*\*:? (.+)/);
              if (match) {
                return (
                  <p key={i} className="mb-1 text-gray-600">
                    <strong>{match[1]}:</strong> {match[2]}
                  </p>
                );
              }
            }
            if (line.trim() === '') return <div key={i} className="h-2" />;
            return <p key={i} className="text-gray-600 leading-relaxed mb-3">{line}</p>;
          })}
        </div>
      </article>

      {related.length > 0 && (
        <section className="max-w-screen-xl mx-auto px-6 py-12 w-full border-t border-gray-100">
          <h2 className="text-[22px] font-bold text-text-main mb-6">Related Posts</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((rp) => (
              <Link
                key={rp.id}
                href={`/${locale}/blog/${rp.category.toLowerCase()}/${rp.slug}`}
                className="group block"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 relative">
                  <Image
                    src={`https://picsum.photos/seed/${rp.coverImageSeed}/600/450`}
                    alt={rp.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="33vw"
                  />
                </div>
                <h3 className="font-bold text-sm text-text-main line-clamp-2 mt-3 group-hover:text-primary transition-colors">
                  {rp.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{rp.publishedAgo}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
