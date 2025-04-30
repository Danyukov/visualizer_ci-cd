import { z } from 'zod'

export const userRoleEnum = z.enum(['Admin', 'User'])

export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  role: userRoleEnum,
  updatedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
})

export const userLoginResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
})

export type User = z.infer<typeof userSchema>
export type UserRole = z.infer<typeof userRoleEnum>
export type UserLoginResponse = z.infer<typeof userLoginResponseSchema>
