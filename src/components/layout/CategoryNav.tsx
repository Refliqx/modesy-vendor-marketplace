import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { CategoryNavClient } from "./CategoryNavClient";

export interface CategoryNode {
  id: number;
  slug: string;
  name: string;
  image_path: string | null;
  children: CategoryNode[];
}

export async function CategoryNav() {
  const locale = await getLocale();
  const supabase = await createClient();

  const { data: langData } = await (supabase
    .from("languages")
    .select("id")
    .eq("code", locale)
    .single() as any);

  const activeLangId = (langData as any)?.id ?? 1;

  const { data: raw } = await (supabase
    .from("categories")
    .select(
      "id, slug, image_path, parent_id, status, category_translations!inner(name, language_id)"
    )
    .eq("status", true)
    .eq("category_translations.language_id", activeLangId) as any);

  const allCats: any[] = raw ?? [];

  const getName = (cat: any): string => {
    const t = cat.category_translations;
    return (Array.isArray(t) ? t[0]?.name : t?.name) ?? cat.slug;
  };

  const map = new Map<number, CategoryNode>();
  const roots: CategoryNode[] = [];

  for (const cat of allCats) {
    map.set(cat.id, {
      id: cat.id,
      slug: cat.slug,
      name: getName(cat),
      image_path: cat.image_path ?? null,
      children: [],
    });
  }

  for (const cat of allCats) {
    const node = map.get(cat.id)!;
    if (cat.parent_id != null && map.has(cat.parent_id)) {
      map.get(cat.parent_id)!.children.push(node);
    } else if (cat.parent_id == null) {
      roots.push(node);
    }
  }

  return <CategoryNavClient categories={roots} locale={locale} />;
}
