import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import type { Dashboard } from '@/models/dashboard'

import { CanvasElement } from '@/components/canvas/Canvas'
import { GenericList } from '@/components/GenericList'
import { SelectTemplate } from '@/features/SelectTemplate'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

import { DashboardSidebar } from './ui/Sidebar'
import { VisualizationEditorPageTopbar } from './ui/Topbar'
import { useDashboard } from '@/contexts/dashboard/hook'
import { useGetDashboardByIdQuery } from '@/api/hooks/dashboards'

export default function DashboardEditPage() {
  const { dashboardId } = useParams<{ dashboardId: Dashboard['id'] }>()

  const { data, error } = useGetDashboardByIdQuery(
    {
      dashboardId: dashboardId!,
    },
    {
      options: {
        enabled: Boolean(dashboardId),
      },
    }
  )

  const { dashboard, setDashboard } = useDashboard()
  const navigate = useNavigate()

  useEffect(() => {
    if (data?.data.data) {
      setDashboard(data.data.data)
    }
  }, [data, setDashboard])

  useEffect(() => {
    if (error) {
      toast.error('Failed to fetch template')
      navigate('/dashboards')
    }
  }, [error, navigate])

  if (!dashboard) {
    return null
  }

  return (
    <div className='grid grid-cols-[minmax(0,400px)_minmax(0,1fr)] flex-1 w-full min-h-screen'>
      <DashboardSidebar dashboard={dashboard} />
      <div className='flex flex-col'>
        <VisualizationEditorPageTopbar />
        <div className='flex flex-1 flex-col gap-1 p-5'>
          {!(dashboard?.templateId && dashboard?.canvases) && <EmptyVisualization />}
          {dashboard?.canvases && (
            <GenericList
              data={dashboard?.canvases}
              getKey={(item) => item.id}
              renderItem={(item) => <CanvasElement.previewComponent canvas={item} />}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyVisualization() {
  return (
    <Card className='w-full h-full border-dashed overflow-hidden relative'>
      <CardHeader>
        <CardTitle>Empty dashboard</CardTitle>
        <CardDescription>
          Start configuring your dashboard using one of the templates below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SelectTemplate />
      </CardContent>
    </Card>
  )
}
