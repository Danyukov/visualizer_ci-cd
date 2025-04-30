import type { Canvas } from '@/models/canvas'
import type { Chart, ChartMeasurement } from '@/models/chart'

import { GenericAddEditChartMeasurementSheetBtn } from '@/features/measurement/GenericAddEditChartMeasurement'
import { Label } from '@/shared/ui/label'
import { Button } from '@/shared/ui/button'
import { PlusIcon } from 'lucide-react'

interface CanvasTreeListProps {
  canvases: Canvas[]
  onSelectCanvas?: React.Dispatch<React.SetStateAction<string | null>>
  onSelectChart?: React.Dispatch<React.SetStateAction<string | null>>
  onCanvasAdd?: () => void
  onMeasurementUpdate?: (
    updatedMeasurement: Partial<ChartMeasurement>,
    canvasId: Canvas['id'],
    chartId: Chart['id'],
    measurementId: ChartMeasurement['id']
  ) => void
}

export function CanvasTreeList(props: CanvasTreeListProps) {
  const { canvases, onSelectCanvas, onSelectChart, onCanvasAdd, onMeasurementUpdate } = props

  return (
    <div>
      <div className='flex gap-2 justify-between items-center'>
        <Label>Canvases</Label>
        {onCanvasAdd && (
          <Button className='w-6 h-6' variant='ghost' size='icon' onClick={onCanvasAdd}>
            <PlusIcon />
          </Button>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        {canvases?.map((item) => (
          <div key={item.id}>
            <div
              className='flex justify-between items-center gap-2 px-2 py-1 text-muted-foreground rounded-md hover:bg-zinc-50 hover:text-zinc-800 hover:cursor-pointer transition-all'
              onClick={(e) => {
                e.stopPropagation()
                onSelectCanvas?.(item.id)
              }}
            >
              <div className='text-sm'>{item.name ?? 'Untitled canvas'}</div>
            </div>
            <div>
              {item.charts?.map((chart) => (
                <div key={chart.id}>
                  <div
                    className='flex justify-between items-center gap-2 px-4 py-1 text-muted-foreground rounded-md hover:bg-zinc-50 hover:text-zinc-800 hover:cursor-pointer transition-all'
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectCanvas?.(item.id)
                      onSelectChart?.(chart.id)
                    }}
                  >
                    <div className='text-sm'>{chart.name ?? 'Untitled chart'}</div>
                  </div>
                  <div>
                    {chart.measurements?.map((measurement) => (
                      <div
                        className='flex justify-between items-center gap-2 px-6 py-1 text-muted-foreground rounded-md hover:bg-zinc-50 hover:text-zinc-800 hover:cursor-pointer transition-all'
                        key={measurement.id}
                      >
                        <div className='text-sm'>
                          {measurement.connection.measurementVersionName}
                        </div>
                        {onMeasurementUpdate && (
                          <GenericAddEditChartMeasurementSheetBtn
                            canvasId={item.id}
                            chartId={chart.id}
                            measurement={measurement}
                            onEdit={onMeasurementUpdate}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
