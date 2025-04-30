import type { Table } from '@tanstack/react-table'
import type { ReactNode } from 'react'

import { Input } from '@/shared/ui/input'

import { DataTableViewOptions } from './DataTableViewOptions'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  action?: ReactNode
  viewOptionsEnabled?: boolean
}

export function DataTableToolbar<TData>({
  table,
  action,
  viewOptionsEnabled,
}: DataTableToolbarProps<TData>) {
  // const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search name"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={event => table.getColumn('name')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <div className="flex items-center gap-2">
        {action}
        {viewOptionsEnabled && <DataTableViewOptions table={table} />}
      </div>
    </div>
  )
}
