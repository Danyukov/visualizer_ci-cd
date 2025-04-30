import { X } from 'lucide-react'

import { CanvasElement } from '@/components/canvas/Canvas'
import { ChartPropertiesWrapper } from '@/components/chart/ChartElementWrappers'
import { ChartVariantList } from '@/components/chart/ChartVariantList'
import { TemplatePropertiesForm } from '@/components/forms/TemplatePropertiesForm'
import { AddCanvasBtn } from '@/features/canvas/AddCanvas'
import { DeleteCanvasDialogBtn } from '@/features/canvas/DeleteCanvas'
import { DeleteChartDialogBtn } from '@/features/DeleteChart'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { Separator } from '@/shared/ui/separator'
import { useTemplate } from '@/contexts/template/hook'
import { useGetDashboardsByTemplateIdQuery } from '@/api/hooks/dashboards'

function CanvasProperties() {
  const { getCurrentCanvas, setSelectedCanvas, addChart } = useTemplate()

  const canvas = getCurrentCanvas()

  if (!canvas) return null

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <p className='text-muted-foreground text-sm'>Canvas properties</p>
        <Button
          className='w-6 h-6'
          variant='ghost'
          size='icon'
          onClick={() => setSelectedCanvas(null)}
        >
          <X />
        </Button>
      </div>
      <CanvasElement.propertiesComponent canvas={canvas} />
      <Separator className='h-[1px] my-1' />
      <ChartVariantList selectedCanvasId={canvas.id} onChartAdd={addChart} />
    </div>
  )
}

function ChartProperties() {
  const { getCurrentCanvas, getCurrentChart, setSelectedChart } = useTemplate()

  const canvas = getCurrentCanvas()
  const chart = getCurrentChart()

  if (!canvas || !chart) return null

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <p className='text-muted-foreground text-sm'>Chart properties</p>
        <Button
          className='w-6 h-6'
          variant='ghost'
          size='icon'
          onClick={() => setSelectedChart(null)}
        >
          <X />
        </Button>
      </div>
      <ChartPropertiesWrapper canvasInstance={canvas} chartInstance={chart} />
    </div>
  )
}

export function EditorPropertiesSidebar() {
  const { template, getCurrentCanvas, getCurrentChart } = useTemplate()

  if (!template) return null

  const canvas = getCurrentCanvas()
  const chart = getCurrentChart()

  if (!canvas && !chart) return null

  if (canvas && !chart) {
    return <CanvasProperties />
  }

  if (canvas && chart) {
    return <ChartProperties />
  }
}

export function EditorDefaultSidebar() {
  return (
    <>
      <p className='text-muted-foreground text-sm'>Template properties</p>
      <div className='flex flex-col gap-4 mt-4'>
        <TemplatePropertiesForm />
        <CanvasList />
        <DashboardList />
      </div>
    </>
  )
}

function CanvasList() {
  const { template, setSelectedCanvas, setSelectedChart } = useTemplate()

  return (
    <>
      <div>
        <div className='flex items-center justify-between'>
          <Label>Canvases</Label>
          <AddCanvasBtn />
        </div>
        <div className='flex flex-col gap-1'>
          <ScrollArea className='h-[300px] pr-1'>
            {template?.canvases?.map((item) => (
              <div key={item.id}>
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedCanvas(item)
                  }}
                  className='group transition-all flex items-center justify-between py-1 px-3 text-muted-foreground text-sm rounded-sm hover:bg-muted/50 hover:cursor-pointer'
                >
                  {item.name ?? 'Untitled canvas'}
                  <DeleteCanvasDialogBtn canvasId={item.id} />
                </div>
                <div className='px-3'>
                  {item.charts?.map((chart) => (
                    <div
                      className='group transition-all flex items-center justify-between py-1 px-3 text-muted-foreground text-sm rounded-sm hover:bg-muted/50 hover:cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedCanvas(item)
                        setSelectedChart(chart)
                      }}
                      key={chart.id}
                    >
                      <div className='text-muted-foreground text-sm'>
                        {chart.name ?? 'Untitled chart'}
                      </div>
                      <DeleteChartDialogBtn canvasId={item.id} chartId={chart.id} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </>
  )
}

function DashboardList() {
  const { template } = useTemplate()

  const { data } = useGetDashboardsByTemplateIdQuery(
    {
      templateId: template?.id!,
    },
    {
      options: {
        enabled: Boolean(template?.id),
      },
    }
  )

  if (!data) {
    return null
  }

  return (
    <div>
      <div className='flex items-center justify-between'>
        <Label>Dashboards builded on this template</Label>
      </div>
      <div className='flex flex-col gap-1 mt-1'>
        <ScrollArea className='h-[200px] pr-1'>
          {data?.data.data?.map((item) => (
            <div key={item.id}>
              <div className='group transition-all flex items-center justify-between py-1 px-3 text-muted-foreground text-sm rounded-sm hover:bg-muted/50 hover:cursor-pointer'>
                {item.name}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}

export function TemplateEditorPageSidebar() {
  const { selectedCanvas, selectedChart } = useTemplate()

  return (
    <aside className='relative border-r min-h-[calc(100vh)] flex-grow flex-shrink h-full p-5 bg-white shadow-sm'>
      <div className='sticky top-5'>
        {!selectedCanvas && !selectedChart && <EditorDefaultSidebar />}
        {(selectedCanvas || selectedChart) && <EditorPropertiesSidebar />}
      </div>
    </aside>
  )
}
