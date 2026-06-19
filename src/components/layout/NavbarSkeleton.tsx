import { Skeleton } from "@/components/ui/skeleton";

export function NavbarSkeleton() {
  return (
    <div className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 select-none">
      <Skeleton className="w-24 h-6" />
      <Skeleton className="hidden md:block w-[55%] h-11" />
      <div className="flex items-center gap-6">
        <Skeleton className="w-20 h-5" />
        <Skeleton className="w-16 h-5" />
        <Skeleton className="w-24 h-10 rounded-md" />
      </div>
    </div>
  );
}
