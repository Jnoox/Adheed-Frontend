import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { EmptyState } from './EmptyState'

export type TableColumn<T> = {
  key: string
  header: string
  render: (row: T) => ReactNode
}

type TableProps<T> = {
  columns: TableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  emptyTitle?: string
  className?: string
}

export function Table<T>({
  columns,
  rows,
  getRowKey,
  emptyTitle = 'لا توجد بيانات',
  className,
}: TableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} />
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse text-start text-body">
        <thead>
          <tr className="border-b border-border-strong">
            {columns.map((column) => (
              <th key={column.key} className="px-inline py-2 font-medium">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="border-b border-border">
              {columns.map((column) => (
                <td key={column.key} className="px-inline py-2">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
