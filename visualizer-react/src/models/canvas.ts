import { z } from 'zod'

import { chartSchema } from './chart'

export const canvasSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  description: z.string().optional(),
  properties: z
    .object({
      granularities: z.array(z.string()).optional(),
      dateRange: z
        .object({
          from: z.coerce.date(),
          to: z.coerce.date().optional(),
        })
        .optional(),
    })
    .optional(),
  charts: z.array(chartSchema).optional(),
})

export type Canvas = z.infer<typeof canvasSchema>
