'use client'

export interface FilterOption {
  key: string
  label: string
}

export interface FilterBarProps {
  options: FilterOption[]
  activeKey: string
  onFilter: (key: string) => void
  className?: string
  'aria-label'?: string
}

export function FilterBar({
  options,
  activeKey,
  onFilter,
  className = '',
  'aria-label': ariaLabel = '筛选选项',
}: FilterBarProps) {
  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="flex flex-wrap gap-2" role="list">
        {options.map((option) => {
          const isActive = option.key === activeKey
          return (
            <li key={option.key}>
              <button
                type="button"
                onClick={() => onFilter(option.key)}
                aria-pressed={isActive}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                  isActive
                    ? 'bg-amber-600 text-stone-900'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {option.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
