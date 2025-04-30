import { toast } from 'sonner'
import { v4 as uuid } from 'uuid'

import type { Chart, ChartMeasurement } from '@/models/chart'

import { DeleteMeasurementDialogBtn } from '@/features/DeleteMeasurement'
import { GenericAddEditChartMeasurementSheetBtn } from '@/features/measurement/GenericAddEditChartMeasurement'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { Canvas } from '@/models/canvas'
import { useTemplate } from '@/contexts/template/hook'

export function ChartMeasurementList({ canvas, chart }: { canvas: Canvas; chart: Chart }) {
  const { addMeasurement, editMeasurement } = useTemplate()

  const handleAddChartMeasurement = (
    values: Partial<ChartMeasurement>,
    canvasId: Canvas['id'],
    chartId: Chart['id']
  ) => {
    if (!values.connection || !values.series) {
      return
    }

    addMeasurement(canvasId, chartId, {
      id: uuid(),
      chartId: chartId,
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
        yAxisId: 'values.series.yAxisId', // TODO: fix yAxisId
      },
    })
  }

  const handleEditChartMeasurement = (
    values: Partial<ChartMeasurement>,
    canvasId: Canvas['id'],
    chartId: Chart['id'],
    measurementId?: ChartMeasurement['id']
  ) => {
    if (!measurementId) {
      toast.error('Measurement Id is not defined')
      return
    }

    if (!values.connection || !values.series) {
      return
    }

    editMeasurement(canvasId, chartId, measurementId, {
      id: uuid(),
      chartId: chartId,
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
        yAxisId: 'values.series.yAxisId', // TODO: fix yAxisId
      },
    })
  }

  return (
    <>
      <div className='flex justify-between items-center'>
        <p className='text-muted-foreground text-sm'>Measurements</p>
        <GenericAddEditChartMeasurementSheetBtn
          canvasId={canvas.id}
          chartId={chart.id}
          onAdd={handleAddChartMeasurement}
        />
      </div>
      <div>
        <ScrollArea className='h-[240px] pr-1'>
          {chart.measurements?.map((item) => (
            <div
              className='group transition-all flex items-center justify-between py-1 px-3 text-muted-foreground text-sm rounded-sm hover:bg-muted/50 hover:cursor-pointer'
              key={item.id}
            >
              {item.connection.measurementVersionName}
              <div>
                <GenericAddEditChartMeasurementSheetBtn
                  canvasId={canvas.id}
                  chartId={chart.id}
                  measurement={item}
                  onEdit={handleEditChartMeasurement}
                  className='opacity-0 transition-all group-hover:opacity-100'
                />
                <DeleteMeasurementDialogBtn
                  canvasId={canvas.id}
                  chartId={chart.id}
                  measurementId={item.id}
                />
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </>
  )
}
