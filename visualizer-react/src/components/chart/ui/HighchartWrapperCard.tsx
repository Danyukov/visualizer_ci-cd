import { subDays } from 'date-fns'
import { Trash } from 'lucide-react'
import { useRef } from 'react'
import { toast } from 'sonner'

import type { Canvas } from '@/models/canvas'
import type { Chart } from '@/models/chart'

import { useGetMeasurementDtoValues } from '@/api/imby/queries'
import { getMeasurementVersions } from '@/components/chart/lib/getMeasurementVersions'
import { HighchartSkeleton } from '@/components/chart/ui/HighchartSkeleton'
import { HighchartWrapper } from '@/components/chart/ui/HighchartWrapper'
import { PreviewBtn } from '@/features/Preview'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

import { HighchartWrapperCardEmptyState } from './HighchartWrapperCardEmptyState'
import { useAnalysis } from '@/contexts/analysis/hook'

type HighchartWrapperCardProps = {
  canvas: Canvas
  chart: Chart
}

export function HighchartWrapperCard({ canvas, chart }: HighchartWrapperCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { setSelectedChartId, setSelectedCanvasId, selectedChartId, deleteChart } = useAnalysis()

  const versions = getMeasurementVersions(chart) ?? []

  const { data, isLoading, refetch } = useGetMeasurementDtoValues({
    versions,
    dateRange: {
      from: new Date(canvas.properties?.dateRange?.from || subDays(Date.now(), 1)),
      to: new Date(canvas.properties?.dateRange?.to || new Date(Date.now())),
    },
  })

  const onVisualize = () => {
    if (!canvas) {
      toast.error('Select canvas')
      return
    }
    if (
      versions.length > 0 &&
      canvas?.properties?.dateRange?.from !== undefined &&
      canvas?.properties.dateRange.to !== undefined
    ) {
      refetch()
    } else {
      toast.error('No measurements set')
    }
  }

  return (
    <Card
      ref={ref}
      className={cn(chart.id === selectedChartId && 'shadow-primary transition-shadow')}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedCanvasId(canvas.id)
        setSelectedChartId(chart.id)
      }}
      key={chart.id}
    >
      <CardHeader className='flex-row justify-between items-center'>
        <CardTitle>{chart.name}</CardTitle>
        <div className='flex gap-1'>
          <PreviewBtn containerRef={ref} />
          <Button
            className='w-6 h-6'
            variant='ghost'
            size='icon'
            onClick={() => deleteChart(canvas.id, chart.id)}
          >
            <Trash />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isLoading && !data && (
          <HighchartWrapperCardEmptyState elementInstance={chart} onVisualize={onVisualize} />
        )}
        {isLoading && <HighchartSkeleton />}
        {!isLoading && data && <HighchartWrapper chartElementInstance={chart} data={data} />}
      </CardContent>
    </Card>
  )
}
