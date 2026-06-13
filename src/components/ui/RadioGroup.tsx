'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'

export interface RadioGroupProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

export interface RadioGroupItemProps {
  value: string
  id?: string
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export function RadioGroup({ value, defaultValue, onValueChange, name, disabled, className = '', children }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      name={name}
      disabled={disabled}
      className={className}
    >
      {children}
    </RadioGroupPrimitive.Root>
  )
}

export function RadioGroupItem({ value, id, disabled, className = '', children }: RadioGroupItemProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <RadioGroupPrimitive.Item
        value={value}
        id={id}
        disabled={disabled}
        className="h-5 w-5 shrink-0 rounded-full border border-white/30 bg-white/5 transition-all duration-200 hover:border-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] data-[state=checked]:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {children && (
        <label htmlFor={id} className="text-sm text-stone-300 cursor-pointer">
          {children}
        </label>
      )}
    </div>
  )
}
