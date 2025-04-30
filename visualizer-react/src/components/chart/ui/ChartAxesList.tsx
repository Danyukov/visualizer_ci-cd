import type { Chart } from '@/models/chart'

import { YAxesSettingsDialogBtn } from '@/features/YAxesSettings'
import { ScrollArea } from '@/shared/ui/scroll-area'

export function ChartAxesList({ elementInstance }: { elementInstance: Chart }) {
  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground text-sm">Y Axes</p>
        <YAxesSettingsDialogBtn chartInstance={elementInstance} />
      </div>
      <div>
        <ScrollArea className="h-[120px] pr-1">
          {elementInstance.yAxes?.map(item => (
            <div
              className="group transition-all flex items-center justify-between py-1 px-3 text-muted-foreground text-sm rounded-sm hover:bg-muted/50 hover:cursor-pointer"
              key={item.id}
            >
              {item.title?.text}
              <div>
                <YAxesSettingsDialogBtn
                  chartInstance={elementInstance}
                  className="opacity-0 transition-all group-hover:opacity-100"
                  yAxis={item}
                />
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </>
  )
}
