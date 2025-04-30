import { ReactNode, useState } from 'react'
import { TemplateContext } from './context'
import { Template } from '@/models/template'
import { Canvas } from '@/models/canvas'
import { Chart, ChartMeasurement, ChartYAxisOptions } from '@/models/chart'
import { CanvasElement } from '@/components/canvas/Canvas'
import { ChartElements, ChartElementsType } from '@/components/chart/ChartElements'
import { v4 as uuidv4 } from 'uuid'

export const TemplateProvider = ({ children }: { children: ReactNode }) => {
  const [template, setTemplate] = useState<Template | undefined>(undefined)
  const [selectedCanvas, setSelectedCanvas] = useState<Canvas | null>(null)
  const [selectedChart, setSelectedChart] = useState<Chart | null>(null)

  // Обновление template
  const updateTemplate = (updatedTemplate: Partial<Template>) => {
    setTemplate((prev) => {
      if (prev) {
        return { ...prev, ...updatedTemplate }
      }
      return prev
    })
  }

  // Добавление нового canvas
  const addCanvas = () => {
    setTemplate((prev) => {
      if (prev) {
        const newCanvas = CanvasElement.construct()
        return {
          ...prev,
          canvases: [...(prev.canvases || []), newCanvas],
        }
      }
      return prev
    })
  }

  // Обновление canvas по ID
  const updateCanvas = (canvasId: string, updatedCanvas: Partial<Canvas>) => {
    setTemplate((prev) => {
      if (prev) {
        return {
          ...prev,
          canvases: prev.canvases?.map((canvas) =>
            canvas.id === canvasId ? { ...canvas, ...updatedCanvas } : canvas
          ),
        }
      }
      return prev
    })
  }

  // Удаление canvas по ID
  const deleteCanvas = (canvasId: string) => {
    setTemplate((prev) => {
      if (prev) {
        return {
          ...prev,
          canvases: prev.canvases?.filter((canvas) => canvas.id !== canvasId),
        }
      }
      return prev
    })
  }

  // Добавление chart в canvas
  const addChart = (canvasId: string, chartType: ChartElementsType) => {
    setTemplate((prev) => {
      if (prev) {
        const canvas = prev.canvases?.find((canvas) => canvas.id === canvasId)
        if (canvas) {
          const newChart = ChartElements[chartType].construct(uuidv4())
          return {
            ...prev,
            canvases: prev.canvases?.map((canvas) =>
              canvas.id === canvasId
                ? { ...canvas, charts: [...(canvas.charts || []), newChart] }
                : canvas
            ),
          }
        }
      }
      return prev
    })
  }

  // Обновление chart
  const updateChart = (canvasId: string, chartId: string, updatedChart: Partial<Chart>) => {
    setTemplate((prev) => {
      if (prev) {
        return {
          ...prev,
          canvases: prev.canvases?.map((canvas) => {
            if (canvas.id === canvasId) {
              return {
                ...canvas,
                charts: canvas.charts?.map((chart) =>
                  chart.id === chartId ? { ...chart, ...updatedChart } : chart
                ),
              }
            }
            return canvas
          }),
        }
      }
      return prev
    })
  }

  // Удаление chart по ID
  const deleteChart = (canvasId: string, chartId: string) => {
    setTemplate((prev) => {
      if (prev) {
        return {
          ...prev,
          canvases: prev.canvases?.map((canvas) => {
            if (canvas.id === canvasId) {
              return {
                ...canvas,
                charts: canvas.charts?.filter((chart) => chart.id !== chartId),
              }
            }
            return canvas
          }),
        }
      }
      return prev
    })
  }

  // Добавление measurement в chart
  const addMeasurement = (canvasId: string, chartId: string, payload: ChartMeasurement) => {
    setTemplate((prev) => {
      if (prev) {
        return {
          ...prev,
          canvases: prev.canvases?.map((canvas) => {
            if (canvas.id === canvasId) {
              return {
                ...canvas,
                charts: canvas.charts?.map((chart) => {
                  if (chart.id === chartId) {
                    return {
                      ...chart,
                      measurements: [...(chart.measurements || []), payload],
                    }
                  }
                  return chart
                }),
              }
            }
            return canvas
          }),
        }
      }
      return prev
    })
  }

  // Редактирование measurement
  const editMeasurement = (
    canvasId: string,
    chartId: string,
    measurementId: string,
    payload: ChartMeasurement
  ) => {
    setTemplate((prev) => {
      if (prev) {
        return {
          ...prev,
          canvases: prev.canvases?.map((canvas) => {
            if (canvas.id === canvasId) {
              return {
                ...canvas,
                charts: canvas.charts?.map((chart) => {
                  if (chart.id === chartId) {
                    return {
                      ...chart,
                      measurements: chart.measurements?.map((measurement) =>
                        measurement.id === measurementId
                          ? { ...measurement, ...payload }
                          : measurement
                      ),
                    }
                  }
                  return chart
                }),
              }
            }
            return canvas
          }),
        }
      }
      return prev
    })
  }

  // Удаление measurement
  const deleteMeasurement = (canvasId: string, chartId: string, measurementId: string) => {
    setTemplate((prev) => {
      if (prev) {
        return {
          ...prev,
          canvases: prev.canvases?.map((canvas) => {
            if (canvas.id === canvasId) {
              return {
                ...canvas,
                charts: canvas.charts?.map((chart) => {
                  if (chart.id === chartId) {
                    // Фильтруем измерения внутри нужного графика
                    const updatedMeasurements = chart.measurements?.filter(
                      (measurement) => measurement.id !== measurementId
                    )
                    return {
                      ...chart,
                      measurements: updatedMeasurements || [], // Если measurements пустое, возвращаем пустой массив
                    }
                  }
                  return chart
                }),
              }
            }
            return canvas
          }),
        }
      }
      return prev
    })
  }

  // Добавление YAxis в chart
  const addYAxis = (canvasId: string, chartId: string, newYAxis: ChartYAxisOptions) => {
    setTemplate((prev) => {
      if (prev) {
        return {
          ...prev,
          canvases: prev.canvases?.map((canvas) => {
            if (canvas.id === canvasId) {
              return {
                ...canvas,
                charts: canvas.charts?.map((chart) => {
                  if (chart.id === chartId) {
                    return {
                      ...chart,
                      yAxes: [...(chart.yAxes || []), newYAxis],
                    }
                  }
                  return chart
                }),
              }
            }
            return canvas
          }),
        }
      }
      return prev
    })
  }

  // Обновление YAxis в chart
  const updateYAxis = (
    canvasId: string,
    chartId: string,
    yAxisId: string,
    updatedYAxis: ChartYAxisOptions
  ) => {
    setTemplate((prev) => {
      if (prev) {
        return {
          ...prev,
          canvases: prev.canvases?.map((canvas) => {
            if (canvas.id === canvasId) {
              return {
                ...canvas,
                charts: canvas.charts?.map((chart) => {
                  if (chart.id === chartId) {
                    return {
                      ...chart,
                      yAxes: chart.yAxes?.map((yAxis) =>
                        yAxis.id === yAxisId ? { ...yAxis, ...updatedYAxis } : yAxis
                      ),
                    }
                  }
                  return chart
                }),
              }
            }
            return canvas
          }),
        }
      }
      return prev
    })
  }

  // Удаление YAxis из chart
  const deleteYAxis = (canvasId: string, chartId: string, yAxisId: string) => {
    setTemplate((prev) => {
      if (prev) {
        return {
          ...prev,
          canvases: prev.canvases?.map((canvas) => {
            if (canvas.id === canvasId) {
              return {
                ...canvas,
                charts: canvas.charts?.map((chart) => {
                  if (chart.id === chartId) {
                    // Фильтруем оси Y внутри нужного графика
                    const updatedYAxes = chart.yAxes?.filter((yAxis) => yAxis.id !== yAxisId)
                    return {
                      ...chart,
                      yAxes: updatedYAxes || [], // Если yAxes пустое, возвращаем пустой массив
                    }
                  }
                  return chart
                }),
              }
            }
            return canvas
          }),
        }
      }
      return prev
    })
  }

  return (
    <TemplateContext.Provider
      value={{
        template,
        setTemplate,
        updateTemplate,
        addCanvas,
        updateCanvas,
        deleteCanvas,
        selectedCanvas,
        setSelectedCanvas,
        addChart,
        updateChart,
        deleteChart,
        selectedChart,
        setSelectedChart,
        addMeasurement,
        editMeasurement,
        deleteMeasurement,
        addYAxis,
        updateYAxis,
        deleteYAxis,
        getCurrentCanvas: () => template?.canvases?.find((c) => c.id === selectedCanvas?.id),
        getCurrentChart: () => {
          const canvas = template?.canvases?.find((c) => c.id === selectedCanvas?.id)
          return canvas?.charts?.find((chart) => chart.id === selectedChart?.id)
        },
      }}
    >
      {children}
    </TemplateContext.Provider>
  )
}
