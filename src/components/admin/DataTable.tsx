// src/components/admin/DataTable.tsx

import { EmptyState } from './EmptyState'
import type { LucideIcon } from 'lucide-react'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField: keyof T
  onRowClick?: (row: T) => void
  emptyMessage?: string
  emptyIcon?: LucideIcon
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  onRowClick,
  emptyMessage = 'No data available',
  emptyIcon,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <EmptyState title={emptyMessage} icon={emptyIcon} />
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-stone-900/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-[11px] font-medium text-stone-500 uppercase tracking-wider ${
                  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                } ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-800/60">
          {data.map((row) => (
            <tr
              key={String((row as Record<string, unknown>)[keyField as string])}
              onClick={() => onRowClick?.(row)}
              className={`group ${
                onRowClick ? 'cursor-pointer hover:bg-stone-800/30' : ''
              } transition-colors`}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-stone-300 ${
                  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                } ${col.className || ''}`}>
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Skeleton rows for loading state */
export function DataTableSkeleton({ columns, rows = 5 }: { columns: number; rows?: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-stone-900/50">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="text-left px-4 py-3">
                <div className="h-3 w-16 bg-stone-800 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-800/60">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: columns }).map((_, j) => (
                <td key={j} className="px-4 py-3">
                  <div className={`h-3.5 bg-stone-800/60 rounded animate-pulse ${j === 0 ? 'w-20' : 'w-28'}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
