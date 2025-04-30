import type { Dispatch, SetStateAction } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import { Button } from '@/shared/ui/button'
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
import { useAnalysis } from '@/contexts/analysis/hook'

const yAxisFormSchema = z.object({
  title: z.string(),
  opposite: z.boolean().default(false),
})

type YAxisFormSchemaType = z.infer<typeof yAxisFormSchema>

type AddEditYAxisFormProps = {
  setOpen: Dispatch<SetStateAction<boolean>>
  yAxis?: Highcharts.YAxisOptions
}

export function AddEditYAxisForm({ setOpen, yAxis }: AddEditYAxisFormProps) {
  const form = useForm<YAxisFormSchemaType>({
    resolver: zodResolver(yAxisFormSchema),
    defaultValues: yAxis
      ? {
          title: yAxis.title?.text || '',
          opposite: yAxis.opposite,
        }
      : undefined,
  })

  const { selectedCanvas, selectedChart, addYAxis, updateYAxis, deleteYAxis } = useAnalysis()

  function onSubmit(values: YAxisFormSchemaType) {
    if (!values || !selectedCanvas || !selectedChart) return

    if (yAxis) {
      updateYAxis(selectedCanvas.id, selectedChart.id, yAxis.id!, {
        title: { text: values.title },
        opposite: values.opposite,
      })
    } else {
      addYAxis(selectedCanvas.id, selectedChart.id, {
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
            {yAxis && (
              <Button
                type='button'
                variant='outline'
                className='border-red-500 text-red-500 hover:bg-red-100 hover:text-red-500'
                onClick={() => {
                  if (!selectedCanvas || !selectedChart || !yAxis.id) {
                    return
                  }
                  deleteYAxis(selectedCanvas.id, selectedChart.id, yAxis.id)
                  setOpen(false)
                }}
              >
                Delete
              </Button>
            )}
            <Button type='submit'>Save</Button>
          </div>
        </form>
      </Form>
    </>
  )
}
