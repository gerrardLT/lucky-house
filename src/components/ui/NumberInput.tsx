'use client'

export interface NumberInputProps {
  id?: string
  value: number | ''
  onChange: (value: number | undefined) => void
  min?: number
  max?: number
  step?: number
  placeholder?: string
  disabled?: boolean
  className?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

export function NumberInput({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  disabled,
  className = '',
  ...props
}: NumberInputProps) {
  const numValue = value === '' ? undefined : value

  const handleDecrement = () => {
    if (disabled) return
    const current = numValue ?? (min != null ? min : 0)
    const next = current - step
    if (min != null && next < min) return
    onChange(next)
  }

  const handleIncrement = () => {
    if (disabled) return
    const current = numValue ?? (min != null ? min : 0)
    const next = current + step
    if (max != null && next > max) return
    onChange(next)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (raw === '') {
      onChange(undefined)
      return
    }
    const parsed = Number(raw)
    if (isNaN(parsed)) return
    if (min != null && parsed < min) return
    if (max != null && parsed > max) return
    onChange(parsed)
  }

  return (
    <div
      className={`flex items-center rounded-lg border border-white/10 bg-[#141414] overflow-hidden transition-colors focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || (min != null && (numValue ?? 0) <= min)}
        className="flex items-center justify-center h-10 w-10 bg-white/5 border-r border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Decrease"
        tabIndex={-1}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </button>
      <input
        id={id}
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 h-10 bg-transparent text-white text-center text-sm focus:outline-none placeholder:text-white/40 disabled:cursor-not-allowed"
        {...props}
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || (max != null && (numValue ?? 0) >= max)}
        className="flex items-center justify-center h-10 w-10 bg-white/5 border-l border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Increase"
        tabIndex={-1}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}
