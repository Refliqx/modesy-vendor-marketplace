export default function ProductsLoading() {
  return (
    <div className="flex flex-col flex-1">
      {/* Breadcrumb skeleton */}
      <div className="max-w-screen-xl mx-auto px-6 py-3 w-full">
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8 flex-1 w-full">
        {/* Title skeleton */}
        <div className="h-8 w-60 bg-gray-200 rounded animate-pulse mb-8" />
        
        <div className="flex gap-6">
          {/* Sidebar skeleton */}
          <div className="hidden lg:block w-[220px] shrink-0 space-y-6">
            <div className="border-b border-gray-100 pb-5">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Main Grid skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center py-4 border-b border-gray-100 mb-6">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
                  <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
