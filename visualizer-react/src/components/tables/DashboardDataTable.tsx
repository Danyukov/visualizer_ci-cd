import type { ColumnDef } from '@tanstack/react-table'

import { BadgeCheckIcon, BadgeXIcon, MoreHorizontal, PlusIcon } from 'lucide-react'
import { Link } from 'react-router'

import type { Dashboard } from '@/models/dashboard'

import { CreateVisualizationDialogBtn } from '@/features/dashboard/CreateVisualization'
import { cn, formatters } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Skeleton } from '@/shared/ui/skeleton'

import { DataTable } from '../datatable/DataTable'
import { useGetDashboardsQuery } from '@/api/hooks/dashboards'

const columns: ColumnDef<Dashboard>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'templateName',
    header: 'Template',
  },
  {
    accessorKey: 'published',
    header: 'Published',
    cell: ({ row }) => {
      const published = row.original.published
      const Icon = published ? BadgeCheckIcon : BadgeXIcon
      return <Icon className={cn('size-4', published ? 'text-green-600' : 'text-zinc-600')} />
    },
  },
  {
    accessorKey: 'client',
    header: 'Client',
  },
  {
    id: 'views',
    header: 'Views',
    cell: () => {
      return <div>0</div>
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated',
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt
      if (!updatedAt) return null

      return <div>{formatters.date(new Date(updatedAt))}</div>
    },
  },
  {
    accessorKey: 'username',
    header: 'Author',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id
      return (
        <div className='text-right'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='w-6 h-6' size='icon'>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/dashboards/${id}`}>Open</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

export function VisualizationDataTable() {
  const { data, isLoading } = useGetDashboardsQuery()
  return (
    <>
      {isLoading && <Skeleton className='w-full h-10' />}
      {!isLoading && (
        <DataTable
          data={data?.data.data || []}
          columns={columns}
          action={
            <CreateVisualizationDialogBtn
              target={
                <Button size='sm'>
                  <PlusIcon />
                  New Dashboard
                </Button>
              }
            />
          }
        />
      )}
    </>
  )
}
