import { cn } from '@/shared/lib/utils'

import type { ChartComponentProps } from './ChartElements'

import { ChartElements } from './ChartElements'
import { useTemplate } from '@/contexts/template/hook'

export function ChartEditorWrapper({ canvasInstance, chartInstance }: ChartComponentProps) {
  const ChartElement = ChartElements[chartInstance.type].editorComponent
  const { selectedChart } = useTemplate()

  const selected = chartInstance.id === selectedChart?.id

  return (
    <div className={cn(selected && 'shadow-primary shadow-sm rounded-xl')}>
      <ChartElement canvasInstance={canvasInstance} chartInstance={chartInstance} />
    </div>
  )
}

export function ChartPropertiesWrapper({ canvasInstance, chartInstance }: ChartComponentProps) {
  const ChartElement = ChartElements[chartInstance.type].propertiesComponent
  return <ChartElement canvasInstance={canvasInstance} chartInstance={chartInstance} />
}

export function ChartPreviewWrapper({ canvasInstance, chartInstance }: ChartComponentProps) {
  const ChartElement = ChartElements[chartInstance.type].previewComponent
  return <ChartElement canvasInstance={canvasInstance} chartInstance={chartInstance} />
}
