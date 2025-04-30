import { ReactNode } from 'react'
import { UserProvider, UserProviderProps } from './contexts/user/provider'
import { QueryProvider, QueryProviderProps } from './contexts/query/provider'

export interface ProvidersProps {
  children: ReactNode
  user: Omit<UserProviderProps, 'children'>
  query: Omit<QueryProviderProps, 'children'>
}

export const Providers = ({ user, query, children }: ProvidersProps) => {
  return (
    <UserProvider {...user}>
      <QueryProvider {...query}>{children}</QueryProvider>
    </UserProvider>
  )
}
