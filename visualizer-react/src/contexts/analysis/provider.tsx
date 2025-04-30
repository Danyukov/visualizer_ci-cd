import type { ReactNode } from 'react'

import { endOfToday, startOfToday } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { v4 as uuid } from 'uuid'

import type { ChartElementsType } from '@/components/chart/ChartElements'
import type { Canvas } from '@/models/canvas'
import type { Chart, ChartMeasurement, ChartYAxisOptions } from '@/models/chart'

import { CanvasElement } from '@/components/canvas/Canvas'
import { ChartElements } from '@/components/chart/ChartElements'
import { AnalysisContext } from './context'

const SESSION_STORAGE_KEY = 'analyze'

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [canvases, setCanvases] = useState<Canvas[]>([])
  const [selectedCanvasId, setSelectedCanvasId] = useState<Canvas['id'] | null>(null)
  const [selectedChartId, setSelectedChartId] = useState<Chart['id'] | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const saveToSessionStorage = (updated: Canvas[]) => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated))
  }

  const convertDataRange = (canvases: Canvas[]): Canvas[] => {
    return canvases.map((cnv) => {
      const dateTimeFromStr = cnv.properties?.dateRange?.from
      const dateTimeToStr = cnv.properties?.dateRange?.to
      return {
        ...cnv,
        properties: {
          ...cnv.properties,
          dateRange: {
            from: dateTimeFromStr ? new Date(dateTimeFromStr) : startOfToday(),
            to: dateTimeToStr ? new Date(dateTimeToStr) : endOfToday(),
          },
        },
      }
    })
  }

  useEffect(() => {
    const loadFromSessionStorage = () => {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        const conveted = convertDataRange(parsed)
        setCanvases(conveted)
      }
    }

    loadFromSessionStorage()
  }, [])

  const selectedCanvas = canvases.find((canvas) => canvas.id === selectedCanvasId)

  const selectedChart = selectedCanvas?.charts?.find((chart) => chart.id === selectedChartId)

  const reset = () => {
    setCanvases([])
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
  }

  const addCanvas = () => {
    const newCanvas = CanvasElement.construct()
    setCanvases((prev) => {
      const updated = [...prev, newCanvas]
      saveToSessionStorage(updated)
      return updated
    })
  }

  const updateCanvas = (payload: Partial<Canvas>) => {
    setCanvases((prev) => {
      const updated = prev.map((cnv) => (cnv.id === payload.id ? { ...cnv, ...payload } : cnv))
      saveToSessionStorage(updated)
      return updated
    })
  }

  const deleteCanvas = (id: string) => {
    setCanvases((prev) => {
      const updated = prev.filter((cnv) => cnv.id !== id)
      saveToSessionStorage(updated)
      return updated
    })
  }

  const addChart = (canvasId: string, chartType: ChartElementsType) => {
    const newChart = ChartElements[chartType].construct(uuid())
    setCanvases((prev) => {
      const updatedCanvases = prev.map((canvas) =>
        canvas.id === canvasId
          ? {
              ...canvas,
              charts: canvas.charts ? [...canvas.charts, newChart] : [newChart],
            }
          : canvas
      )
      saveToSessionStorage(updatedCanvases)
      return updatedCanvases
    })
  }

  const updateChart = (canvasId: string, chartId: string, payload: Partial<Chart>) => {
    setCanvases((prev) => {
      const updatedCanvases = prev.map((canvas) => {
        if (canvas.id !== canvasId) {
          return canvas
        }

        if (!canvas.charts) {
          return canvas
        }

        const updatedCharts = canvas.charts.map((chart) => {
          if (chart.id === chartId) {
            return { ...chart, ...payload }
          }
          return chart
        })

        return { ...canvas, charts: updatedCharts }
      })

      saveToSessionStorage(updatedCanvases)

      return updatedCanvases
    })
  }

  const deleteChart = (canvasId: string, chartId: string) => {
    setCanvases((prev) => {
      const updatedCanvases = prev.map((canvas) =>
        canvas.id === canvasId
          ? {
              ...canvas,
              charts: canvas.charts ? canvas.charts.filter((chart) => chart.id !== chartId) : [],
            }
          : canvas
      )
      saveToSessionStorage(updatedCanvases)
      return updatedCanvases
    })
  }

  const addMeasurement = (
    measurement: ChartMeasurement,
    canvasId: Canvas['id'],
    chartId: Chart['id']
  ) => {
    setCanvases((prev) => {
      const updatedCanvases = prev.map((canvas) =>
        canvas.id === canvasId
          ? {
              ...canvas,
              charts: canvas.charts
                ? canvas.charts.map((chart) =>
                    chart.id === chartId
                      ? {
                          ...chart,
                          measurements: [...(chart.measurements || []), measurement],
                        }
                      : chart
                  )
                : [],
            }
          : canvas
      )
      saveToSessionStorage(updatedCanvases)
      toast.success('Measurement has been added')
      return updatedCanvases
    })
  }

  const updateMeasurement = (
    updatedMeasurement: Partial<ChartMeasurement>,
    canvasId: Canvas['id'],
    chartId: Chart['id'],
    measurementId: ChartMeasurement['id']
  ) => {
    setCanvases((prev) => {
      const updatedCanvases = prev.map((canvas) =>
        canvas.id === canvasId
          ? {
              ...canvas,
              charts: canvas.charts
                ? canvas.charts.map((chart) =>
                    chart.id === chartId
                      ? {
                          ...chart,
                          measurements: chart.measurements
                            ? chart.measurements.map((measurement) =>
                                measurement.id === measurementId
                                  ? { ...measurement, ...updatedMeasurement }
                                  : measurement
                              )
                            : [],
                        }
                      : chart
                  )
                : [],
            }
          : canvas
      )
      saveToSessionStorage(updatedCanvases)
      toast.success('Changes have been saved')
      return updatedCanvases
    })
  }

  const deleteMeasurement = (canvasId: string, chartId: string, measurementId: string) => {
    setCanvases((prev) => {
      const updatedCanvases = prev.map((canvas) =>
        canvas.id === canvasId
          ? {
              ...canvas,
              charts: canvas.charts
                ? canvas.charts.map((chart) =>
                    chart.id === chartId
                      ? {
                          ...chart,
                          measurements: chart.measurements
                            ? chart.measurements.filter(
                                (measurement) => measurement.id !== measurementId
                              )
                            : [],
                        }
                      : chart
                  )
                : [],
            }
          : canvas
      )
      saveToSessionStorage(updatedCanvases)
      toast.success('Measurement has been deleted')
      return updatedCanvases
    })
  }

  const addYAxis = (canvasId: string, chartId: string, yAxis: ChartYAxisOptions) => {
    setCanvases((prev) => {
      const updatedCanvases = prev.map((canvas) =>
        canvas.id === canvasId
          ? {
              ...canvas,
              charts: canvas.charts
                ? canvas.charts.map((chart) =>
                    chart.id === chartId
                      ? {
                          ...chart,
                          yAxes: chart.yAxes ? [...chart.yAxes, yAxis] : [yAxis],
                        }
                      : chart
                  )
                : [],
            }
          : canvas
      )
      saveToSessionStorage(updatedCanvases)
      toast.success('Y-Axis has been added')
      return updatedCanvases
    })
  }

  const updateYAxis = (
    canvasId: string,
    chartId: string,
    yAxisId: string,
    updatedYAxis: Partial<ChartYAxisOptions>
  ) => {
    setCanvases((prev) => {
      const updatedCanvases = prev.map((canvas) =>
        canvas.id === canvasId
          ? {
              ...canvas,
              charts: canvas.charts
                ? canvas.charts.map((chart) =>
                    chart.id === chartId
                      ? {
                          ...chart,
                          yAxes: chart.yAxes
                            ? chart.yAxes.map((yAxis) =>
                                yAxis.id === yAxisId ? { ...yAxis, ...updatedYAxis } : yAxis
                              )
                            : [],
                        }
                      : chart
                  )
                : [],
            }
          : canvas
      )
      saveToSessionStorage(updatedCanvases)
      toast.success('Y-Axis has been updated')
      return updatedCanvases
    })
  }

  const deleteYAxis = (canvasId: string, chartId: string, yAxisId: string) => {
    setCanvases((prev) => {
      const updatedCanvases = prev.map((canvas) =>
        canvas.id === canvasId
          ? {
              ...canvas,
              charts: canvas.charts
                ? canvas.charts.map((chart) =>
                    chart.id === chartId
                      ? {
                          ...chart,
                          yAxes: chart.yAxes
                            ? chart.yAxes.filter((yAxis) => yAxis.id !== yAxisId)
                            : [],
                        }
                      : chart
                  )
                : [],
            }
          : canvas
      )
      saveToSessionStorage(updatedCanvases)
      toast.success('Y-Axis has been deleted')
      return updatedCanvases
    })
  }

  return (
    <AnalysisContext.Provider
      value={{
        canvases,
        selectedCanvasId,
        setSelectedCanvasId,
        selectedChartId,
        setSelectedChartId,
        selectedCanvas,
        selectedChart,
        previewRef,
        reset,
        addCanvas,
        updateCanvas,
        deleteCanvas,
        addChart,
        updateChart,
        deleteChart,
        addMeasurement,
        updateMeasurement,
        deleteMeasurement,
        addYAxis,
        updateYAxis,
        deleteYAxis,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  )
}
