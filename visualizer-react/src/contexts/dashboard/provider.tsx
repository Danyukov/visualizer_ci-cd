import { Dashboard } from '@/models/dashboard'
import { ReactNode, useState } from 'react'
import { DashboardContext } from './context'
import { Canvas } from '@/models/canvas'
import { Chart, ChartMeasurement } from '@/models/chart'

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [dashboard, setDashboard] = useState<Dashboard | undefined | null>(undefined)

  const selectTemplate = (payload: { templateId: string; canvases: Canvas[] }) => {
    setDashboard((prev) =>
      prev ? { ...prev, templateId: payload.templateId, canvases: payload.canvases } : prev
    )
  }

  const editMeasurement = (
    canvasId: Canvas['id'],
    chartId: Chart['id'],
    measurementId: ChartMeasurement['id'],
    payload: Partial<ChartMeasurement>
  ) => {
    setDashboard((prev) => {
      if (!prev) return prev

      const updatedCanvases = prev.canvases?.map((canvas) => {
        if (canvas.id !== canvasId) return canvas

        return {
          ...canvas,
          charts:
            canvas.charts?.map((chart) => {
              if (chart.id !== chartId) return chart

              return {
                ...chart,
                measurements:
                  chart.measurements?.map((measurement) => {
                    if (measurement.id !== measurementId) return measurement

                    return {
                      ...measurement,
                      ...payload,
                      connection: payload.connection
                        ? { ...measurement.connection, ...payload.connection }
                        : measurement.connection,
                      series: payload.series
                        ? { ...measurement.series, ...payload.series }
                        : measurement.series,
                    }
                  }) || [],
              }
            }) || [],
        }
      })

      return { ...prev, canvases: updatedCanvases || [] }
    })
  }

  return (
    <DashboardContext.Provider
      value={{
        dashboard,
        setDashboard,
        selectTemplate,
        editMeasurement,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}
