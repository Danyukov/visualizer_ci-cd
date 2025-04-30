import { ChartButtonElement } from './ChartButtonElement'
import { ChartElements, ChartElementsType } from './ChartElements'

interface ChartVariantListProps {
  selectedCanvasId: string
  onChartAdd: (canvasId: string, chartType: ChartElementsType) => void
}

export function ChartVariantList(props: ChartVariantListProps) {
  const { selectedCanvasId, onChartAdd } = props

  return (
    <div className='flex flex-col gap-1'>
      <p className='text-muted-foreground text-sm'>Chart variants</p>
      <div className='grid grid-cols-3 gap-2'>
        {Object.keys(ChartElements).map((key) => (
          <ChartButtonElement
            key={key}
            onChartAdd={onChartAdd}
            selectedCanvasId={selectedCanvasId}
            chartElement={ChartElements[key as keyof typeof ChartElements]}
          />
        ))}
      </div>
    </div>
  )
}
