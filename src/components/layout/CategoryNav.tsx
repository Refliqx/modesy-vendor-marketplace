import { getLocale } from "next-intl/server";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function CategoryNav() {
  const locale = await getLocale();
  const supabase = await createClient();

  // Get language id
  const { data: langData } = await (supabase
    .from("languages")
    .select()
    .eq("code", locale)
    .single() as any);

  const lang = langData as any;
  const activeLangId = lang?.id || 1;

  // Fetch categories join language translations
  const { data: categoriesData } = await (supabase
    .from("categories")
    .select("id, slug, image_path, category_translations!inner(name)")
    .eq("status", true)
    .eq("category_translations.language_id", activeLangId) as any);

  const categories = categoriesData as any[];

  const items = categories?.map((cat) => {
    const translation = cat.category_translations;
    const name = Array.isArray(translation)
      ? translation[0]?.name
      : (translation as any)?.name;
    return {
      id: cat.id,
      slug: cat.slug,
      name: name || cat.slug,
    };
  }) || [];

  return (
    <div className="w-full h-12 bg-white border-b border-gray-100 select-none z-20 relative">
      <div className="max-w-screen-xl mx-auto px-6 h-full flex items-center gap-8 overflow-x-auto no-scrollbar">
        {items.map((category) => (
          <Link
            key={category.id}
            href={`/${locale}/category/${category.slug}`}
            className="text-text-main text-sm font-normal whitespace-nowrap hover:text-primary hover:underline underline-offset-4 decoration-primary transition-colors py-1"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
