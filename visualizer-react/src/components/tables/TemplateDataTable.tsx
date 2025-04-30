import type { ColumnDef } from '@tanstack/react-table'

import { MoreHorizontal } from 'lucide-react'
import { Link } from 'react-router'

import type { Template } from '@/models/template'

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
import { formatters } from '@/shared/lib/utils'
import { useGetTemplatesQuery } from '@/api/hooks/templates'

const columns: ColumnDef<Template>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
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
    id: 'uses',
    header: 'Uses',
    cell: ({ row }) => {
      return <div>{row.original.uses}</div>
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id
      return (
        <div className='text-right'>
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
                  <Link to={`/templates/${id}`}>Open</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )
    },
  },
]

export function TemplateDataTable() {
  const { data: templates, isLoading } = useGetTemplatesQuery({ canvases: false })
  return (
    <>
      {isLoading && <Skeleton className='w-full h-10' />}
      {!isLoading && <DataTable data={templates?.data.data || []} columns={columns} />}
    </>
  )
}
