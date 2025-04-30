import { z } from 'zod'

import { canvasSchema } from './canvas'

export const dashboardSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  client: z.string().optional(),
  tenant: z.enum(['imby', 'ef'], {
    errorMap: () => ({ message: 'Please select an item' }),
  }),
  shareId: z.string().uuid(),
  saved: z.boolean().default(false),
  publishable: z.boolean().default(false),
  published: z.boolean().default(false),
  canvases: z.array(canvasSchema),
  updatedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  templateId: z.string().uuid(),
  templateName: z.string(),
  userId: z.string().uuid(),
  username: z.string(),
})

export type Dashboard = z.infer<typeof dashboardSchema>

export const dashboardUpdateSchema = dashboardSchema
  .pick({
    name: true,
    description: true,
    tenant: true,
    client: true,
    published: true,
    canvases: true,
    templateId: true,
  })
  .partial()

export type DashboardUpdateSchema = z.infer<typeof dashboardUpdateSchema>
