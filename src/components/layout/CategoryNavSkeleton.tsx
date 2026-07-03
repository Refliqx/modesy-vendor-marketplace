import { Skeleton } from "@/components/ui/skeleton";

export function CategoryNavSkeleton() {
  return (
    <div className="w-full h-12 bg-white border-b border-gray-100 select-none hidden md:block">
      <div className="max-w-screen-xl mx-auto px-6 h-full flex items-center gap-8 overflow-x-auto no-scrollbar">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="w-20 h-5 shrink-0" />
        ))}
      </div>
    </div>
  );
}
