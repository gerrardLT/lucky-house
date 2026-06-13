import Link from 'next/link'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  'aria-label'?: string
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-amber-600 text-stone-900 hover:bg-amber-500 active:bg-amber-700 focus-visible:ring-amber-500',
  secondary:
    'bg-stone-800 text-stone-200 hover:bg-stone-700 active:bg-stone-900 focus-visible:ring-amber-500',
  ghost:
    'bg-transparent text-stone-300 hover:bg-stone-800 hover:text-white focus-visible:ring-amber-500',
  outline:
    'border border-stone-600 bg-transparent text-stone-200 hover:bg-stone-800 hover:text-white focus-visible:ring-amber-500',
}

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled = false,
  loading = false,
  children,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none'

  const classes = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </>
  )

  if (href && !disabled && !loading) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {content}
    </button>
  )
}
