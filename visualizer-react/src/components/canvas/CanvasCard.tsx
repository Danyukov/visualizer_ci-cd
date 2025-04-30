import { Trash } from 'lucide-react'
import { toast } from 'sonner'

import type { Canvas } from '@/models/canvas'
import type { DateRange } from '@/shared/ui/tremor/tremor-date-picker'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'

import { HighchartWrapperCard } from '../chart/ui/HighchartWrapperCard'
import { DateRangePicker } from '../DateRangePicker'

type CanvasCardProps = {
  canvas: Canvas
  selectedCanvas: string | null
  onCanvasSelect: React.Dispatch<React.SetStateAction<string | null>>
  onChartSelect: React.Dispatch<React.SetStateAction<string | null>>
  onCanvasAdd: () => void
  onCanvasUpdate: (payload: Partial<Canvas>) => void
  onCanvasDelete: (id: string) => void
}

export function CanvasCard(props: CanvasCardProps) {
  const { canvas, selectedCanvas, onCanvasSelect, onChartSelect, onCanvasUpdate, onCanvasDelete } =
    props

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range) {
      toast.error('Date range is not defined')
      return
    }

    if (!range.from || !range.to) {
      toast.error('Date range is not defined')
      return
    }

    onCanvasUpdate({
      id: canvas.id,
      properties: {
        ...canvas.properties,
        dateRange: {
          from: range.from,
          to: range.to,
        },
      },
    })
  }

  return (
    <Card
      onClick={(e) => {
        e.stopPropagation()
        onChartSelect(null)
        onCanvasSelect(canvas.id)
      }}
      className={cn(canvas.id === selectedCanvas && 'shadow-primary transition-shadow')}
      key={canvas.id}
    >
      <CardHeader className='flex-row justify-between items-center'>
        <DateRangePicker
          value={{
            from: canvas.properties?.dateRange?.from,
            to: canvas.properties?.dateRange?.to,
          }}
          onChange={handleDateRangeChange}
        />
        <div className='flex gap-1'>
          <Button
            className='w-6 h-6'
            variant='ghost'
            size='icon'
            onClick={(e) => {
              e.stopPropagation()
              onCanvasDelete(canvas.id)
              onCanvasSelect(null)
            }}
          >
            <Trash />
          </Button>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-5'>
        {canvas.charts?.map((chart) => (
          <HighchartWrapperCard canvas={canvas} chart={chart} key={chart.id} />
        ))}
      </CardContent>
    </Card>
  )
}
