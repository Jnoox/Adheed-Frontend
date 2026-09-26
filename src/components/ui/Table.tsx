import type { KeyboardEvent, ReactNode } from 'react'
import { useT } from '@/app/LanguageProvider'
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
  onRowClick?: (row: T) => void
  striped?: boolean
}

export function Table<T>({
  columns,
  rows,
  getRowKey,
  emptyTitle,
  className,
  onRowClick,
  striped = false,
}: TableProps<T>) {
  const { t } = useT()
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle ?? t('common.empty')} />
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse text-start text-body">
        <thead>
          <tr className={cn('border-b border-border', striped && 'bg-surface')}>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-inline py-2 font-medium',
                  striped && 'font-normal text-text-muted',
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className={cn(
                'border-b border-border',
                striped && 'odd:bg-surface-raised even:bg-surface-alt',
                onRowClick && 'cursor-pointer hover:bg-surface-tint',
              )}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={
                onRowClick
                  ? (event: KeyboardEvent<HTMLTableRowElement>) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onRowClick(row)
                      }
                    }
                  : undefined
              }
              tabIndex={onRowClick ? 0 : undefined}
            >
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
