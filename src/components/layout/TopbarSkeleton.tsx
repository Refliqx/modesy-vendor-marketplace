export function TopbarSkeleton() {
  return (
    <div className="w-full h-10 bg-topbar-bg flex items-center justify-between px-6 select-none">
      <div className="flex gap-6 items-center">
        <div className="h-4 w-12 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="flex gap-4 items-center">
        <div className="h-5 w-20 bg-white/10 rounded-full animate-pulse" />
        <div className="h-5 w-24 bg-white/10 rounded-full animate-pulse" />
        <div className="h-5 w-28 bg-white/10 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
