import { Trash } from 'lucide-react'
import { useState } from 'react'

import type { Canvas } from '@/models/canvas'
import type { Chart } from '@/models/chart'

import { cn } from '@/shared/lib/utils'
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

type DeleteChartDialogBtnProps = {
  canvasId: Canvas['id'] | undefined
  chartId: Chart['id']
  className?: string
}

export function DeleteChartDialogBtn({ canvasId, chartId, className }: DeleteChartDialogBtnProps) {
  const [open, setOpen] = useState(false)
  const { deleteChart } = useTemplate()

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            title='Delete chart'
            className={cn('w-6 h-6 opacity-0 transition-all group-hover:opacity-100', className)}
            size='icon'
            variant='ghost'
            disabled={!canvasId || !chartId}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Trash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete chart with it configuration
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!canvasId || !chartId}
              onClick={(e) => {
                e.stopPropagation()
                deleteChart(canvasId!, chartId)
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
