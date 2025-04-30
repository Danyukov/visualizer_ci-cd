import { QueryClientProvider } from '@tanstack/react-query'
import { ComponentProps, ReactNode } from 'react'

export interface QueryProviderProps extends ComponentProps<typeof QueryClientProvider> {
  children: ReactNode
}

export const QueryProvider = ({ children, client }: QueryProviderProps) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
