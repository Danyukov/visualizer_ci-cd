import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const focusRing = [
  // base
  'outline outline-offset-2 outline-0 focus-visible:outline-2',
  // outline color
  'outline-blue-500 dark:outline-blue-500',
]

export const focusInput = [
  // base
  'focus:ring-2',
  // ring color
  'focus:ring-blue-200 focus:dark:ring-blue-700/30',
  // border color
  'focus:border-blue-500 focus:dark:border-blue-700',
]

export const hasErrorInput = [
  // base
  'ring-2',
  // border color
  'border-red-500 dark:border-red-700',
  // ring color
  'ring-red-200 dark:ring-red-700/30',
]

export const dateConverter = {
  toLocal: (utcDate: Date | string): string => {
    const dateObj = typeof utcDate === 'string' ? new Date(utcDate) : utcDate
    return new Date(dateObj).toLocaleString()
  },
  toUtc: (localData: Date): string => {
    return localData.toISOString()
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatters = {
  date: (date: Date): string =>
    new Intl.DateTimeFormat('nl-BE', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date),

  currency: ({
    number,
    maxFractionDigits = 2,
    currency = 'USD',
  }: {
    number: number
    maxFractionDigits?: number
    currency?: string
  }) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: maxFractionDigits,
    }).format(number),

  unit: (number: number) => {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      style: 'decimal',
    }).format(number)
    return `${formattedNumber}`
  },

  percentage: ({ number, decimals = 1 }: { number: number; decimals?: number }) => {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number)
    const symbol = number > 0 && number !== Infinity ? '+' : ''

    return `${symbol}${formattedNumber}`
  },

  million: ({ number, decimals = 1 }: { number: number; decimals?: number }) => {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number)
    return `${formattedNumber}M`
  },
}
