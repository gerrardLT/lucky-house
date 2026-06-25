// src/components/admin/EmptyState.tsx

import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
}

export function EmptyState({ icon: Icon = Inbox, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-2xl bg-stone-800 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-stone-500" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-medium text-stone-300">{title}</h3>
      {description && (
        <p className="text-xs text-stone-500 mt-1.5 max-w-xs">{description}</p>
      )}
    </div>
  )
}
