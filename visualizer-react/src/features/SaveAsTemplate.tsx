import type { ReactNode } from 'react'

import { SaveIcon } from 'lucide-react'
import { useState } from 'react'

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
import { Label } from '@/shared/ui/label'
import { Switch } from '@/shared/ui/switch'
import { usePostSaveAsTemplateMutataion } from '@/api/hooks/templates'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/constants/queryKeys'
import { toast } from 'sonner'
import { useUser } from '@/contexts/user/hook'
import { useAnalysis } from '@/contexts/analysis/hook'

export function SaveAsTemplateDialogBtn({ target }: { target?: ReactNode }) {
  const [withDashboard, setWithDashboard] = useState(false)

  const { user } = useUser()
  const { canvases, reset } = useAnalysis()

  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const postSaveAsTemplateMutataion = usePostSaveAsTemplateMutataion({
    options: {
      onSuccess: (data) => {
        toast.success('You have saved as the template')

        let templateId: string | undefined

        if ('createTemplateResponse' in data) {
          templateId = data.createTemplateResponse.data.data
        } else {
          templateId = data.data.data
        }
        reset()
        navigate(`/templates/${templateId}`)
      },
      onError: () => {
        toast.error('Failed to save as the template')
      },
      onSettled: (_, __, { params: { withDashboard } }) => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.GET_TEMPLATES] })

        if (withDashboard) {
          queryClient.invalidateQueries({ queryKey: [queryKeys.GET_DASHBOARDS] })
        }
      },
    },
  })

  const handleSaveAsTemplate = async () => {
    if (!canvases.length) {
      toast.error('Create at least one canvas')
      return
    }

    if (!user) {
      toast.error('User is not defined')
      return
    }

    await postSaveAsTemplateMutataion.mutateAsync({
      params: {
        name: 'Untitled',
        canvases: canvases,
        withDashboard,
        userId: user?.id,
      },
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {target || (
          <Button size='sm'>
            <SaveIcon />
            Save as
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Choose an action</AlertDialogTitle>
          <AlertDialogDescription>
            You are going to create a dashboard template. Confirm the action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className='flex items-center space-x-2'>
          <Switch checked={withDashboard} onCheckedChange={setWithDashboard} id='withDashboard' />
          <Label htmlFor='withDashboard'>Save as template and dashboard</Label>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSaveAsTemplate}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
