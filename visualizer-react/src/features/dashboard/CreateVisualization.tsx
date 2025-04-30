import type { ReactNode } from 'react'

import { Plus } from 'lucide-react'

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
import { useUser } from '@/contexts/user/hook'
import { usePostDashboardMutation } from '@/api/hooks/dashboards'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/constants/queryKeys'

export function CreateVisualizationDialogBtn({ target }: { target?: ReactNode }) {
  const { user } = useUser()

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const postDashboardMutation = usePostDashboardMutation({
    options: {
      onSuccess: (data) => {
        if (data.status === 201 || data.status === 200) {
          toast.success('You have created a dashboard 👍')
          navigate(`/dashboards/${data.data.data}`)
        }
      },
      onError: () => {
        toast.error('Failed to create a dashboard')
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.GET_DASHBOARDS] })
      },
    },
  })

  const handlePostDashboard = async () => {
    if (!user) {
      toast.error('User is not defined')
      return
    }

    await postDashboardMutation.mutateAsync({
      params: {
        name: 'Untitled  dashboard',
        userId: user.id,
      },
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {target || (
          <Button className='w-full h-40 cursor-pointer' variant='outline' asChild>
            <div className='flex flex-col'>
              <Plus />
              Create a Blank Dashboard
            </div>
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Want to continue?</AlertDialogTitle>
          <AlertDialogDescription>
            You are going to create a dashboard. Confirm the action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handlePostDashboard}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
