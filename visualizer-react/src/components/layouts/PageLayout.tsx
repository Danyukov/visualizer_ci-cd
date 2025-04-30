import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/utils'

type PageLayoutProps = {
  children: ReactNode
  className?: string
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <>
      <div className={cn('w-full h-full p-5', className)}>{children}</div>
    </>
  )
}
