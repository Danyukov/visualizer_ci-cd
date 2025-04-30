import { BackButton } from '@/components/BackButton'
import { UpdateTemplate } from '@/features/UpdateTemplate'
import { ViewJsonDialogBtn } from '@/features/ViewJson'
import { Badge } from '@/shared/ui/badge'

import { useTemplate } from '@/contexts/template/hook'

export function TemplateEditorPageTopbar() {
  const { template } = useTemplate()

  return (
    <header className='flex justify-between items-center gap-4 border-b px-5 py-3'>
      <div className='flex items-center gap-8'>
        <BackButton />
        <Badge variant='secondary'>{template?.name}</Badge>
      </div>
      <div className='flex gap-2'>
        <ViewJsonDialogBtn />
        <UpdateTemplate />
      </div>
    </header>
  )
}
