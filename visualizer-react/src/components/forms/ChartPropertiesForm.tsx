import type { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { Chart } from '@/models/chart'

import { chartSchema } from '@/models/chart'
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
import { Textarea } from '@/shared/ui/textarea'
import { useTemplate } from '@/contexts/template/hook'

const propertiesSchema = chartSchema.pick({
  name: true,
  description: true,
})

type PropertiesSchemaType = z.infer<typeof propertiesSchema>

type ChartPropertiesFormProps = {
  elementInstance: Chart
}

export function ChartPropertiesForm({ elementInstance }: ChartPropertiesFormProps) {
  const form = useForm<PropertiesSchemaType>({
    resolver: zodResolver(propertiesSchema),
    defaultValues: {
      name: elementInstance.name,
      description: elementInstance.description,
    },
  })

  useEffect(() => {
    form.reset({
      name: elementInstance.name,
      description: elementInstance.description,
    })
  }, [elementInstance, form])

  const { selectedCanvas, updateChart } = useTemplate()

  function applyChanges(values: PropertiesSchemaType) {
    if (!selectedCanvas) {
      toast.error('Canvas is not selected')
      return
    }

    updateChart(selectedCanvas?.id, elementInstance.id, {
      ...elementInstance,
      name: values.name,
      description: values.description,
    })
  }

  return (
    <Form {...form}>
      <form onBlur={form.handleSubmit(applyChanges)} className='flex flex-col gap-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Name' {...field} />
              </FormControl>
              <FormDescription>This is public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description{' '}
                <span className='text-muted-foreground text-xs font-normal'>(Optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder='White any comments to the chart'
                  className='max-h-[140px]'
                  maxLength={255}
                  {...field}
                />
              </FormControl>
              <FormDescription>Must not be longer than 255 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
