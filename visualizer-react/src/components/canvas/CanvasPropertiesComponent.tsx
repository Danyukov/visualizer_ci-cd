import { canvasSchema } from '@/models/canvas'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { DateRangePicker } from '../DateRangePicker'
import { z } from 'zod'
import { CanvasComponentProps } from './Canvas'
import { useTemplate } from '@/contexts/template/hook'

const propertiesFormSchema = canvasSchema.pick({
  name: true,
  properties: true,
})

type PropertiesFormSchemaType = z.infer<typeof propertiesFormSchema>

export function CanvasPropertiesComponent({ canvas }: CanvasComponentProps) {
  const { updateCanvas } = useTemplate()

  const form = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propertiesFormSchema),
    defaultValues: {
      name: canvas.name,
      properties: {
        dateRange: {
          from: canvas.properties?.dateRange?.from,
          to: canvas.properties?.dateRange?.to,
        },
        granularities: canvas.properties?.granularities,
      },
    },
  })

  useEffect(() => {
    form.reset({
      name: canvas.name,
      properties: {
        dateRange: {
          from: canvas.properties?.dateRange?.from,
          to: canvas.properties?.dateRange?.to,
        },
        granularities: canvas.properties?.granularities,
      },
    })
  }, [form, canvas])

  function applyChanges(values: PropertiesFormSchemaType) {
    if (!values) {
      return
    }

    if (!values.properties?.dateRange?.from || !values.properties?.dateRange?.to) {
      return
    }

    updateCanvas(canvas.id, {
      ...canvas,
      name: values.name,
      properties: {
        dateRange: {
          from: values.properties?.dateRange.from,
          to: values.properties?.dateRange.to,
        },
        granularities: values.properties?.granularities,
      },
    })
  }

  return (
    <>
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
            name='properties.dateRange'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Range</FormLabel>
                <DateRangePicker className='w-full' value={field.value} onChange={field.onChange} />
                <FormDescription>
                  Select the range of data that will be available on the canvas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  )
}
