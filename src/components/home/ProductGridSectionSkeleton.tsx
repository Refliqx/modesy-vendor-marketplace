export function ProductGridSectionSkeleton() {
  return (
    <section className="py-12 px-6 max-w-screen-xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}
