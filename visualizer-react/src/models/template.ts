import { z } from 'zod'

import { canvasSchema } from './canvas'

export const templateSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  deleted: z.boolean().default(false),
  canvases: z.array(canvasSchema).optional(),
  uses: z.number().optional(),
  updatedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  userId: z.string().uuid(),
})

export type Template = z.infer<typeof templateSchema>

export const templateUpdateSchema = templateSchema
  .pick({
    name: true,
    description: true,
    canvases: true,
    deleted: true,
  })
  .partial()

export type TemplateUpdateSchema = z.infer<typeof templateUpdateSchema>
