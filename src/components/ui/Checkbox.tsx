'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

export interface CheckboxProps {
  id?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  'aria-describedby'?: string
}

export function Checkbox({ id, checked, defaultChecked, onCheckedChange, disabled, className = '', ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={(v) => onCheckedChange?.(v === true)}
      disabled={disabled}
      className={`h-5 w-5 shrink-0 rounded border border-white/30 bg-white/5 transition-all duration-200 hover:border-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
