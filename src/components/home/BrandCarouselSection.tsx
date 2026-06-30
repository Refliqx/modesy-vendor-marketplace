import Link from "next/link";
import { useLocale } from "next-intl";

const brands = [
  "Adidas",
  "Armani",
  "Burberry",
  "Diesel",
  "Dockers",
  "Gucci",
  "H&M",
  "Hugo Boss",
  "Lacoste",
  "Lee Cooper",
  "Levi's",
  "Mango",
  "Nike",
  "Puma",
  "Tommy Hilfiger",
  "U.S. Polo Assn",
];

export function BrandCarouselSection() {
  const locale = useLocale();

  return (
    <section className="py-12 px-4 sm:px-6 max-w-screen-xl mx-auto w-full select-none border-t border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl sm:text-[22px] font-bold text-gray-900 font-sans tracking-tight">
          Shop By Brand
        </h2>
      </div>

      {/* Responsive grid: 2 cols → 3 → 4 → 6 → 8 */}
      <div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3"
        role="list"
      >
        {brands.map((name, i) => (
          <Link
            key={i}
            href={`/${locale}/search?q=${encodeURIComponent(name)}`}
            role="listitem"
            className="group relative h-14 sm:h-16 px-3 sm:px-4 border border-gray-200 rounded-lg bg-white flex items-center justify-center hover:border-primary/40 hover:shadow-md hover:bg-primary/[0.02] transition-all duration-200 cursor-pointer"
          >
            {/* Top accent bar on hover */}
            <span className="absolute inset-x-0 top-0 h-0.5 bg-primary rounded-t-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />

            <span className="font-sans font-bold text-[11px] sm:text-xs text-gray-600 group-hover:text-primary tracking-wider uppercase text-center leading-tight transition-colors duration-200">
              {name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
