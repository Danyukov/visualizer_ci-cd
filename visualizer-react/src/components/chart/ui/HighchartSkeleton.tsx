import { cn } from '@/shared/lib/utils'
import { Skeleton } from '@/shared/ui/skeleton'

export function HighchartSkeleton({ className }: { className?: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Skeleton className="w-[100px] h-[22px]" />
          <Skeleton className="w-[200px] h-[22px]" />
        </div>
        <Skeleton className={cn('w-full h-[390px]', className)} />
        <Skeleton className="w-full h-4" />
      </div>
      <Skeleton className="w-full h-[50px]" />
      <div className="flex justify-center gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton className="w-[160px] h-4" key={index} />
        ))}
      </div>
    </div>
  )
}
