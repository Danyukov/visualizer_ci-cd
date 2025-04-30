import { useAnalysis } from '@/contexts/analysis/hook'
import { CanvasList } from '@/components/canvas/CanvasList'

export function AnalyzeContent() {
  const {
    canvases,
    setSelectedCanvasId,
    setSelectedChartId,
    selectedCanvasId,
    addCanvas,
    updateCanvas,
    deleteCanvas,
  } = useAnalysis()

  return (
    <CanvasList
      canvases={canvases}
      selectedCanvas={selectedCanvasId}
      onCanvasSelect={setSelectedCanvasId}
      onChartSelect={setSelectedChartId}
      onCanvasAdd={addCanvas}
      onCanvasUpdate={updateCanvas}
      onCanvasDelete={deleteCanvas}
    />
  )
}
