import { Canvas } from '@/models/canvas'
import { CanvasCard } from './CanvasCard'
import { CanvasListEmpty } from './CanvasListEmpty'

export interface CanvasListProps {
  canvases: Canvas[]
  selectedCanvas: string | null
  onCanvasSelect: React.Dispatch<React.SetStateAction<string | null>>
  onChartSelect: React.Dispatch<React.SetStateAction<string | null>>
  onCanvasAdd: () => void
  onCanvasUpdate: (payload: Partial<Canvas>) => void
  onCanvasDelete: (canvasId: Canvas['id']) => void
}

export const CanvasList = (props: CanvasListProps) => {
  const { canvases, onCanvasSelect, onChartSelect, onCanvasAdd } = props
  return (
    <div
      className='flex-1 flex flex-col gap-5 p-5'
      onClick={(e) => {
        e.stopPropagation?.()
        onCanvasSelect(null)
        onChartSelect(null)
      }}
    >
      {canvases.length ? (
        canvases.map((canvas) => <CanvasCard canvas={canvas} {...props} key={canvas.id} />)
      ) : (
        <CanvasListEmpty onCanvasAdd={onCanvasAdd} />
      )}
    </div>
  )
}
