import { Skeleton } from "@/components/ui/skeleton";

export function HeroCarouselSkeleton() {
  return (
    <Skeleton className="w-full h-[320px] lg:h-[480px] rounded-none bg-gray-200 animate-pulse" />
  );
}
