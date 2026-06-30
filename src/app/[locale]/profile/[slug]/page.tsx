import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { ProductCard } from "@/components/features/products/ProductCard";
import { dummyShops } from "@/lib/dummy/shops";
import { dummyProducts } from "@/lib/dummy/products";
import { Heart, Star, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to slugify full names for matching
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function ProfilePage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  const { tab } = await searchParams;

  const supabase = await createClient();

  // 1. Check if it matches a shop/vendor in our database or dummyShops
  const shop = dummyShops.find((s) => s.slug === slug);
  
  if (shop) {
    const activeTab = tab === "products" || tab === "about" || tab === "reviews" ? tab : "products";
    // Render Vendor Shop Profile
    const shopProducts = dummyProducts.filter((p) => p.sellerSlug === slug);

    return (
      <div className="flex flex-col flex-1">
        <Breadcrumb items={[
          { label: "Home", href: `/${locale}` },
          { label: "Profile" },
          { label: shop.name },
        ]} />
        <div className="w-full">
          <div className="h-48 bg-gray-100 relative overflow-hidden">
            <Image
              src={`https://picsum.photos/seed/${shop.coverSeed}/1200/400`}
              alt={`${shop.name} cover`}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="relative flex items-end -mt-12 mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-100 shrink-0 relative">
                <Image
                  src={`https://picsum.photos/seed/${shop.avatarSeed}/96/96`}
                  alt={shop.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="ms-4 pb-1 flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h1 className="text-2xl font-bold text-text-main">{shop.name}</h1>
                  <div className="flex gap-2">
                    <button type="button" className="h-9 px-4 border border-gray-300 rounded-md text-sm font-medium flex items-center gap-1.5 hover:bg-gray-50 transition-colors cursor-pointer">
                      <MessageCircle size={16} />
                      Contact
                    </button>
                    <button type="button" className="w-9 h-9 border border-gray-300 rounded-md flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-colors cursor-pointer">
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    {shop.rating} ({shop.reviewCount} reviews)
                  </span>
                  <span>· {shop.productCount} products</span>
                  <span>· Joined {shop.joinedYear}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-6 border-b border-gray-200">
              {[
                { name: "Products", id: "products" },
                { name: "About", id: "about" },
                { name: "Reviews", id: "reviews" },
              ].map((t) => (
                <Link
                  key={t.id}
                  href={`/${locale}/profile/${slug}?tab=${t.id}`}
                  className={cn(
                    "pb-3 text-sm font-medium transition-colors cursor-pointer outline-none border-b-2",
                    activeTab === t.id
                      ? "text-primary border-primary"
                      : "text-gray-500 hover:text-gray-700 border-transparent"
                  )}
                >
                  {t.name}
                </Link>
              ))}
            </div>

            <div className="py-6">
              {activeTab === "products" && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {shopProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        slug: product.slug,
                        price: product.price,
                        discount_percent: product.discountPercent,
                        category_id: null,
                      }}
                      categoryName={product.categoryName}
                      title={product.title}
                      rating_average={product.rating ?? undefined}
                    />
                  ))}
                </div>
              )}
              {activeTab === "about" && (
                <div className="max-w-xl">
                  <p className="text-sm text-gray-600 leading-relaxed">{shop.description}</p>
                  <div className="mt-6 space-y-3 text-sm">
                    <p><span className="font-medium text-text-main">Email:</span> <span className="text-gray-500">{shop.email}</span></p>
                    <p><span className="font-medium text-text-main">Phone:</span> <span className="text-gray-500">{shop.phone}</span></p>
                    <p><span className="font-medium text-text-main">Member Since:</span> <span className="text-gray-500">{shop.joinedYear}</span></p>
                  </div>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-text-main">{shop.rating}</span>
                  <span>({shop.reviewCount} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. If not a vendor, check if it's a buyer profile in public.profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, created_at");

  const matchedProfile = (profiles || []).find((p) => slugify(p.full_name) === slug);

  if (!matchedProfile) {
    notFound();
  }

  // Format active tab for buyer profile
  const activeTab = tab === "followers" || tab === "following" || tab === "reviews" ? tab : "followers";

  // Format joined date
  const joinedDate = matchedProfile.created_at
    ? new Date(matchedProfile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "June 2026";

  // Query reviews for this buyer
  const { data: userReviews } = await supabase
    .from("product_reviews")
    .select(`
      id,
      rating,
      review,
      created_at,
      product_id,
      products(slug, price, product_translations(title))
    `)
    .eq("user_id", matchedProfile.id);

  return (
    <div className="flex flex-col flex-1">
      <Breadcrumb items={[
        { label: "Home", href: `/${locale}` },
        { label: "Followers" }, // Matches screenshot breadcrumb style exactly!
      ]} />
      <div className="max-w-screen-xl mx-auto px-6 py-6 w-full">
        {/* User Card Header */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 shrink-0 relative flex items-center justify-center border border-gray-150 shadow-sm">
            {matchedProfile.avatar_url ? (
              <Image
                src={matchedProfile.avatar_url}
                alt={matchedProfile.full_name}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="text-gray-400 text-3xl font-bold uppercase select-none">
                {matchedProfile.full_name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-text-main font-sans">{matchedProfile.full_name}</h1>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-300"></span>
              <span>Last active: 16 minutes ago</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Member since {joinedDate}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          {[
            { name: "Followers (0)", id: "followers" },
            { name: "Following (0)", id: "following" },
            { name: `My Reviews (${userReviews?.length || 0})`, id: "reviews" },
          ].map((t) => (
            <Link
              key={t.id}
              href={`/${locale}/profile/${slug}?tab=${t.id}`}
              className={cn(
                "pb-3 text-sm font-semibold transition-colors cursor-pointer outline-none border-b-2 font-sans",
                activeTab === t.id
                  ? "text-primary border-primary font-bold text-gray-900"
                  : "text-gray-500 hover:text-gray-700 border-transparent"
              )}
            >
              {t.name}
            </Link>
          ))}
        </div>

        {/* Tab Content */}
        <div className="py-2">
          {activeTab === "followers" && (
            <div className="text-center py-12 text-gray-400 text-sm font-medium border border-dashed border-gray-200 rounded-lg">
              No records found!
            </div>
          )}
          {activeTab === "following" && (
            <div className="text-center py-12 text-gray-400 text-sm font-medium border border-dashed border-gray-200 rounded-lg">
              No records found!
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {!userReviews || userReviews.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm font-medium border border-dashed border-gray-200 rounded-lg">
                  No records found!
                </div>
              ) : (
                userReviews.map((rev: any) => {
                  const productTitle = rev.products?.product_translations?.[0]?.title || "Product";
                  return (
                    <div key={rev.id} className="border border-gray-150 rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Link href={`/${locale}/${rev.products?.slug}`} className="font-semibold text-sm text-text-main hover:text-primary transition-colors">
                          {productTitle}
                        </Link>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={cn(
                                "stroke-none",
                                i < rev.rating ? "fill-yellow-400" : "fill-gray-200"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic">"{rev.review || "No review content provided."}"</p>
                      <span className="text-[10px] text-gray-400 self-end">
                        {new Date(rev.created_at).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
