import { Skeleton } from "@/components/ui/skeleton";

export function CategoryGridSkeleton() {
  return (
    <section className="py-12 px-6 max-w-screen-xl mx-auto select-none">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-3">
            <Skeleton className="w-32 h-32 lg:w-44 lg:h-44 rounded-full" />
            <Skeleton className="w-24 h-4" />
          </div>
        ))}
      </div>
    </section>
  );
}
