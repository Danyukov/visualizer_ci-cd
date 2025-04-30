import type { Dispatch, ReactNode, SetStateAction } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { MoreHorizontal, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import type { Chart, ChartYAxisOptions } from '@/models/chart'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Switch } from '@/shared/ui/switch'
import { useTemplate } from '@/contexts/template/hook'

type YAxisSettingsDialogBtnProps = {
  chartInstance: Chart
  target?: ReactNode
  yAxis?: ChartYAxisOptions
  className?: string
}

export function YAxesSettingsDialogBtn({
  chartInstance,
  target,
  yAxis,
  className,
}: YAxisSettingsDialogBtnProps) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {target ??
          (yAxis ? (
            <Button
              className={cn('opacity-0 w-6 h-6 group-hover:opacity-100')}
              size='icon'
              variant='ghost'
            >
              <MoreHorizontal />
            </Button>
          ) : (
            <Button size='icon' className={cn('w-6 h-6', className)} variant='ghost'>
              <Plus />
            </Button>
          ))}
      </DialogTrigger>
      <DialogContent className='flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-4xl [&>button:last-child]:top-3.5'>
        <DialogHeader className='contents space-y-0 text-left'>
          <DialogTitle className='border-b px-6 py-4 text-base'>Y Axis settings</DialogTitle>
          <div className='overflow-y-auto'>
            <div className='p-5'>
              <YAxisSettingsForm chartInstance={chartInstance} setOpen={setOpen} yAxis={yAxis} />
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

const yAxisFormSchema = z.object({
  title: z.string(),
  opposite: z.boolean().default(false),
})

type YAxisFormSchemaType = z.infer<typeof yAxisFormSchema>

type YAxisSettingsFormProps = {
  chartInstance: Chart
  setOpen: Dispatch<SetStateAction<boolean>>
  yAxis?: ChartYAxisOptions
}

function YAxisSettingsForm({ chartInstance, setOpen, yAxis }: YAxisSettingsFormProps) {
  const form = useForm<YAxisFormSchemaType>({
    resolver: zodResolver(yAxisFormSchema),
    defaultValues: yAxis
      ? {
          title: yAxis.title?.text || '',
          opposite: yAxis.opposite,
        }
      : undefined,
  })

  const { selectedCanvas, addYAxis, updateYAxis } = useTemplate()

  function onSubmit(values: YAxisFormSchemaType) {
    if (!values || !selectedCanvas) return

    if (yAxis) {
      updateYAxis(selectedCanvas.id, chartInstance.id, yAxis.id!, {
        title: { text: values.title },
        opposite: values.opposite,
      })
    } else {
      addYAxis(selectedCanvas.id, chartInstance.id, {
        id: uuid(),
        title: { text: values.title },
        opposite: values.opposite,
      })
    }
    setOpen(false)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='space-y-0'>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='Enter y axis title' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='opposite'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                <div className='space-y-0.5'>
                  <FormLabel>Opposite</FormLabel>
                  <FormDescription>Turn on to </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(v) => {
                      field.onChange(v)
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className='flex gap-2 justify-end'>
            <Button type='button' variant='ghost' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type='submit'>Save</Button>
          </div>
        </form>
      </Form>
    </>
  )
}
