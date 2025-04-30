import { FileJson } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { useTemplate } from '@/contexts/template/hook'

export function ViewJsonDialogBtn() {
  const { template } = useTemplate()

  if (template === undefined) return

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <FileJson />
          View JSON
        </Button>
      </DialogTrigger>
      <DialogContent className='flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5'>
        <DialogHeader className='contents space-y-0 text-left'>
          <DialogTitle className='border-b border-border px-6 py-4 text-base'>
            Template configuration
          </DialogTitle>
          <div className='overflow-y-auto'>
            <DialogDescription asChild>
              <div className='p-5'>
                <pre>{JSON.stringify(template, null, 2)}</pre>
              </div>
            </DialogDescription>
            <DialogFooter className='px-6 pb-6'>
              <DialogClose asChild>
                <Button type='button'>Close</Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
