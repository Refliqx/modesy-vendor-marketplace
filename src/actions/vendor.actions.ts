"use server";

import { createClient } from "@/lib/supabase/server";

export async function getVendorStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const vendor = await supabase
    .from("vendors")
    .select("id, shop_name, balance, is_verified, status")
    .eq("user_id", user.id)
    .maybeSingle()
    .then(r => r.data);

  if (!vendor) return null;

  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", vendor.id);

  const { count: orderCount } = await supabase
    .from("order_items")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", vendor.id);

  const { count: pendingOrderCount } = await supabase
    .from("order_items")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", vendor.id)
    .in("order_status", ["pending", "paid", "processing"]);

  return { ...vendor, productCount: productCount || 0, orderCount: orderCount || 0, pendingOrderCount: pendingOrderCount || 0 };
}

export async function getVendorProducts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const vendor = await supabase
    .from("vendors")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()
    .then(r => r.data);

  if (!vendor) return [];

  const { data } = await supabase
    .from("products")
    .select(`
      id, slug, price, stock, type, status, is_draft, discount_percent, created_at,
      product_translations!inner(title)
    `)
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false }) as any;

  return data || [];
}

export async function toggleProductStatusAction(productId: number, field: "status" | "is_draft", value: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  const vendor = await supabase
    .from("vendors")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()
    .then(r => r.data);

  if (!vendor) return { error: "not a vendor" };

  const { error } = await supabase
    .from("products")
    .update({ [field]: value } as any)
    .eq("id", productId)
    .eq("vendor_id", vendor.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function approveVendorAction(vendorId: number, approve: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  const profile = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
    .then(r => r.data);

  if (profile?.role !== "admin") return { error: "forbidden" };

  const { error } = await supabase
    .from("vendors")
    .update({ is_verified: approve, status: approve })
    .eq("id", vendorId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getPendingVendors() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const profile = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
    .then(r => r.data);

  if (profile?.role !== "admin") return [];

  const { data } = await supabase
    .from("vendors")
    .select("id, shop_name, shop_slug, shop_description, is_verified, status, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(50);

  return data || [];
}

export async function moderateProductAction(productId: number, status: boolean, isDraft: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  const profile = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
    .then(r => r.data);

  if (profile?.role !== "admin") return { error: "forbidden" };

  const { error } = await supabase
    .from("products")
    .update({ status, is_draft: isDraft })
    .eq("id", productId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getAllProductsAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const profile = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
    .then(r => r.data);

  if (profile?.role !== "admin") return [];

  const { data } = await supabase
    .from("products")
    .select(`
      id, slug, price, stock, type, status, is_draft, discount_percent, created_at,
      product_translations!inner(title),
      vendors(shop_name)
    `)
    .order("created_at", { ascending: false })
    .limit(100) as any;

  return data || [];
}

export async function updateCurrencyAction(currencyId: number, exchangeRate: number, status: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  const profile = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
    .then(r => r.data);

  if (profile?.role !== "admin") return { error: "forbidden" };

  const { error } = await supabase
    .from("currencies")
    .update({ exchange_rate: exchangeRate, status })
    .eq("id", currencyId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function saveProductAction(form: {
  id?: number; slug: string; price: number; stock: number;
  type: "physical" | "digital" | "license"; discount_percent?: number | null;
  title: string; description?: string; short_description?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  const vendor = await supabase
    .from("vendors")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()
    .then(r => r.data);

  if (!vendor) return { error: "not a vendor" };

  const productData = {
    slug: form.slug,
    price: form.price,
    stock: form.stock,
    type: form.type,
    discount_percent: form.discount_percent || null,
    vendor_id: vendor.id,
  };

  if (form.id) {
    const { error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", form.id)
      .eq("vendor_id", vendor.id);

    if (error) return { error: error.message };

    const { error: transError } = await supabase
      .from("product_translations")
      .update({
        title: form.title,
        description: form.description || undefined,
        short_description: form.short_description || undefined,
      })
      .eq("product_id", form.id);

    if (transError) return { error: transError.message };
    return { success: true };
  }

  const { data: newProduct, error: createError } = await supabase
    .from("products")
    .insert(productData)
    .select("id")
    .single();

  if (createError) return { error: createError.message };

  const { error: transError } = await supabase
    .from("product_translations")
    .insert({
      product_id: newProduct.id,
      language_id: 1,
      title: form.title,
      description: form.description || "",
      short_description: form.short_description || null,
    });

  if (transError) return { error: transError.message };
  return { success: true };
}

export async function applyForVendorAction(fd: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  const existing = await supabase
    .from("vendors")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()
    .then(r => r.data);

  if (existing) return { error: "you already have a shop" };

  const shopName = fd.get("shopName")?.toString().trim();
  const shopDescription = fd.get("shopDescription")?.toString().trim() || null;

  if (!shopName) return { error: "shop name is required" };

  const { error } = await supabase
    .from("vendors")
    .insert({
      user_id: user.id,
      shop_name: shopName,
      shop_slug: shopName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      shop_description: shopDescription,
      is_verified: false,
      status: null,
    });

  if (error) return { error: error.message };
  return { success: true };
}

export async function checkAdminExistsAction() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin")
    .limit(1);

  return { exists: (data?.length ?? 0) > 0 };
}

export async function registerAsAdminAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  const existing = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin")
    .limit(1)
    .then(r => r.data);

  if (existing && existing.length > 0) return { error: "admin already exists" };

  const { error } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getAllCurrenciesAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const profile = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
    .then(r => r.data);

  if (profile?.role !== "admin") return [];

  const { data } = await supabase
    .from("currencies")
    .select("*")
    .order("id");

  return data || [];
}
