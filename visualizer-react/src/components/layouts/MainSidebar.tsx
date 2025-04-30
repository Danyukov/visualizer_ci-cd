import { PieChartIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router'

import { UserProfileDropdown } from '@/components/UserProfileDropdown'
import { navLinks } from '@/shared/constants/navLinks'
import { cn } from '@/shared/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar'
import { Clocks } from '../Clocks'
import { useUser } from '@/contexts/user/hook'

export function MainSidebar() {
  const { pathname } = useLocation()
  const { timeZone } = useUser()

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className='flex items-center gap-4'>
                  <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground'>
                    <PieChartIcon className='size-4 text-white' />
                  </div>
                  <span className='font-semibold text-black'>Imby / visualizer</span>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navLinks.map((item) => {
                  const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`)
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.path}
                          className={cn(
                            'transition-all text-zinc-500  hover:bg-primary',
                            isActive &&
                              `!bg-primary !text-white hover:!bg-primary hover:!text-white  font-semibold`
                          )}
                        >
                          <item.icon />
                          {item.label}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Others</SidebarGroupLabel>
            <SidebarGroupContent>
              Time zone - {timeZone}
              <Clocks />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <UserProfileDropdown />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
