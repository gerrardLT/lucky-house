export interface BadgeProps {
  variant:
    | 'pet-friendly'
    | 'normal'
    | 'coming-soon'
    | 'rendering'
    | 'open'
    | 'maintenance'
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeProps['variant'], string> = {
  'pet-friendly': 'bg-amber-900/20 text-amber-400 border-amber-700/50',
  open: 'bg-amber-900/20 text-amber-400 border-amber-700/50',
  'coming-soon': 'bg-amber-900/30 text-amber-400 border-amber-700/50',
  rendering: 'bg-blue-900/30 text-blue-400 border-blue-700/50',
  maintenance: 'bg-red-900/30 text-red-400 border-red-700/50',
  normal: 'bg-stone-800 text-stone-300 border-stone-600',
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
