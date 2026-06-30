import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="max-w-screen-xl mx-auto px-6 py-3" aria-label="Breadcrumb">
      <ol className="flex items-center gap-0 text-sm text-gray-500">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-0">
            {index > 0 && <span className="mx-1.5 text-gray-300 select-none">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-primary hover:underline transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
