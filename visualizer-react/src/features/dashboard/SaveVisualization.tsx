import { Save } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { useDashboard } from '@/contexts/dashboard/hook'
import { usePatchEditDashboardMutation } from '@/api/hooks/dashboards'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/constants/queryKeys'

export function SaveVisualization() {
  const { dashboard } = useDashboard()

  const queryClient = useQueryClient()

  const patchEditDashboardMutation = usePatchEditDashboardMutation({
    options: {
      onSuccess: () => {
        toast.success('You have saved the dashboard 👍', {})
      },
      onError: () => {
        toast.error('Failed to save the dashboard', {})
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.GET_DASHBOARD_BY_ID, dashboard?.id] })
        queryClient.invalidateQueries({ queryKey: [queryKeys.GET_DASHBOARDS] })
      },
    },
  })

  const handleSave = async () => {
    if (!dashboard) return

    await patchEditDashboardMutation.mutateAsync({
      params: {
        dashboardId: dashboard.id,
        data: {
          name: dashboard.name,
          description: dashboard.description,
          client: dashboard.client,
          canvases: dashboard.canvases,
          templateId: dashboard.templateId,
        },
      },
    })
  }

  return (
    <Button onClick={handleSave} variant='outline'>
      <Save />
      Save
    </Button>
  )
}
