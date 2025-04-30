import { Save } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/shared/ui/button'
import { useTemplate } from '@/contexts/template/hook'
import { usePatchSaveTemplateMutataion } from '@/api/hooks/templates'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/constants/queryKeys'

export function UpdateTemplate() {
  const { template } = useTemplate()

  const queryClient = useQueryClient()

  const patchSaveTemplateMutation = usePatchSaveTemplateMutataion({
    options: {
      onSuccess: () => {
        toast.success('You have saved the template 👍')
      },
      onError: () => {
        toast.error('Failed to save the template')
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.GET_TEMPLATE_BY_ID, template?.id] })
        queryClient.invalidateQueries({ queryKey: [queryKeys.GET_TEMPLATES] })
      },
    },
  })

  const handleSaveTemplate = async () => {
    if (!template) {
      toast.error('Template is not defined')
      return
    }

    await patchSaveTemplateMutation.mutateAsync({
      params: {
        templateId: template.id,
        data: {
          name: template.name,
          description: template.description,
          canvases: template.canvases,
        },
      },
    })
  }

  return (
    <Button size='sm' onClick={handleSaveTemplate}>
      <Save />
      Save
    </Button>
  )
}
