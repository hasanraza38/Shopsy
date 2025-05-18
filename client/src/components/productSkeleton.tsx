import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="w-[350px] p-4 bg-white rounded-md shadow-lg space-y-4">
      <Skeleton className="w-full h-[200px] rounded-md" />

      <Skeleton className="h-6 w-3/4" />

      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />

      <div className="flex justify-end">
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
}
