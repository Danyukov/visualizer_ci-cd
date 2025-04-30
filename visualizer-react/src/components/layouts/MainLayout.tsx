import { Suspense } from 'react'
import { Outlet } from 'react-router'

import { SidebarProvider } from '@/shared/ui/sidebar'

import { Loader } from '../Loader'
import { MainSidebar } from './MainSidebar'

export function MainLayout() {
  return (
    <>
      <SidebarProvider>
        <MainSidebar />
        <main className='flex flex-col w-full h-full'>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
      </SidebarProvider>
    </>
  )
}
