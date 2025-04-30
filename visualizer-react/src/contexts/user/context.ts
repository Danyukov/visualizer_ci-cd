import { User } from '@/models/user'
import { createContext } from 'react'

interface UserContext {
  user: User | null | undefined
  timeZone: string
  setUser: (user: User | null) => void
}

export const UserContext = createContext<UserContext | undefined>(undefined)
