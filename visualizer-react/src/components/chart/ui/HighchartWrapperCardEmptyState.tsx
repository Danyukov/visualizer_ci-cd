import { ChartNoAxesColumn, PlayCircle, Unplug } from 'lucide-react'

import type { Chart } from '@/models/chart'

import { Button } from '@/shared/ui/button'

type HighchartWrapperCardEmptyStateProps = {
  elementInstance: Chart
  onVisualize: () => void
}

export function HighchartWrapperCardEmptyState(props: HighchartWrapperCardEmptyStateProps) {
  const { elementInstance, onVisualize } = props

  return (
    <>
      <div className="">
        <div className="flex flex-col gap-4 h-72 items-center justify-center text-center border rounded-xl">
          {!elementInstance.measurements?.length
            ? (
                <div className="flex flex-col gap-1 justify-center items-center">
                  <ChartNoAxesColumn className="mx-auto" />
                  <p className="font-medium">No measurements added</p>
                  <p className="text-sm text-muted-foreground">
                    You need to add measurements before visualizing the data.
                  </p>
                  <Button className="w-max" size="sm">
                    <Unplug />
                    Add Measurements
                  </Button>
                </div>
              )
            : (
                <div className="flex flex-col gap-1 justify-center items-center">
                  <ChartNoAxesColumn className="mx-auto" />
                  <p className="font-medium">Ready to Visualize</p>
                  <p className="text-sm text-muted-foreground">
                    Your measurements are set. Click below to visualize the data.
                  </p>
                  <Button className="w-max" size="sm" onClick={onVisualize}>
                    <PlayCircle />
                    Visualize
                  </Button>
                </div>
              )}
        </div>
      </div>
    </>
  )
}

// 3. Состояние: Произошла ошибка
// Заголовок: "Error occurred"
// Подзаголовок: "Something went wrong. Please check your data or try again later."
// Кнопка: "Retry"
