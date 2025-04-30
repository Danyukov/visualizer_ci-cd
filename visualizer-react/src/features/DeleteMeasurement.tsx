import { Trash } from 'lucide-react'

import type { Canvas } from '@/models/canvas'
import type { Chart, ChartMeasurement } from '@/models/chart'

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

type DeleteMeasurementDialogBtnProps = {
  canvasId: Canvas['id']
  chartId: Chart['id']
  measurementId: ChartMeasurement['id']
}

export function DeleteMeasurementDialogBtn({
  canvasId,
  chartId,
  measurementId,
}: DeleteMeasurementDialogBtnProps) {
  const { deleteMeasurement } = useTemplate()
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            title='Delete measurement'
            size='icon'
            className='w-6 h-6 opacity-0 transition-all group-hover:opacity-100'
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
              This action cannot be undone. This will permanently measurement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation()
                deleteMeasurement(canvasId, chartId, measurementId)
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
