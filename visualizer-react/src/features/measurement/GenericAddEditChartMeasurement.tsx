import type { Dispatch, ReactNode, SetStateAction } from 'react'
import type { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { MoreHorizontalIcon, PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import type { Canvas } from '@/models/canvas'
import type { Chart, ChartMeasurement } from '@/models/chart'

import {
  useGetAssetsByPlantGuid,
  useGetFirstValue,
  useGetLatestValue,
  useGetMeasurementsByAssetGuid,
  useGetMeasurementVersions,
  useGetPlantsByProjectGuid,
  useGetProjectsQuery,
} from '@/api/imby/queries'
import { chartMeasurementSchema } from '@/models/chart'
import { cn } from '@/shared/lib/utils'
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
import { Separator } from '@/shared/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet'
import { Skeleton } from '@/shared/ui/skeleton'
import { Switch } from '@/shared/ui/switch'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/constants/queryKeys'

type ChartMeasurementSheetProps = {
  canvasId: Canvas['id']
  chartId: Chart['id']
  measurement?: ChartMeasurement

  onAdd?: (values: Partial<ChartMeasurement>, canvasId: Canvas['id'], chartId: Chart['id']) => void
  onEdit?: (
    values: Partial<ChartMeasurement>,
    canvasId: Canvas['id'],
    chartId: Chart['id'],
    measurementId: ChartMeasurement['id']
  ) => void

  target?: ReactNode
  className?: string
}

export function GenericAddEditChartMeasurementSheetBtn(props: ChartMeasurementSheetProps) {
  const { canvasId, chartId, measurement, onAdd, onEdit, target, className } = props

  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {target ?? (
          <Button size='icon' className={cn('w-6 h-6', className)} variant='ghost'>
            {measurement ? <MoreHorizontalIcon /> : <PlusIcon />}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className='w-[40rem] sm:max-w-[40rem]'>
        <SheetHeader>
          <SheetTitle>Measurement settings</SheetTitle>
          <SheetDescription>
            Pick a measurement source and configure it series if needed
          </SheetDescription>
        </SheetHeader>
        <GenericAddEditChartMeasurementForm
          canvasId={canvasId}
          chartId={chartId}
          measurement={measurement}
          onAdd={onAdd}
          onEdit={onEdit}
          setOpen={setOpen}
        />
      </SheetContent>
    </Sheet>
  )
}

const formSchema = chartMeasurementSchema.pick({
  connection: true,
  series: true,
})

type FormSchemaType = z.infer<typeof formSchema>

type ChartMeasurementFormProps = {
  canvasId: Canvas['id']
  chartId: Chart['id']
  measurement?: ChartMeasurement

  onAdd?: (values: Partial<ChartMeasurement>, canvasId: Canvas['id'], chartId: Chart['id']) => void
  onEdit?: (
    values: Partial<ChartMeasurement>,
    canvasId: Canvas['id'],
    chartId: Chart['id'],
    measurementId: ChartMeasurement['id']
  ) => void

  onDelete?: (measurementId: ChartMeasurement['id']) => void
  onClose?: () => void
  setOpen?: Dispatch<SetStateAction<boolean>>
}

export function GenericAddEditChartMeasurementForm(props: ChartMeasurementFormProps) {
  const { canvasId, chartId, measurement, onAdd, onEdit, onDelete, setOpen } = props

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: measurement
      ? {
          connection: {
            projectId: measurement.connection.projectId,
            projectName: measurement.connection.projectName,
            plantId: measurement.connection.plantId,
            plantName: measurement.connection.plantName,
            assetId: measurement.connection.assetId,
            assetName: measurement.connection.assetName,
            measurementId: measurement.connection.measurementId,
            measurementName: measurement.connection.measurementName,
            measurementVersionId: measurement.connection.measurementVersionId,
            measurementVersionName: measurement.connection.measurementVersionName,
          },
          series: {
            name: measurement.series?.name,
            type: measurement.series?.type,
            dash: measurement.series?.dash,
            step: measurement.series?.step,
            yAxisId: measurement.series?.yAxisId,
          },
        }
      : undefined,
  })

  const [projectGuid, setProjectGuid] = useState(measurement?.connection.projectId ?? '')
  const [plantGuid, setPlantGuid] = useState(measurement?.connection.plantId ?? '')
  const [assetGuid, setAssetGuid] = useState(measurement?.connection.assetId ?? '')
  const [measurementGuid, setMeasurementGuid] = useState(
    measurement?.connection.measurementId ?? ''
  )
  const [measurementVersionGuid, setMeasurementVersionGuid] = useState(
    measurement?.connection.measurementVersionId ?? ''
  )

  const queryClient = useQueryClient()

  const { data: projects, isLoading: isProjectsLoading } = useGetProjectsQuery()
  const {
    data: plants,
    refetch: refetchPlants,
    isLoading: isPlantsLoading,
  } = useGetPlantsByProjectGuid(projectGuid)
  const {
    data: assets,
    refetch: refetchAssets,
    isLoading: isAssetsLoading,
  } = useGetAssetsByPlantGuid(plantGuid)
  const {
    data: measurements,
    refetch: refetchMeasurements,
    isLoading: isMeasurementsLoading,
  } = useGetMeasurementsByAssetGuid(assetGuid)
  const {
    data: measurementVersions,
    refetch: refetchMeasurementVersions,
    isLoading: isMeasurementVersionsLoading,
  } = useGetMeasurementVersions(measurementGuid)

  const {
    data: firstValue,
    isLoading: isFirstValueLoading,
    refetch: refetchFirstValue,
  } = useGetFirstValue(measurementVersionGuid)
  const {
    data: latestValue,
    isLoading: isLastValueLoading,
    refetch: refetchLatestValue,
  } = useGetLatestValue(measurementVersionGuid)

  const noValues = !firstValue && !latestValue

  useEffect(() => {
    if (projectGuid) {
      refetchPlants()
    }
  }, [projectGuid, refetchPlants])

  useEffect(() => {
    if (plantGuid) {
      refetchAssets()
    }
  }, [plantGuid, refetchAssets])

  useEffect(() => {
    if (assetGuid) {
      refetchMeasurements()
    }
  }, [assetGuid, refetchMeasurements])

  useEffect(() => {
    if (measurementGuid) {
      refetchMeasurementVersions()
    }
  }, [measurementGuid, refetchMeasurementVersions])

  useEffect(() => {
    if (measurementVersionGuid) {
      refetchFirstValue()
      refetchLatestValue()
    }
  }, [measurementVersionGuid, refetchFirstValue, refetchLatestValue])

  const onProjectChange = (value: string) => {
    const found = projects?.find((p) => p.projectGuid === value)
    if (found) {
      setProjectGuid(found.projectGuid)
      form.setValue('connection.projectId', found.projectGuid)
      form.setValue('connection.projectName', found.projectName)
    }
  }

  const onPlantChange = (value: string) => {
    const found = plants?.find((p) => p.plantGuid === value)
    if (found) {
      setPlantGuid(found.plantGuid)
      form.setValue('connection.plantId', found.plantGuid)
      form.setValue('connection.plantName', found.plantName)
    }
  }

  const onAssetChange = (value: string) => {
    const found = assets?.find((p) => p.assetGuid === value)
    if (found) {
      setAssetGuid(found.assetGuid)
      form.setValue('connection.assetId', found.assetGuid)
      form.setValue('connection.assetName', found.assetName)
    }
  }

  const onMeasurementChange = (value: string) => {
    const found = measurements?.find((m) => m.measurementGuid === value)
    if (found) {
      setMeasurementGuid(found.measurementGuid)
      form.setValue('connection.measurementId', found.measurementGuid)
      form.setValue('connection.measurementName', found.measurementName)
      form.setValue('series.name', found.measurementName)

      if (found.unit === 'kWh') {
        form.setValue('series.type', 'column')
      } else if (found.unit === 'kW') {
        form.setValue('series.type', 'line')
      }
    }
  }

  const onMeasurementVersionChange = (value: string) => {
    const found = measurementVersions?.find((v) => v.measurementVersionGuid === value)
    if (found) {
      setMeasurementVersionGuid(found.measurementVersionGuid)
      form.setValue('connection.measurementVersionId', found.measurementVersionGuid)
      form.setValue('connection.measurementVersionName', found.measurementVersionName)
    }
  }

  function onSubmit(values: FormSchemaType) {
    if (!values) {
      return
    }
    if (!values.connection || !values.series) {
      return
    }

    if (onAdd && onEdit) {
      // TODO: fix
      return
    }

    if (onAdd) {
      onAdd(values, canvasId, chartId)
      resetAndClose()
    }

    if (onEdit) {
      if (!measurement) {
        return
      }
      onEdit(values, canvasId, chartId, measurement.id)
      resetAndClose()
    }
  }

  function resetAndClose() {
    form.reset()

    queryClient.resetQueries({ queryKey: [queryKeys.GET_PROJECTS], exact: true })
    queryClient.resetQueries({ queryKey: [queryKeys.GET_PLANTS, projectGuid], exact: true })
    queryClient.resetQueries({ queryKey: [queryKeys.GET_ASSETS, plantGuid], exact: true })
    queryClient.resetQueries({
      queryKey: [queryKeys.GET_MEASUREMENTS_BY_ASSET_GUID, assetGuid],
      exact: true,
    })
    queryClient.resetQueries({
      queryKey: [queryKeys.GET_MEASUREMENT_VERSIONS_BY_MEASUREMENT_GUID, measurementGuid],
      exact: true,
    })
    queryClient.resetQueries({
      queryKey: [queryKeys.GET_FIRST_VALUE, measurementVersionGuid],
      exact: true,
    })
    queryClient.resetQueries({
      queryKey: [queryKeys.GET_LATEST_VALUE, measurementVersionGuid],
      exact: true,
    })

    setProjectGuid('')
    setPlantGuid('')
    setAssetGuid('')
    setMeasurementGuid('')
    setMeasurementVersionGuid('')
    setOpen?.(false)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          <div className='flex flex-col gap-5 mt-5'>
            <Label className='text-base'>Connect database</Label>
            <div className='grid grid-cols-2 gap-5'>
              <FormField
                control={form.control}
                name='connection.projectId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-muted-foreground font-normal'>Project</FormLabel>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(v)
                        onProjectChange(v)
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a project' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isProjectsLoading ? (
                          <Skeleton className='w-full h-6' />
                        ) : (
                          <>
                            {projects?.map((item) => (
                              <SelectItem key={item.projectGuid} value={item.projectGuid}>
                                {item.projectName}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='connection.plantId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-muted-foreground font-normal'>Plant</FormLabel>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(v)
                        onPlantChange(v)
                      }}
                      value={field.value}
                      // onOpenChange={() => {
                      //   if (projectGuid) {
                      //     refetchPlants()
                      //   }
                      // }}
                    >
                      <FormControl>
                        <SelectTrigger onClick={() => refetchPlants()}>
                          <SelectValue placeholder='Select a plant' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isPlantsLoading ? (
                          <Skeleton className='w-full h-6' />
                        ) : (
                          <>
                            {plants?.map((item) => (
                              <SelectItem key={item.plantGuid} value={item.plantGuid}>
                                {item.plantName}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='connection.assetId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-muted-foreground font-normal'>Asset</FormLabel>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(v)
                        onAssetChange(v)
                      }}
                      value={field.value}
                      // onOpenChange={() => {
                      //   if (plantGuid) {
                      //     refetchAssets()
                      //   }
                      // }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select an asset' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isAssetsLoading ? (
                          <Skeleton className='w-full h-6' />
                        ) : (
                          <>
                            {assets?.map((item) => (
                              <SelectItem key={item.assetGuid} value={item.assetGuid}>
                                {item.assetName}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='connection.measurementId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-muted-foreground font-normal'>Measurement</FormLabel>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(v)
                        onMeasurementChange(v)
                      }}
                      value={field.value}
                      // onOpenChange={() => {
                      //   if (assetGuid) {
                      //     refetchMeasurements()
                      //   }
                      // }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a measurement' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isMeasurementsLoading ? (
                          <Skeleton className='w-full h-6' />
                        ) : (
                          <>
                            {measurements?.map((item) => (
                              <SelectItem key={item.measurementGuid} value={item.measurementGuid}>
                                {item.measurementName}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='connection.measurementVersionId'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel className='text-muted-foreground font-normal'>
                      Measurement version
                    </FormLabel>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(v)
                        onMeasurementVersionChange(v)
                      }}
                      value={field.value}
                      // onOpenChange={() => {
                      //   if (measurementGuid) {
                      //     refetchMeasurementVersions()
                      //   }
                      // }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a measurement version' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isMeasurementVersionsLoading ? (
                          <Skeleton className='w-full h-6' />
                        ) : (
                          <>
                            {measurementVersions?.map((item) => (
                              <SelectItem
                                key={item.measurementVersionGuid}
                                value={item.measurementVersionGuid}
                              >
                                {item.measurementVersionName}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <Label>First value</Label>
                  {isFirstValueLoading ? (
                    <Skeleton className='w-32 h-5' />
                  ) : (
                    <div className='muted'>
                      {firstValue?.timeStamp
                        ? new Date(firstValue.timeStamp).toLocaleString()
                        : 'None'}
                    </div>
                  )}
                </div>

                <div className='flex items-center gap-2'>
                  <Label>Last value</Label>
                  {isLastValueLoading ? (
                    <Skeleton className='w-32 h-5' />
                  ) : (
                    <span className='muted'>
                      {latestValue?.timeStamp
                        ? new Date(latestValue.timeStamp).toLocaleString()
                        : 'None'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Separator />
          <div className='flex flex-col gap-5'>
            <Label className='text-base'>Series properties</Label>
            <div className='grid grid-cols-2 gap-5'>
              <FormField
                control={form.control}
                name='series.name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-muted-foreground font-normal'>Series name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter series name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='series.type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-muted-foreground font-normal'>Series type</FormLabel>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(v)
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select series type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from(['line', 'column', 'area']).map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.getValues('series.type') === 'line' && (
                <>
                  <FormField
                    control={form.control}
                    name='series.dash'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                        <div className='space-y-1'>
                          <FormLabel>Dashed Line</FormLabel>
                          <FormDescription>Use dashed line style for this series</FormDescription>
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
                  <FormField
                    control={form.control}
                    name='series.step'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                        <div className='space-y-1'>
                          <FormLabel>Step Line</FormLabel>
                          <FormDescription>Use step line style for this series</FormDescription>
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
                </>
              )}
              {/* <FormField
              control={form.control}
              name='series.yAxisId'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel className='text-muted-foreground font-normal'>Y Axis</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v)
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select y axis' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedChart?.yAxes?.map((item) => (
                        <SelectItem key={item.id} value={item.id!}>
                          {item.title?.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            </div>
          </div>

          <div className='flex gap-2 justify-end'>
            <Button type='button' variant='ghost' onClick={resetAndClose}>
              Cancel
            </Button>
            {measurement && onDelete && (
              <Button
                type='button'
                variant='outline'
                className='border-red-500 text-red-500 hover:bg-red-100 hover:text-red-500'
                onClick={() => {
                  onDelete?.(measurement.id)
                  setOpen?.(false)
                }}
              >
                Delete
              </Button>
            )}
            <Button type='submit' disabled={noValues}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
