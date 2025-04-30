import { Plus } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { useTemplate } from '@/contexts/template/hook'

export function AddCanvasBtn() {
  const { addCanvas } = useTemplate()
  return (
    <>
      <Button size='icon' className='w-6 h-6' variant='ghost' onClick={addCanvas}>
        <Plus />
      </Button>
    </>
  )
}
