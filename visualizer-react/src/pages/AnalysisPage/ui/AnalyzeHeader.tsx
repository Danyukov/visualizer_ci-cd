import { SaveAsTemplateDialogBtn } from '@/features/SaveAsTemplate'
import { Button } from '@/shared/ui/button'

import { useAnalysis } from '@/contexts/analysis/hook'

export function AnalyzeHeader() {
  const { reset } = useAnalysis()

  return (
    <header className='flex items-center justify-end gap-2 px-5 py-3 border-b'>
      <Button variant='outline' size='sm' onClick={reset}>
        Reset
      </Button>
      <SaveAsTemplateDialogBtn />
    </header>
  )
}
