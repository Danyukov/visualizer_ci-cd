import type { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { XIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { v4 as uuid } from 'uuid'

import type { Chart, ChartMeasurement } from '@/models/chart'

import { GenericAddEditChartMeasurementSheetBtn } from '@/features/measurement/GenericAddEditChartMeasurement'
import { chartSchema } from '@/models/chart'
import { Button } from '@/shared/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { Separator } from '@/shared/ui/separator'

import { useAnalysis } from '@/contexts/analysis/hook'
import { Canvas } from '@/models/canvas'
import { CanvasTreeList } from '@/components/canvas/CanvasTreeList'
import { ChartVariantList } from '@/components/chart/ChartVariantList'
import { ChartElementsType } from '@/components/chart/ChartElements'

interface SidebarCanvasPropertiesProps {
  selectedCanvas: Canvas | undefined
  onCanvasSelect: React.Dispatch<React.SetStateAction<string | null>>
  onChartAdd: (canvasId: string, chartType: ChartElementsType) => void
}

function SidebarCanvasProperties(props: SidebarCanvasPropertiesProps) {
  const { onCanvasSelect, selectedCanvas, onChartAdd } = props

  if (!selectedCanvas) {
    return null
  }

  return (
    <div>
      <div className='flex gap-2 justify-between items-center'>
        <Label>Canvas properties</Label>
        <Button
          className='w-6 h-6'
          variant='ghost'
          size='icon'
          onClick={() => onCanvasSelect(null)}
        >
          <XIcon />
        </Button>
      </div>
      <Separator className='my-3' />
      <ChartVariantList onChartAdd={onChartAdd} selectedCanvasId={selectedCanvas.id} />
    </div>
  )
}

interface SidebarChartMeasurementListProps {
  selectedCanvas: Canvas
  selectedChart: Chart
  onMesaurementAdd: (
    measurement: ChartMeasurement,
    canvasId: Canvas['id'],
    chartId: Chart['id']
  ) => void
  onMeasurementUpdate: (
    updatedMeasurement: Partial<ChartMeasurement>,
    canvasId: Canvas['id'],
    chartId: Chart['id'],
    measurementId: ChartMeasurement['id']
  ) => void
}

function SidebarChartMeasurementList(props: SidebarChartMeasurementListProps) {
  const { selectedCanvas, selectedChart, onMesaurementAdd, onMeasurementUpdate } = props

  const handleAddChartMeasurement = (
    values: Partial<ChartMeasurement>,
    canvasId: Canvas['id'],
    chartId: Chart['id']
  ) => {
    if (!selectedCanvas || !selectedChart) {
      toast.error('Select canvas or chart first')
      return
    }

    if (!values.connection || !values.series) {
      return
    }

    onMesaurementAdd(
      {
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
          // TODO: fix yAxisId
          yAxisId: 'values.series.yAxisId',
        },
      },
      canvasId,
      chartId
    )
  }

  if (!selectedCanvas || !selectedChart) return null

  return (
    <div>
      <div className='flex gap-2 justify-between items-center'>
        <Label>Measurements</Label>
        <GenericAddEditChartMeasurementSheetBtn
          canvasId={selectedCanvas.id}
          chartId={selectedChart.id}
          onAdd={handleAddChartMeasurement}
        />
      </div>
      <ScrollArea className='h-[320px] pr-1'>
        <div className='flex flex-col gap-1'>
          {selectedChart.measurements?.map((measurement) => (
            <div
              className='flex justify-between items-center gap-2 px-2 py-1 text-muted-foreground rounded-md hover:bg-zinc-50 hover:text-zinc-800 hover:cursor-pointer transition-all'
              key={measurement.id}
            >
              <div className='text-sm'>{measurement.connection.measurementVersionName}</div>
              <GenericAddEditChartMeasurementSheetBtn
                canvasId={selectedCanvas.id}
                chartId={selectedChart.id}
                measurement={measurement}
                onEdit={onMeasurementUpdate}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

// function SidebarChartYAxesList() {
//   const { selectedChart } = useAnalysis()

//   if (!selectedChart) return null
//   return (
//     <div>
//       <div className='flex gap-2 justify-between items-center'>
//         <Label>Y Axes</Label>
//         <YAxesSettingsSheetBtn />
//       </div>
//       <ScrollArea className='h-[100px] pr-1'>
//         <div>
//           {selectedChart.yAxes?.map((axis) => (
//             <div
//               key={axis.id}
//               className='group flex items-center justify-between hover:bg-muted rounded-md hover:cursor-pointer px-2 py-1'
//             >
//               <span className='text-sm'>{axis.title?.text ?? 'Measurement'}</span>

//               <div className='flex items-center gap-2'>
//                 <YAxesSettingsSheetBtn yAxis={axis} />
//               </div>
//             </div>
//           ))}
//         </div>
//       </ScrollArea>
//     </div>
//   )
// }

const propertiesSchema = chartSchema.pick({
  name: true,
})

type PropertiesSchemaType = z.infer<typeof propertiesSchema>

type SidebarChartPropertiesFormProps = {
  elementInstance: Chart
}

function SidebarChartPropertiesForm({ elementInstance }: SidebarChartPropertiesFormProps) {
  const form = useForm<PropertiesSchemaType>({
    resolver: zodResolver(propertiesSchema),
    defaultValues: {
      name: elementInstance.name,
    },
  })

  useEffect(() => {
    form.reset({
      name: elementInstance.name,
    })
  }, [elementInstance, form])

  const { selectedCanvasId, updateChart } = useAnalysis()

  function apply(values: PropertiesSchemaType) {
    if (!selectedCanvasId) return
    updateChart(selectedCanvasId, elementInstance.id, {
      ...elementInstance,
      name: values.name,
    })
  }

  return (
    <Form {...form}>
      <form onBlur={form.handleSubmit(apply)} className='flex flex-col gap-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-muted-foreground font-normal'>Name</FormLabel>
              <FormControl>
                <Input placeholder='Name' {...field} />
              </FormControl>
              <FormDescription>This is public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

interface SidebarChartPropertiesProps {
  selectedChart: Chart | undefined
  selectedCanvas: Canvas | undefined
  onMesaurementAdd: (
    measurement: ChartMeasurement,
    canvasId: Canvas['id'],
    chartId: Chart['id']
  ) => void
  onMeasurementUpdate: (
    updatedMeasurement: Partial<ChartMeasurement>,
    canvasId: Canvas['id'],
    chartId: Chart['id'],
    measurementId: ChartMeasurement['id']
  ) => void
  onChartSelect: React.Dispatch<React.SetStateAction<string | null>>
}

function SidebarChartProperties(props: SidebarChartPropertiesProps) {
  const { onChartSelect, selectedChart, selectedCanvas, onMesaurementAdd, onMeasurementUpdate } =
    props

  if (!selectedChart || !selectedCanvas) {
    return null
  }

  return (
    <div>
      <div className='flex gap-2 justify-between items-center'>
        <Label>Chart properties</Label>
        <Button className='w-6 h-6' variant='ghost' size='icon' onClick={() => onChartSelect(null)}>
          <XIcon />
        </Button>
      </div>
      <SidebarChartPropertiesForm elementInstance={selectedChart} />
      <Separator className='my-3' />
      <SidebarChartMeasurementList
        selectedCanvas={selectedCanvas}
        selectedChart={selectedChart}
        onMesaurementAdd={onMesaurementAdd}
        onMeasurementUpdate={onMeasurementUpdate}
      />
      {/* <Separator className='my-3' />
      <SidebarChartYAxesList /> */}
    </div>
  )
}

export function AnalyzeSidebar() {
  const {
    canvases,
    addCanvas,
    addChart,
    addMeasurement,
    updateMeasurement,
    setSelectedCanvasId,
    setSelectedChartId,
    selectedCanvasId,
    selectedChartId,
    selectedCanvas,
    selectedChart,
  } = useAnalysis()

  return (
    <aside className='border-r p-5'>
      <div className='sticky top-5'>
        {!selectedCanvasId && !selectedChartId && (
          <CanvasTreeList
            canvases={canvases}
            onCanvasAdd={addCanvas}
            onMeasurementUpdate={updateMeasurement}
            onSelectCanvas={setSelectedCanvasId}
            onSelectChart={setSelectedChartId}
          />
        )}
        {selectedCanvasId && !selectedChartId && (
          <SidebarCanvasProperties
            onCanvasSelect={setSelectedCanvasId}
            onChartAdd={addChart}
            selectedCanvas={selectedCanvas}
          />
        )}
        {selectedCanvasId && selectedChartId && (
          <SidebarChartProperties
            onChartSelect={setSelectedChartId}
            selectedChart={selectedChart}
            selectedCanvas={selectedCanvas}
            onMesaurementAdd={addMeasurement}
            onMeasurementUpdate={updateMeasurement}
          />
        )}
      </div>
    </aside>
  )
}
