// src/components/admin/EmptyState.tsx

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
}

export function EmptyState({ icon = '📭', title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl mb-4">{icon}</span>
      <h3 className="text-lg font-medium text-stone-300">{title}</h3>
      {description && (
        <p className="text-sm text-stone-500 mt-1 max-w-sm">{description}</p>
      )}
    </div>
  )
}
