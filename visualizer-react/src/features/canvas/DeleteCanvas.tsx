import { Trash } from 'lucide-react'

import type { Canvas } from '@/models/canvas'

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
import { useTemplate } from '@/contexts/template/hook'

type DeleteCanvasDialogBtnProps = {
  canvasId: Canvas['id']
}

export function DeleteCanvasDialogBtn({ canvasId }: DeleteCanvasDialogBtnProps) {
  const { deleteCanvas, setSelectedCanvas } = useTemplate()

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            title='Delete canvas'
            size='icon'
            className='w-6 h-6'
            variant='ghost'
            onClick={(e) => e.stopPropagation()}
          >
            <Trash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete canvas with all it charts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation()
                deleteCanvas(canvasId)
                setSelectedCanvas(null)
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
