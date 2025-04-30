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
import { Trash } from 'lucide-react'
import { ReactNode } from 'react'

interface DeleteAlertDialogProps {
  target?: ReactNode
  dialogTitle?: string
  dialogDescription?: string
  tooltipText?: string
  className?: string
}

export const DeleteAlertDialog = (props: DeleteAlertDialogProps) => {
  const { target, dialogTitle, dialogDescription, tooltipText, className } = props

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {target ?? (
          <Button
            title={tooltipText}
            className={cn('w-6 h-6 opacity-0 transition-all group-hover:opacity-100', className)}
            size='icon'
            variant='ghost'
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Trash />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle ?? 'Are you absolutely sure?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialogDescription ?? 'This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
