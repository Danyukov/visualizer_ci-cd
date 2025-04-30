import { Button } from '@/shared/ui/button'

import type { ChartElementsType, ChartElementType } from './ChartElements'

interface ChartButtonElementProps {
  chartElement: ChartElementType
  selectedCanvasId: string
  onChartAdd: (canvasId: string, chartType: ChartElementsType) => void
}

export function ChartButtonElement(props: ChartButtonElementProps) {
  const { chartElement, selectedCanvasId, onChartAdd } = props

  const { icon: Icon, label } = chartElement.buttonComponent

  if (!selectedCanvasId) return null

  return (
    <Button
      className='flex flex-col w-full h-full aspect-square'
      variant='outline'
      onClick={() => onChartAdd(selectedCanvasId, chartElement.type)}
    >
      <Icon className='w-4 h-4' />
      <p className='text-xs'>{label}</p>
    </Button>
  )
}
