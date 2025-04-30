import { ChartElementsType } from '@/components/chart/ChartElements'
import { Canvas } from '@/models/canvas'
import { Chart, ChartMeasurement, ChartYAxisOptions } from '@/models/chart'
import { Template } from '@/models/template'
import { createContext } from 'react'

export interface TemplateContext {
  template: Template | undefined
  setTemplate: (template: Template) => void
  updateTemplate: (updatedTemplate: Partial<Template>) => void

  addCanvas: () => void
  updateCanvas: (canvasId: string, updatedCanvas: Partial<Canvas>) => void
  deleteCanvas: (canvasId: string) => void
  selectedCanvas: Canvas | null
  setSelectedCanvas: (selectedCanvas: Canvas | null) => void

  getCurrentCanvas: () => Canvas | undefined
  getCurrentChart: () => Chart | undefined

  addChart: (canvasId: string, chartType: ChartElementsType) => void
  updateChart: (canvasId: string, chartId: string, updatedChart: Partial<Chart>) => void
  deleteChart: (canvasId: string, chartId: string) => void

  selectedChart: Chart | null
  setSelectedChart: (selectedChart: Chart | null) => void

  addMeasurement: (canvasId: string, chartId: string, payload: ChartMeasurement) => void
  editMeasurement: (
    canvasId: string,
    chartId: string,
    measurementId: string,
    payload: ChartMeasurement
  ) => void
  deleteMeasurement: (canvasId: string, chartId: string, measurementId: string) => void

  addYAxis: (canvasId: string, chartId: string, payload: ChartYAxisOptions) => void
  updateYAxis: (
    canvasId: string,
    chartId: string,
    yAxisId: string,
    payload: ChartYAxisOptions
  ) => void
  deleteYAxis: (canvasId: string, chartId: string, yAxisId: string) => void
}

export const TemplateContext = createContext<TemplateContext | undefined>(undefined)
