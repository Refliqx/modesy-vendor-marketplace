"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Home,
  Heart,
  Mail,
  Newspaper,
  Store,
  LogIn,
  UserPlus,
  MapPin,
  Globe,
  DollarSign,
  ChevronRight,
  X,
  User,
  Wallet,
  ShoppingBag,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CurrencyDropdown } from "@/components/currency/CurrencyDropdown";
import { LangDropdown } from "@/components/language/LangDropdown";
import { LocationModal } from "@/components/features/location/LocationModal";
import { useLocationStore } from "@/stores/useLocationStore";
import { useCartStore } from "@/stores/useCartStore";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { useCartItems } from "@/hooks/queries/useCartItems";

interface CategoryNode {
  id: number;
  slug: string;
  name: string;
  parent_id: number | null;
  children: CategoryNode[];
}

function MobileCategoryItem({
  node,
  locale,
  onClose,
  depth = 0,
}: {
  node: CategoryNode;
  locale: string;
  onClose: () => void;
  depth: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children.length > 0;

  const paddingStyle = locale === "ar"
    ? { paddingRight: `${depth * 12 + 16}px`, paddingLeft: "16px" }
    : { paddingLeft: `${depth * 12 + 16}px`, paddingRight: "16px" };

  const href = `/${locale}/products/${node.slug}`;

  return (
    <li>
      <div className="flex items-center justify-between w-full border-b border-gray-150/40">
        <Link
          href={href}
          onClick={onClose}
          className="flex-1 py-3 text-sm text-gray-700 hover:text-primary transition-colors font-sans"
          style={paddingStyle}
        >
          {node.name}
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-3 text-gray-400 hover:text-primary cursor-pointer outline-none shrink-0"
          >
            <ChevronRight
              size={16}
              className={cn("transition-transform", isOpen ? "rotate-90" : "")}
            />
          </button>
        )}
      </div>
      {hasChildren && isOpen && (
        <ul className="bg-gray-50/50">
          {node.children.map((child) => (
            <MobileCategoryItem
              key={child.id}
              node={child}
              locale={locale}
              onClose={onClose}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

interface MobileNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export function MobileNavDrawer({ open, onOpenChange }: MobileNavDrawerProps) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("mobileNav");
  const navT = useTranslations("nav");
  const user = useCartStore((s) => s.user);
  const { selectedCountry, selectedState, selectedCity, _hasHydrated } = useLocationStore();
  const { data: cartItems = [] } = useCartItems(locale, user?.id);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const openAuthModal = useAuthModalStore((state) => state.open);
  const [activeTab, setActiveTab] = useState<"menu" | "categories">("menu");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [languagesList, setLanguagesList] = useState<any[]>([]);

  const displayLocation = _hasHydrated && selectedCountry 
    ? (() => {
        const parts = [selectedCity, selectedState?.name].filter(Boolean);
        return parts.length > 0
          ? `${parts.join(", ")}, ${selectedCountry.name}`
          : selectedCountry.name;
      })()
    : navT("location") || "Location";

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    onOpenChange(false);
    router.refresh();
  };

  useEffect(() => {
    async function fetchCategoriesAndLanguages() {
      try {
        const clientSupabase = createClient();
        const activeLangId = locale === "ar" ? 2 : 1;

        const [catsRes, langsRes] = await Promise.all([
          clientSupabase
            .from("categories")
            .select("id, slug, parent_id, category_translations(name)")
            .eq("status", true),
          clientSupabase
            .from("languages")
            .select("id, name, code, text_direction")
            .eq("status", true)
            .order("is_default", { ascending: false })
        ]);

        if (catsRes.data) {
          const formatted = catsRes.data.map((cat: any) => {
            const translation = cat.category_translations;
            const name = Array.isArray(translation)
              ? translation.find((t: any) => t.language_id === activeLangId)?.name || translation[0]?.name
              : (translation as any)?.name;
            return {
              id: cat.id,
              slug: cat.slug,
              parent_id: cat.parent_id,
              name: name || cat.slug,
            };
          });
          setCategoriesList(formatted);
        }

        if (langsRes.data) {
          setLanguagesList(langsRes.data);
        }
      } catch (err) {
        // Safe fail
      }
    }
    fetchCategoriesAndLanguages();
  }, [locale]);

  const buildTree = (list: any[]): CategoryNode[] => {
    const map: Record<number, CategoryNode> = {};
    const tree: CategoryNode[] = [];

    list.forEach((item) => {
      map[item.id] = {
        id: item.id,
        slug: item.slug,
        name: item.name,
        parent_id: item.parent_id,
        children: [],
      };
    });

    list.forEach((item) => {
      const node = map[item.id];
      if (item.parent_id === null) {
        tree.push(node);
      } else {
        const parent = map[item.parent_id];
        if (parent) {
          parent.children.push(node);
        }
      }
    });

    return tree;
  };

  const categoryTree = buildTree(categoriesList);

  const mainMenuItems = [
    { icon: Home, label: navT("home") || "Home", href: `/${locale}` },
    { icon: Heart, label: navT("wishlist"), href: `/${locale}/wishlist` },
    { icon: Mail, label: navT("contact"), href: `/${locale}/contact` },
    { icon: Newspaper, label: navT("blog"), href: `/${locale}/blog` },
    { icon: Store, label: navT("sellOnModesy"), href: `/${locale}/sell-on-modesy` },
  ];

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-[85%] max-w-sm p-0 overflow-y-auto bg-white flex flex-col h-full" showCloseButton={false}>
          {/* Header Bar replicating the navbar mobile header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 w-full shrink-0">
            <div className="flex items-center gap-3">
              <SheetClose asChild>
                <button
                  type="button"
                  className="text-text-main hover:text-primary transition-colors cursor-pointer outline-none"
                >
                  <Menu size={24} />
                </button>
              </SheetClose>
              
              <SheetTitle className="text-left">
                <Link
                  href={`/${locale}`}
                  className="flex items-center gap-0 text-[24px] font-bold tracking-tight shrink-0 select-none"
                  onClick={() => onOpenChange(false)}
                >
                  <span className="text-text-main">M</span>
                  <span className="text-primary">o</span>
                  <span className="text-text-main">desy</span>
                </Link>
              </SheetTitle>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  router.push(`/${locale}/search`);
                }}
                className="text-text-main hover:text-primary transition-colors cursor-pointer outline-none"
                aria-label="Search"
              >
                <Search size={22} />
              </button>

              <Link
                href={`/${locale}/cart`}
                onClick={() => onOpenChange(false)}
                className="relative flex items-center justify-center w-7 h-7 text-text-main hover:text-primary transition-colors"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1 min-w-[16px] h-4 rounded-full flex items-center justify-center select-none">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto">
            {/* Sell Now Button */}
            <div className="px-4 pt-4">
              <Link
                href={`/${locale}/sell-now`}
                onClick={() => onOpenChange(false)}
                className="w-full h-11 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-md flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              >
                {navT("sellNow")}
              </Link>
            </div>

            {/* Segmented Control / Tabs */}
            <div className="px-4 py-3">
              <div className="flex bg-gray-100 p-1 rounded-lg gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("menu")}
                  className={cn(
                    "flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer outline-none text-center",
                    activeTab === "menu"
                      ? "bg-white text-text-main shadow-xs"
                      : "text-gray-500 hover:text-text-main"
                  )}
                >
                  {t("mainMenu") || "Main Menu"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("categories")}
                  className={cn(
                    "flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer outline-none text-center",
                    activeTab === "categories"
                      ? "bg-white text-text-main shadow-xs"
                      : "text-gray-500 hover:text-text-main"
                  )}
                >
                  {t("categories") || "Categories"}
                </button>
              </div>
            </div>

            {/* Active Tab Content */}
            {activeTab === "menu" ? (
              <div className="px-4">
                <ul>
                  {/* User Profile dropdown */}
                  {user ? (
                    <li className="border-b border-gray-100">
                      <button
                        type="button"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center justify-between w-full py-3.5 text-sm text-text-main hover:text-primary transition-colors cursor-pointer outline-none"
                      >
                        <div className="flex items-center gap-3">
                          {user.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                              <User size={16} className="text-gray-400" />
                            </div>
                          )}
                          <span className="font-semibold text-text-main font-sans truncate">
                            {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
                          </span>
                        </div>
                        <ChevronDown size={16} className={cn("text-gray-400 transition-transform shrink-0", isUserMenuOpen ? "rotate-180" : "")} />
                      </button>
                      
                      {isUserMenuOpen && (
                        <ul className="bg-gray-50/50 ps-11 pe-4 pb-2">
                          <li>
                            <Link
                              href={`/${locale}/profile/${slugify(user.user_metadata?.full_name || user.email?.split("@")[0] || "user")}`}
                              onClick={() => onOpenChange(false)}
                              className="block py-2.5 text-[13px] text-gray-600 hover:text-primary transition-colors font-sans"
                            >
                              Profile
                            </Link>
                          </li>
                          <li>
                            <Link
                              href={`/${locale}/wallet`}
                              onClick={() => onOpenChange(false)}
                              className="block py-2.5 text-[13px] text-gray-600 hover:text-primary transition-colors font-sans"
                            >
                              Wallet
                            </Link>
                          </li>
                          <li>
                            <Link
                              href={`/${locale}/orders`}
                              onClick={() => onOpenChange(false)}
                              className="block py-2.5 text-[13px] text-gray-600 hover:text-primary transition-colors font-sans"
                            >
                              Orders
                            </Link>
                          </li>
                          <li>
                            <Link
                              href={`/${locale}/messages`}
                              onClick={() => onOpenChange(false)}
                              className="block py-2.5 text-[13px] text-gray-600 hover:text-primary transition-colors font-sans"
                            >
                              Messages
                            </Link>
                          </li>
                          <li>
                            <Link
                              href={`/${locale}/settings`}
                              onClick={() => onOpenChange(false)}
                              className="block py-2.5 text-[13px] text-gray-600 hover:text-primary transition-colors font-sans"
                            >
                              Profile Settings
                            </Link>
                          </li>
                          <li>
                            <button
                              type="button"
                              onClick={handleLogout}
                              className="block w-full text-start py-2.5 text-[13px] text-red-500 hover:text-red-700 transition-colors font-sans cursor-pointer outline-none"
                            >
                              Logout
                            </button>
                          </li>
                        </ul>
                      )}
                    </li>
                  ) : (
                    <li className="border-b border-gray-100">
                      <div className="flex items-center gap-3 py-3.5 text-sm text-text-main">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                          <User size={16} className="text-gray-400" />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => { onOpenChange(false); openAuthModal(); }}
                            className="hover:text-primary transition-colors cursor-pointer outline-none font-semibold"
                          >
                            {navT("login")}
                          </button>
                          <span className="opacity-40 select-none">/</span>
                          <Link
                            href={`/${locale}/register`}
                            onClick={() => onOpenChange(false)}
                            className="hover:text-primary transition-colors font-semibold"
                          >
                            {navT("register")}
                          </Link>
                        </div>
                      </div>
                    </li>
                  )}

                  {/* Main Menu Links */}
                  {mainMenuItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => onOpenChange(false)}
                        className="block py-3.5 border-b border-gray-100 text-sm text-text-main hover:text-primary transition-colors font-medium font-sans"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}

                  {/* Location Picker */}
                  <li className="border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => { setIsLocationOpen(true); onOpenChange(false); }}
                      className="flex items-center gap-2.5 py-3.5 w-full text-sm text-text-main hover:text-primary transition-colors cursor-pointer outline-none text-start font-medium font-sans"
                    >
                      <MapPin size={18} className="text-gray-400 shrink-0" />
                      <span className="truncate">{displayLocation}</span>
                    </button>
                  </li>

                  {/* Language & Currency selectors side-by-side */}
                  <li className="py-3.5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <LangDropdown languages={languagesList} className="text-text-main text-sm font-medium flex items-center gap-1.5 font-sans" />
                    </div>
                    <div className="flex items-center">
                      <CurrencyDropdown className="text-text-main text-sm font-medium flex items-center gap-1.5 font-sans" />
                    </div>
                  </li>
                </ul>
              </div>
            ) : (
              /* Categories Tab Content */
              <div className="px-4">
                <ul className="divide-y divide-gray-100/50">
                  {categoryTree.map((node) => (
                    <MobileCategoryItem
                      key={node.id}
                      node={node}
                      locale={locale}
                      onClose={() => onOpenChange(false)}
                      depth={0}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="px-4 py-4 border-t border-gray-100 shrink-0">
            <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Modesy</p>
          </div>
        </SheetContent>
      </Sheet>
      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
    </>
  );
}
