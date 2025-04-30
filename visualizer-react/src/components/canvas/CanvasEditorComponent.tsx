import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { cn } from '@/shared/lib/utils'
import { DeleteCanvasDialogBtn } from '@/features/canvas/DeleteCanvas'
import { ChartEditorWrapper } from '../chart/ChartElementWrappers'
import { CanvasComponentProps } from './Canvas'
import { useTemplate } from '@/contexts/template/hook'

export function CanvasEditorComponent({ canvas }: CanvasComponentProps) {
  const { selectedCanvas, setSelectedCanvas, setSelectedChart } = useTemplate()

  return (
    <Card
      onClick={(e) => {
        e.stopPropagation()
        setSelectedChart(null)
        setSelectedCanvas(canvas)
      }}
      className={cn(canvas.id === selectedCanvas?.id && 'shadow-primary transition-shadow')}
    >
      <CardHeader className='space-y-4'>
        <div className='flex justify-between items-center'>
          <CardTitle>{canvas.name}</CardTitle>
          <DeleteCanvasDialogBtn canvasId={canvas.id} />
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-5'>
        {canvas?.charts?.map((item) => (
          <div
            onClick={(e) => {
              e.stopPropagation()
              setSelectedChart(item)
              setSelectedCanvas(canvas)
            }}
            key={item.id}
          >
            <ChartEditorWrapper canvasInstance={canvas} chartInstance={item} key={item.id} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
