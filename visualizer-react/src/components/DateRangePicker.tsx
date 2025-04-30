'use client'
import { endOfToday, startOfToday } from 'date-fns'
import { useState } from 'react'

import type {
  DateRange,
} from '@/shared/ui/tremor/tremor-date-picker'

import { cn } from '@/shared/lib/utils'
import {
  DateRangePicker as DateRangerPickerComponent,
} from '@/shared/ui/tremor/tremor-date-picker'

const samplePresets: DateRangePickerPresetType[] = [
  {
    label: 'Today',
    dateRange: {
      from: startOfToday(),
      to: endOfToday(),
    },
  },
  {
    label: 'Last 7 days',
    dateRange: {
      from: new Date(new Date().setDate(new Date().getDate() - 7)),
      to: new Date(),
    },
  },
  {
    label: 'Last 30 days',
    dateRange: {
      from: new Date(new Date().setDate(new Date().getDate() - 30)),
      to: new Date(),
    },
  },
  {
    label: 'Last 3 months',
    dateRange: {
      from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
      to: new Date(),
    },
  },
  {
    label: 'Last 6 months',
    dateRange: {
      from: new Date(new Date().setMonth(new Date().getMonth() - 6)),
      to: new Date(),
    },
  },
  {
    label: 'Month to date',
    dateRange: {
      from: new Date(new Date().setDate(1)),
      to: new Date(),
    },
  },
  {
    label: 'Year to date',
    dateRange: {
      from: new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1)),
      to: new Date(),
    },
  },
]

type DateRangePickerPresetType = {
  label: string
  dateRange: {
    from: Date
    to: Date
  }
}

type DateRangePickerProps = {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  presets?: DateRangePickerPresetType[]
  className?: string
}

export function DateRangePicker({
  value,
  onChange,
  presets = samplePresets,
  className,
}: DateRangePickerProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: value?.from ? new Date(value?.from) : undefined,
    to: value?.to ? new Date(value?.to) : undefined,
  })

  const handleChange = (dateRange: DateRange | undefined) => {
    setDateRange(dateRange)
    onChange?.(dateRange)
  }

  return (
    <DateRangerPickerComponent
      presets={presets}
      value={dateRange}
      onChange={handleChange}
      className={cn('w-60', className)}
    />
  )
}
