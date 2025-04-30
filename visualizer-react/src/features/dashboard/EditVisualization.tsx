import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Copy, Settings } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
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
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet'
import { Switch } from '@/shared/ui/switch'

import { DeleteVisualizationDialogBtn } from './DeleteVisualization'
import { useDashboard } from '@/contexts/dashboard/hook'
import { useQueryClient } from '@tanstack/react-query'
import { usePatchEditDashboardMutation } from '@/api/hooks/dashboards'
import { queryKeys } from '@/shared/constants/queryKeys'
import { dashboardSchema } from '@/models/dashboard'

export function VisualizationSettingsSheetBtn() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' size='icon'>
          <Settings />
        </Button>
      </SheetTrigger>
      <SheetContent className='sm:max-w-[30vw] w-full'>
        <SheetHeader>
          <SheetTitle>Visualization settings</SheetTitle>
          <SheetDescription>
            Make changes to your visualization here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <VisualizationSettingsForm />
      </SheetContent>
    </Sheet>
  )
}

const visualizationSettingsFormSchema = dashboardSchema.pick({
  name: true,
  description: true,
  tenant: true,
  client: true,
  published: true,
})

type VisualizationSettingsFormSchemaType = z.infer<typeof visualizationSettingsFormSchema>

function VisualizationSettingsForm() {
  const { dashboard } = useDashboard()

  const shareUrl = `${window.location.origin}/preview/${dashboard?.shareId}`

  const form = useForm({
    resolver: zodResolver(visualizationSettingsFormSchema),
    defaultValues: {
      name: dashboard?.name,
      description: dashboard?.description ?? undefined,
      tenant: dashboard?.tenant ?? undefined,
      client: dashboard?.client ?? undefined,
      published: dashboard?.published,
    },
  })

  const queryClient = useQueryClient()

  const patchEditDashboardMutation = usePatchEditDashboardMutation({
    options: {
      onSuccess: () => {
        toast.success('You have updated the dashboard 👍', {})
      },
      onError: () => {
        toast.error('Failed to update the dashboard', {})
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.GET_DASHBOARD_BY_ID, dashboard?.id] })
        queryClient.invalidateQueries({ queryKey: [queryKeys.GET_DASHBOARDS] })
      },
    },
  })

  const navigate = useNavigate()

  useEffect(() => {
    form.reset({
      name: dashboard?.name,
      description: dashboard?.description ?? undefined,
      tenant: dashboard?.tenant ?? undefined,
      client: dashboard?.client ?? undefined,
      published: dashboard?.published,
    })
  }, [form, dashboard])

  const canPublish = !!dashboard?.templateId && dashboard.saved

  async function onSubmit(values: VisualizationSettingsFormSchemaType) {
    if (!dashboard || !values) return

    await patchEditDashboardMutation.mutateAsync({
      params: {
        dashboardId: dashboard.id,
        data: {
          name: values.name,
          description: values.description,
          tenant: values.tenant,
          client: values.client,
          published: values.published,
        },
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='space-y-0.5'>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter name' {...field} />
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
            <FormItem className='space-y-0.5'>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder='Enter description' {...field} />
              </FormControl>
              <FormDescription>Must not be longer than 255 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tenant'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tenant</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a tenant' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from([
                    { id: 1, text: 'Imby', value: 'imby' },
                    { id: 2, text: 'Energy Freedom', value: 'ef' },
                  ]).map((item) => (
                    <SelectItem value={item.value} key={item.id}>
                      {item.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select which logo will be displayed in the preview.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='client'
          render={({ field }) => (
            <FormItem className='space-y-0.5'>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Input placeholder='Enter client name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='published'
          render={({ field }) => (
            <FormItem className='flex flex-col items-center justify-between rounded-lg border p-3 shadow-sm'>
              <div className='flex items-center gap-2'>
                <div className='space-y-0.5'>
                  <FormLabel>Publish visualization</FormLabel>
                  <FormDescription>
                    Make it available to client so that they can quickly and clearly see data on the
                    performance of their assets.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    disabled={!canPublish}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              {field.value && (
                <div className='w-full'>
                  <Label>Share URL</Label>
                  <div className='flex w-full gap-1'>
                    <Input className='w-full' readOnly aria-readonly value={shareUrl} />
                    <Button
                      type='button'
                      size='icon'
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl)
                        toast.success('Share url copied to clipboard')
                      }}
                    >
                      <Copy />
                    </Button>
                  </div>
                </div>
              )}
            </FormItem>
          )}
        />
        <div>
          <div className='muted'>
            Edited at: {dashboard?.updatedAt ? format(new Date(dashboard.updatedAt), 'PPP p') : '—'}
          </div>
          <div className='muted'>
            Created at {dashboard?.createdAt ? format(new Date(dashboard.createdAt), 'PPP p') : '—'}
          </div>
        </div>
        <div className='flex gap-2'>
          {dashboard && (
            <DeleteVisualizationDialogBtn
              visualizationId={dashboard.id}
              target={
                <Button type='button' variant='destructive'>
                  Delete
                </Button>
              }
              onSuccess={() => navigate('/dashboards')}
            />
          )}
          <Button type='submit' className='w-full'>
            Apply and Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
