import { toast } from 'sonner'

import type { Canvas } from '@/models/canvas'

import { GenericList } from '@/components/GenericList'
import { Button } from '@/shared/ui/button'
import { useDashboard } from '@/contexts/dashboard/hook'
import { useGetTemplatesQuery } from '@/api/hooks/templates'

export function SelectTemplate() {
  const { data: templates } = useGetTemplatesQuery({ canvases: true })
  const { selectTemplate } = useDashboard()

  const handleSelectTemplate = (templateId: string, canvases: Canvas[] | undefined) => {
    if (!canvases || canvases.length === 0) {
      toast.error('Selected template is empty. Select another one.')
      return
    }
    selectTemplate({
      templateId,
      canvases,
    })
    toast.success('Template selected successfully')
  }

  return (
    <>
      {templates?.data.data && (
        <GenericList
          className='flex-row gap-2'
          data={templates.data.data}
          getKey={(item) => item.id}
          renderItem={(item) => (
            <Button
              className='justify-start w-max'
              variant='outline'
              size='sm'
              onClick={() => handleSelectTemplate(item.id, item.canvases)}
            >
              {item.name}
            </Button>
          )}
        />
      )}
    </>
  )
}
