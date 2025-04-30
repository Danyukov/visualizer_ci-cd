import { ReactNode, useMemo, useState } from 'react'
import { UserContext } from './context'
import { User } from '@/models/user'

export interface InitialValue {
  user: User | null | undefined
  timeZone: string
}

export interface UserProviderProps {
  children: ReactNode
  initialValue: InitialValue
}

export function UserProvider({ children, initialValue }: UserProviderProps) {
  const [user, setUser] = useState<User | null | undefined>(initialValue.user)
  const [timeZone] = useState<string>(initialValue.timeZone)

  const value = useMemo(() => ({ user, setUser, timeZone }), [user])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
