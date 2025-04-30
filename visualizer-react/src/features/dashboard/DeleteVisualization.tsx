import type { ReactNode } from 'react'

import { Trash } from 'lucide-react'

import type { Dashboard } from '@/models/dashboard'

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
import { useDeleteDashboardMutation } from '@/api/hooks/dashboards'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/constants/queryKeys'
import { toast } from 'sonner'

type DeleteVisualizationDialogBtnProps = {
  visualizationId: Dashboard['id']
  target?: ReactNode
  onSuccess?: () => void
}

export function DeleteVisualizationDialogBtn({
  visualizationId,
  target,
  onSuccess,
}: DeleteVisualizationDialogBtnProps) {
  const queryClient = useQueryClient()

  const deleteDashboardMutation = useDeleteDashboardMutation({
    options: {
      onSuccess: () => {
        toast.success('You have deleted the dashboard 👍', {})
        if (typeof onSuccess === 'function') {
          onSuccess()
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.GET_DASHBOARDS] })
      },
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {target || (
          <Button
            title='Delete visualization'
            size='icon'
            className='w-6 h-6'
            variant='ghost'
            onClick={(e) => e.stopPropagation()}
          >
            <Trash />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently visualization.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation()
              deleteDashboardMutation.mutateAsync({
                params: {
                  dashboardId: visualizationId,
                },
              })
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
