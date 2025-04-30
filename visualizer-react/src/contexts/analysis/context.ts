import { ChartElementsType } from '@/components/chart/ChartElements'
import { Canvas } from '@/models/canvas'
import { Chart, ChartMeasurement, ChartYAxisOptions } from '@/models/chart'
import { createContext, Dispatch, RefObject, SetStateAction } from 'react'

interface AnalysisContext {
  canvases: Canvas[]
  selectedCanvasId: Canvas['id'] | null
  selectedChartId: Chart['id'] | null
  setSelectedCanvasId: Dispatch<SetStateAction<string | null>>
  setSelectedChartId: Dispatch<SetStateAction<string | null>>
  previewRef: RefObject<HTMLDivElement>
  selectedCanvas: Canvas | undefined
  selectedChart: Chart | undefined
  reset: () => void
  addCanvas: () => void
  updateCanvas: (payload: Partial<Canvas>) => void
  deleteCanvas: (id: string) => void
  addChart: (canvasId: string, chartType: ChartElementsType) => void
  updateChart: (canvasId: string, chartId: string, payload: Partial<Chart>) => void
  deleteChart: (canvasId: string, chartId: string) => void
  addMeasurement: (
    measurement: ChartMeasurement,
    canvasId: Canvas['id'],
    chartId: Chart['id']
  ) => void
  updateMeasurement: (
    updatedMeasurement: Partial<ChartMeasurement>,
    canvasId: Canvas['id'],
    chartId: Chart['id'],
    measurementId: ChartMeasurement['id']
  ) => void
  deleteMeasurement: (canvasId: string, chartId: string, measurementId: string) => void
  addYAxis: (canvasId: string, chartId: string, yAxis: ChartYAxisOptions) => void
  updateYAxis: (
    canvasId: string,
    chartId: string,
    yAxisId: string,
    updatedYAxis: Partial<ChartYAxisOptions>
  ) => void
  deleteYAxis: (canvasId: string, chartId: string, yAxisId: string) => void
}

export const AnalysisContext = createContext<AnalysisContext | undefined>(undefined)
