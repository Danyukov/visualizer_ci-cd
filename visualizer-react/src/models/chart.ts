import { z } from 'zod'

export const chartMeasurementSchema = z.object({
  id: z.string().uuid(),
  connection: z.object({
    projectName: z.string(),
    projectId: z.string().uuid(),
    plantName: z.string(),
    plantId: z.string().uuid(),
    assetName: z.string(),
    assetId: z.string().uuid(),
    measurementName: z.string(),
    measurementId: z.string().uuid(),
    measurementVersionName: z.string(),
    measurementVersionId: z.string().uuid(),
  }),
  series: z.object({
    name: z.string(),
    type: z.enum(['line', 'column', 'area']),
    dash: z.boolean().default(false),
    step: z.boolean().default(false),
    yAxisId: z.string().optional(),
  }),
  chartId: z.string().uuid(),
})

export type ChartMeasurement = z.infer<typeof chartMeasurementSchema>

export const chartYAxisOptions = z.object({
  id: z.string().optional(),
  title: z.object({
    text: z.string().optional(),
  }),
  lineWidth: z.number().default(1).optional(),
  gridLineWidth: z.number().default(1).optional(),
  gridLineColor: z.string().default('#dcdcdc').optional(),
  labels: z
    .object({
      style: z.object({
        color: z.string().default('#000'),
        fontSize: z.string().default('12px'),
      }),
    })
    .optional(),
  opposite: z.boolean().default(false).optional(),
})

export type ChartYAxisOptions = z.infer<typeof chartYAxisOptions>

export const chartSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['Composed']),
  name: z.string().max(64).optional(),
  description: z.string().max(255).optional(),
  measurements: z.array(chartMeasurementSchema).optional(),
  yAxes: z.array(chartYAxisOptions).optional(),
})

export type Chart = z.infer<typeof chartSchema>
