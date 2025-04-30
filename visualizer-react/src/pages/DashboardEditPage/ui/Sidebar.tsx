import { useCallback } from 'react'
import { toast } from 'sonner'
import { v4 as uuid } from 'uuid'

import type { Canvas } from '@/models/canvas'
import type { Chart, ChartMeasurement } from '@/models/chart'
import type { Dashboard } from '@/models/dashboard'

import { CanvasTreeList } from '@/components/canvas/CanvasTreeList'
import { useDashboard } from '@/contexts/dashboard/hook'

type DashboardSidebarProps = {
  dashboard: Dashboard
}

export function DashboardSidebar({ dashboard }: DashboardSidebarProps) {
  const { editMeasurement } = useDashboard()

  const handleEditChartMeasurement = useCallback(
    (
      values: Partial<ChartMeasurement>,
      canvasId?: Canvas['id'],
      chartId?: Chart['id'],
      measurementId?: ChartMeasurement['id']
    ) => {
      if (!canvasId || !chartId || !measurementId) {
        toast.error('Canvas, chart or measurement is not defined')
        return
      }

      if (!values.connection || !values.series) {
        toast.error('Measurement is not defined')
        return
      }

      editMeasurement(canvasId, chartId, measurementId, {
        id: uuid(),
        chartId,
        connection: {
          projectId: values.connection.projectId,
          projectName: values.connection.projectName,
          plantId: values.connection.plantId,
          plantName: values.connection.plantName,
          assetId: values.connection.assetId,
          assetName: values.connection.assetName,
          measurementId: values.connection.measurementId,
          measurementName: values.connection.measurementName,
          measurementVersionId: values.connection.measurementVersionId,
          measurementVersionName: values.connection.measurementVersionName,
        },
        series: {
          name: values.series.name,
          type: values.series.type as 'line' | 'column' | 'area',
          dash: values.series.dash,
          step: values.series.step,
          // TODO: fix yAxisId
          yAxisId: 'values.series.yAxisId',
        },
      })
    },
    [editMeasurement]
  )

  return (
    <aside className='relative border-r min-h-[calc(100vh)] flex-grow flex-shrink h-full p-5 bg-white shadow-sm'>
      <div className='sticky top-5'>
        <CanvasTreeList
          canvases={dashboard.canvases}
          onMeasurementUpdate={handleEditChartMeasurement}
        />
      </div>
    </aside>
  )
}
