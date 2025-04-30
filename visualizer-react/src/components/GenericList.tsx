import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/shared/lib/utils'

/** Свойства компонента GenericList */
type GenericListProps<T> = {
  /** Массив данных для отображения */
  data: T[]

  /**
   * Функция, которая принимает элемент массива и индекс,
   * и возвращает React-элемент.
   */
  renderItem: (item: T, index: number) => ReactNode

  /**
   * (опционально) Состояние, отображаемое, если `data` пуст.
   * Если не задано, по умолчанию отобразится "No items found."
   */
  emptyState?: ReactNode

  /**
   * (опционально) Функция, которая возвращает ключ (key) для каждого элемента.
   * Если не передана, key по умолчанию будет индексом массива.
   */
  getKey?: (item: T, index: number) => string | number

  /** Дополнительный класс для ul-списка */
  className?: string

  /** Дополнительный класс для каждого li-элемента */
  itemClassName?: string
} & HTMLAttributes<HTMLUListElement>

/**
 * Универсальный компонент списка, который рендерит массив данных.
 * @example
 * <GenericList
 *   data={[{ id: 'a' }, { id: 'b' }]}
 *   renderItem={(item) => <span>{item.id}</span>}
 *   getKey={(item) => item.id}
 * />
 */
export function GenericList<T>(props: GenericListProps<T>) {
  const { data, renderItem, getKey, className, itemClassName, emptyState, ...rest } = props

  if (!data || data.length === 0) {
    return emptyState ?? <p>No items in the list...</p>
  }

  return (
    <ul className={cn('flex flex-col gap-5 flex-wrap', className)} {...rest}>
      {data.map((item, index) => {
        const key = getKey ? getKey(item, index) : index
        return (
          <li key={key} className={itemClassName}>
            {renderItem(item, index)}
          </li>
        )
      })}
    </ul>
  )
}