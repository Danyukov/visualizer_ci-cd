import { CanvasElement } from '@/components/canvas/Canvas'

import { useTemplate } from '@/contexts/template/hook'

export function TemplateEditorPageCanvasList() {
  const { template, selectedCanvas, setSelectedCanvas, selectedChart, setSelectedChart } =
    useTemplate()

  return (
    <section
      className='flex flex-col gap-5 p-5 h-full'
      onClick={() => {
        if (selectedCanvas) setSelectedCanvas(null)
        if (selectedChart) setSelectedChart(null)
      }}
    >
      {template?.canvases?.map((item) => (
        <CanvasElement.editorComponent canvas={item} key={item.id} />
      ))}
    </section>
  )
}
