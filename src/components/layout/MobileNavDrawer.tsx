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
} from "lucide-react";
import { useState, useEffect } from "react";
import { CurrencyDropdown } from "@/components/currency/CurrencyDropdown";
import { LangDropdown } from "@/components/language/LangDropdown";
import { LocationModal } from "@/components/features/location/LocationModal";
import { useLocationStore } from "@/stores/useLocationStore";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useAuthModalStore } from "@/stores/useAuthModalStore";

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

export function MobileNavDrawer({ open, onOpenChange }: MobileNavDrawerProps) {
  const locale = useLocale();
  const t = useTranslations("mobileNav");
  const navT = useTranslations("nav");
  const { selectedCountry } = useLocationStore();
  const openAuthModal = useAuthModalStore((state) => state.open);
  const [showCategories, setShowCategories] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const clientSupabase = createClient();
        const activeLangId = locale === "ar" ? 2 : 1;

        const { data } = await clientSupabase
          .from("categories")
          .select("id, slug, parent_id, category_translations(name)")
          .eq("status", true);

        if (data) {
          const formatted = data.map((cat: any) => {
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
      } catch (err) {
        // Safe fail
      }
    }
    fetchCategories();
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
        <SheetContent side="left" className="w-[85%] max-w-sm p-0 overflow-y-auto" showCloseButton={false}>
          <SheetHeader className="flex flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
            <SheetTitle className="text-left">
              <Link href={`/${locale}`} className="text-[22px] font-bold tracking-tight" onClick={() => onOpenChange(false)}>
                <span className="text-text-main">M</span>
                <span className="text-primary">o</span>
                <span className="text-text-main">desy</span>
              </Link>
            </SheetTitle>
            <SheetClose className="outline-none cursor-pointer">
              <X size={24} className="text-gray-400 hover:text-text-main" />
            </SheetClose>
          </SheetHeader>

          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-2">{t("mainMenu")}</p>
            <ul>
              {mainMenuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-3 py-3 border-b border-gray-100 text-sm text-text-main hover:text-primary transition-colors"
                  >
                    <item.icon size={18} className="text-gray-400" />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => setShowCategories(!showCategories)}
                  className="flex items-center justify-between w-full py-3 border-b border-gray-100 text-sm text-text-main hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <Store size={18} className="text-gray-400" />
                    {t("categories")}
                  </span>
                  <ChevronRight size={16} className={`text-gray-400 transition-transform ${showCategories ? "rotate-90" : ""}`} />
                </button>
                {showCategories && (
                  <ul className="bg-gray-50/50">
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
                )}
              </li>
              <li>
                <div className="flex items-center gap-3 py-3 border-b border-gray-100 text-sm text-text-main">
                  <MapPin size={18} className="text-gray-400 shrink-0" />
                  <button
                    type="button"
                    onClick={() => { setIsLocationOpen(true); onOpenChange(false); }}
                    className="hover:text-primary transition-colors cursor-pointer outline-none text-start"
                  >
                    {selectedCountry ? selectedCountry.name : navT("location")}
                  </button>
                </div>
              </li>
              <li className="py-3 border-b border-gray-100">
                <div className="flex items-center gap-3 text-sm text-text-main">
                  <Globe size={18} className="text-gray-400 shrink-0" />
                  <LangDropdown languages={[]} className="text-text-main text-sm font-medium" />
                </div>
              </li>
              <li className="py-3 border-b border-gray-100">
                <div className="flex items-center gap-3 text-sm text-text-main">
                  <DollarSign size={18} className="text-gray-400 shrink-0" />
                  <CurrencyDropdown className="text-text-main text-sm font-medium" />
                </div>
              </li>
              <li>
                <Link
                  href={`/${locale}/register`}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 py-3 text-sm text-text-main hover:text-primary transition-colors"
                >
                  <UserPlus size={18} className="text-gray-400" />
                  {navT("register")}
                </Link>
              </li>
              <li>
                <div className="flex items-center gap-3 py-3 text-sm text-text-main hover:text-primary transition-colors">
                  <LogIn size={18} className="text-gray-400" />
                  <button
                    type="button"
                    onClick={() => { onOpenChange(false); openAuthModal(); }}
                    className="hover:text-primary transition-colors cursor-pointer outline-none text-start"
                  >
                    {navT("login")}
                  </button>
                </div>
              </li>
            </ul>
          </div>

          <div className="px-4 py-4 border-t border-gray-100 mt-4">
            <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Modesy</p>
          </div>
        </SheetContent>
      </Sheet>
      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
    </>
  );
}
