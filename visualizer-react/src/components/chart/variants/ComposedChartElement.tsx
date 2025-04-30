import { endOfToday, startOfToday } from 'date-fns'
import { ChartSpline } from 'lucide-react'
import { useRef } from 'react'
import { toast } from 'sonner'
import { v4 as uuid } from 'uuid'

import { useGetMeasurementDtoValues } from '@/api/imby/queries'
import { HighchartWrapper } from '@/components/chart/ui/HighchartWrapper'
import { ChartPropertiesForm } from '@/components/forms/ChartPropertiesForm'
import { DeleteChartDialogBtn } from '@/features/DeleteChart'
import { PreviewBtn } from '@/features/Preview'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Separator } from '@/shared/ui/separator'

import type { ChartComponentProps, ChartElementsType, ChartElementType } from '../ChartElements'

import { getMeasurementVersions } from '../lib/getMeasurementVersions'
import { ChartAxesList } from '../ui/ChartAxesList'
import { ChartMeasurementList } from '../ui/ChartMeasurementList'
import { HighchartSkeleton } from '../ui/HighchartSkeleton'
import { HighchartWrapperCardEmptyState } from '../ui/HighchartWrapperCardEmptyState'
import { useTemplate } from '@/contexts/template/hook'

const type: ChartElementsType = 'Composed'

export const ComposedChartElement: ChartElementType = {
  type,

  construct: () => ({
    id: uuid(),
    type,
  }),

  buttonComponent: {
    icon: ChartSpline,
    label: 'Composed chart',
  },

  editorComponent: EditorComponent,
  propertiesComponent: PropertiesComponent,
  previewComponent: PreviewComponent,
}

function EditorComponent({ canvasInstance, chartInstance }: ChartComponentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const versions = getMeasurementVersions(chartInstance) ?? []
  const { selectedCanvas } = useTemplate()

  const { data, isLoading, refetch } = useGetMeasurementDtoValues({
    versions,
    dateRange: {
      from: canvasInstance.properties?.dateRange?.from ?? new Date(),
      to: canvasInstance.properties?.dateRange?.to ?? new Date(),
    },
  })

  const onVisualize = () => {
    if (!versions.length) {
      toast.error('Measurement versions is not defined')
      return
    }

    if (!canvasInstance.properties?.dateRange?.from || !canvasInstance.properties?.dateRange?.to) {
      toast.error('Date range is not defined')
      return
    }

    refetch()
  }

  return (
    <Card ref={ref}>
      <CardHeader className='flex-row items-center justify-between space-y-0'>
        <div>
          <CardTitle>{chartInstance.name}</CardTitle>
          <CardDescription>{chartInstance.description}</CardDescription>
        </div>
        <div className='flex items-center gap-2'>
          <PreviewBtn containerRef={ref} />
          <DeleteChartDialogBtn
            className='opacity-1'
            canvasId={selectedCanvas?.id}
            chartId={chartInstance.id}
          />
        </div>
      </CardHeader>
      <CardContent>
        {!isLoading && !data && (
          <HighchartWrapperCardEmptyState
            elementInstance={chartInstance}
            onVisualize={onVisualize}
          />
        )}
        {isLoading && <HighchartSkeleton />}
        {data && <HighchartWrapper chartElementInstance={chartInstance} data={data} />}
      </CardContent>
    </Card>
  )
}

function PropertiesComponent({ canvasInstance, chartInstance }: ChartComponentProps) {
  return (
    <>
      <ChartPropertiesForm elementInstance={chartInstance} />
      <Separator className='h-[1px] my-1' />
      <ChartMeasurementList canvas={canvasInstance} chart={chartInstance} />
      <Separator className='h-[1px] my-1' />
      <ChartAxesList elementInstance={chartInstance} />
    </>
  )
}

function PreviewComponent({ canvasInstance, chartInstance }: ChartComponentProps) {
  const versions = getMeasurementVersions(chartInstance) ?? []

  const { data, isLoading, refetch } = useGetMeasurementDtoValues({
    versions,
    dateRange: {
      from: canvasInstance.properties?.dateRange?.from || startOfToday(),
      to: canvasInstance.properties?.dateRange?.to || endOfToday(),
    },
  })

  refetch()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{chartInstance.name}</CardTitle>
        <CardDescription>{chartInstance.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <HighchartSkeleton />}
        {data && <HighchartWrapper chartElementInstance={chartInstance} data={data} />}
      </CardContent>
    </Card>
  )
}
