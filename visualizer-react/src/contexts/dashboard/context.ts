import { Canvas } from '@/models/canvas'
import { Chart, ChartMeasurement } from '@/models/chart'
import { Dashboard } from '@/models/dashboard'
import { createContext, Dispatch, SetStateAction } from 'react'

export interface DashboardContext {
  dashboard: Dashboard | undefined | null
  setDashboard: Dispatch<SetStateAction<Dashboard | undefined | null>>
  selectTemplate: (payload: { templateId: string; canvases: Canvas[] }) => void
  editMeasurement: (
    canvasId: Canvas['id'],
    chartId: Chart['id'],
    measurementId: ChartMeasurement['id'],
    payload: Partial<ChartMeasurement>
  ) => void
}

export const DashboardContext = createContext<DashboardContext | undefined>(undefined)
