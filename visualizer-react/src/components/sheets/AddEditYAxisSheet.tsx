import type { ReactNode } from 'react'

import { MoreHorizontalIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet'

import { AddEditYAxisForm } from '../forms/AddEditYAxisForm'

type AddEditYAxisProps = {
  target?: ReactNode
  yAxis?: Highcharts.YAxisOptions
  className?: string
}

export function AddEditYAxis({ target, yAxis, className }: AddEditYAxisProps) {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {target ?? (
          <Button size="icon" className={cn('w-6 h-6', className)} variant="ghost">
            {yAxis ? <MoreHorizontalIcon /> : <PlusIcon />}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[40rem] sm:max-w-[40rem]">
        <SheetHeader>
          <SheetTitle>Y Axis settings</SheetTitle>
          <SheetDescription>Enter name and pick side</SheetDescription>
        </SheetHeader>
        <AddEditYAxisForm setOpen={setOpen} yAxis={yAxis} />
      </SheetContent>
    </Sheet>
  )
}
