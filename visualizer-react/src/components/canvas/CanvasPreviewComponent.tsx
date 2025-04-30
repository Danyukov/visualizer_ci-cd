import { ChartPreviewWrapper } from "../chart/ChartElementWrappers";
import { CanvasComponentProps } from "./Canvas";
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

export function CanvasPreviewComponent({ canvas }: CanvasComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{canvas.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {canvas?.charts?.map(item => (
          <ChartPreviewWrapper
            canvasInstance={canvas}
            chartInstance={item}
            key={item.id}
          />
        ))}
      </CardContent>
    </Card>
  )
}