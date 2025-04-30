import { useEffect } from 'react'
import { useParams } from 'react-router'
import { toast } from 'sonner'

import type { Template } from '@/models/template'

import { TemplateEditorPageCanvasList } from './ui/CanvasList'
import { TemplateEditorPageSidebar } from './ui/Sidebar'
import { TemplateEditorPageTopbar } from './ui/Topbar'
import { useTemplate } from '@/contexts/template/hook'
import { useGetTemplateByIdQuery } from '@/api/hooks/templates'

export default function TemplateEditPage() {
  const { templateId } = useParams<{ templateId: Template['id'] }>()

  const { data, error } = useGetTemplateByIdQuery(
    {
      templateId: templateId!,
    },
    {
      options: {
        enabled: Boolean(templateId),
      },
    }
  )

  const { setTemplate } = useTemplate()

  useEffect(() => {
    if (data?.data.data) {
      setTemplate(data.data.data)
    }
  }, [data, setTemplate])

  useEffect(() => {
    if (error) {
      toast.error('Failed to fetch template')
    }
  }, [error])

  return (
    <>
      <div className='grid grid-cols-[minmax(0,400px)_minmax(0,1fr)] flex-1 w-full h-full'>
        <TemplateEditorPageSidebar />
        <div className='h-full'>
          <TemplateEditorPageTopbar />
          <TemplateEditorPageCanvasList />
        </div>
      </div>
    </>
  )
}
