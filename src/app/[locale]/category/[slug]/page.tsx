import { redirect } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ sort?: string; min?: string; max?: string; keyword?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  const { sort, min, max, keyword } = await searchParams;

  const queryParams = new URLSearchParams();
  if (sort) queryParams.set("sort", sort);
  if (min) queryParams.set("min", min);
  if (max) queryParams.set("max", max);
  if (keyword) queryParams.set("keyword", keyword);

  const queryStr = queryParams.toString();
  redirect(`/${locale}/products/${slug}${queryStr ? `?${queryStr}` : ""}`);
}
