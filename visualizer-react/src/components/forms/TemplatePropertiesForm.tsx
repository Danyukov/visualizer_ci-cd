import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
import { templateSchema } from '@/models/template'
import { useTemplate } from '@/contexts/template/hook'

const templatePropertiesFormSchema = templateSchema.pick({
  name: true,
  description: true,
})

type TemplatePropertiesFormSchemaType = z.infer<typeof templatePropertiesFormSchema>

export function TemplatePropertiesForm() {
  const { template, updateTemplate } = useTemplate()

  const form = useForm<TemplatePropertiesFormSchemaType>({
    resolver: zodResolver(templatePropertiesFormSchema),
    defaultValues: {
      name: template?.name ?? '',
      description: template?.description ?? '',
    },
  })

  useEffect(() => {
    form.reset({
      name: template?.name ?? '',
      description: template?.description ?? '',
    })
  }, [form, template])

  function applyChanges(values: TemplatePropertiesFormSchemaType) {
    if (!template || !values) return
    updateTemplate({
      ...template,
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
