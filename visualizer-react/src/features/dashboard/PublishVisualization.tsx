import { CloudUpload } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog'
import { Button } from '@/shared/ui/button'
import { useDashboard } from '@/contexts/dashboard/hook'
import { usePatchEditDashboardMutation } from '@/api/hooks/dashboards'
import { queryKeys } from '@/shared/constants/queryKeys'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function PublishVisualization() {
  const { dashboard } = useDashboard()

  const publishText = 'You will be able to unpublish this visualization at any time'
  const unpublishText = 'You will be able to republish this visualization at any time'

  const queryClient = useQueryClient()

  const patchEditDashboardMutation = usePatchEditDashboardMutation({
    options: {
      onSuccess: () => {
        toast.success('You have published the dashboard 👍', {})
      },
      onError: () => {
        toast.error('Failed to publish the dashboard', {})
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.GET_DASHBOARD_BY_ID, dashboard?.id] })
        queryClient.invalidateQueries({ queryKey: [queryKeys.GET_DASHBOARDS] })
      },
    },
  })

  const handleClick = async () => {
    if (!dashboard) return

    if (!dashboard.published) {
      await patchEditDashboardMutation.mutateAsync({
        params: {
          dashboardId: dashboard.id,
          data: {
            published: true,
          },
        },
      })
    } else {
      await patchEditDashboardMutation.mutateAsync({
        params: {
          dashboardId: dashboard.id,
          data: {
            published: false,
          },
        },
      })
    }
  }

  if (!dashboard) return null

  const canPublish = !!dashboard?.templateId && dashboard.saved

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button disabled={!canPublish}>
            <CloudUpload />
            {dashboard?.published ? 'Unpublish' : 'Publish'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {dashboard?.published ? unpublishText : publishText}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => await handleClick()}>
              {dashboard?.published ? 'Unpublish' : 'Publish'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
