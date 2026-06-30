"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search, X, Tag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCurrencyStore } from "@/stores/useCurrencyStore";

interface Suggestion {
  id: number;
  title: string;
  slug: string;
  price: number;
  discount_percent: number | null;
}

interface CategorySuggestion {
  id: number;
  name: string;
  slug: string;
}

interface DropdownRect {
  top: number;
  left: number;
  width: number;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function SearchBar({ langId = 1 }: { langId?: number }) {
  const t = useTranslations("search");
  const locale = useLocale();
  const router = useRouter();
  const selected = useCurrencyStore((s) => s.selected);
  const _hasHydrated = useCurrencyStore((s) => s._hasHydrated);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Suggestion[]>([]);
  const [categories, setCategories] = useState<CategorySuggestion[]>([]);
  const [rect, setRect] = useState<DropdownRect | null>(null);
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => { setMounted(true); }, []);

  const updateRect = useCallback(() => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setRect({
      top: r.bottom + window.scrollY,
      left: r.left + window.scrollX,
      width: r.width,
    });
  }, []);

  const formatPrice = useCallback(
    (amount: number) => {
      if (!_hasHydrated || !selected) return "";
      const converted = amount * (selected.exchange_rate ?? 1);
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: selected.code,
        maximumFractionDigits: 0,
      }).format(converted);
    },
    [_hasHydrated, selected]
  );

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setProducts([]);
      setCategories([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    fetch(
      `/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}&lang=${langId}`
    )
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products ?? []);
        setCategories(data.categories ?? []);
        updateRect();
        setOpen(true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedQuery, langId, updateRect]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const dropdown = document.getElementById("search-dropdown-portal");
      if (
        containerRef.current?.contains(e.target as Node) ||
        dropdown?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => updateRect();
    const onResize = () => updateRect();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [open, updateRect]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/${locale}/search?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const hasSuggestions = products.length > 0 || categories.length > 0;
  const showDropdown = mounted && open && (loading || hasSuggestions) && rect;

  const dropdown = showDropdown && rect ? (
    <div
      id="search-dropdown-portal"
      style={{
        position: "absolute",
        top: rect.top + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      }}
      className="bg-white rounded-lg border border-gray-200 shadow-2xl overflow-hidden"
    >
      {loading && (
        <div className="px-4 py-3 text-sm text-text-muted flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
          {t("loading")}
        </div>
      )}

      {!loading && categories.length > 0 && (
        <div className={cn(products.length > 0 && "border-b border-gray-100")}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}/products/${cat.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <Tag size={14} className="text-primary shrink-0" />
              <span className="text-sm text-text-main">{cat.name}</span>
              <span className="ms-auto text-xs text-text-muted">{t("categories")}</span>
            </Link>
          ))}
        </div>
      )}

      {!loading && products.length > 0 && (
        <div>
          <p className="px-4 pt-3 pb-1 text-xs font-semibold text-text-muted uppercase tracking-wide">
            {t("products")}
          </p>
          {products.map((p) => {
            const salePrice =
              p.discount_percent != null
                ? p.price - (p.price * p.discount_percent) / 100
                : null;
            return (
              <Link
                key={p.id}
                href={`/${locale}/product/${p.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-text-main truncate flex-1">{p.title}</span>
                <span className="text-sm font-semibold text-primary shrink-0">
                  {formatPrice(salePrice ?? p.price)}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {!loading && hasSuggestions && query.trim().length >= 2 && (
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full px-4 py-3 text-sm text-primary font-medium hover:bg-gray-50 transition-colors border-t border-gray-100 text-start"
        >
          {t("viewAll")} &ldquo;{query.trim()}&rdquo; →
        </button>
      )}
    </div>
  ) : null;

  return (
    <>
      <div ref={containerRef} className="relative flex-1 max-w-xl mx-4 lg:mx-8">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (hasSuggestions) {
                updateRect();
                setOpen(true);
              }
            }}
            placeholder={t("placeholder")}
            autoComplete="off"
            className="w-full h-11 pl-4 pr-20 border border-border rounded-md text-sm text-text-main placeholder:text-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setOpen(false);
                inputRef.current?.focus();
              }}
              className="absolute right-9 text-placeholder hover:text-text-main transition-colors"
              aria-label="Clear"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="submit"
            className="absolute right-3 text-placeholder hover:text-primary transition-colors"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </form>
      </div>

      {mounted && typeof document !== "undefined"
        ? createPortal(dropdown, document.body)
        : null}
    </>
  );
}
