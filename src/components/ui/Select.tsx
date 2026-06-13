'use client'

import * as SelectPrimitive from '@radix-ui/react-select'

export interface SelectOption {
  value: string | number
  label: string
}

export interface SelectProps {
  id?: string
  value: string | number
  options: SelectOption[]
  onChange: (value: string | number) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  'aria-invalid'?: boolean
  'aria-describedby'?: string
  /** 嵌入模式（如 Hero 中的 BookingWidget） */
  embedded?: boolean
}

export function Select({
  id,
  value,
  options,
  onChange,
  placeholder = '请选择',
  className = '',
  disabled = false,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby,
  embedded = false,
}: SelectProps) {
  const triggerClassName = embedded
    ? `flex items-center justify-between w-full rounded-lg border px-3 py-2 text-sm text-white min-h-[44px] cursor-pointer transition-all duration-200 data-[placeholder]:text-white/60 ${
        ariaInvalid
          ? 'border-red-500 bg-white/10'
          : 'border-white/30 bg-white/10 hover:border-white/50 data-[state=open]:border-amber-500 data-[state=open]:ring-2 data-[state=open]:ring-amber-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
    : `flex items-center justify-between w-full rounded-lg border px-3 py-2 text-sm text-white min-h-[44px] cursor-pointer transition-all duration-200 data-[placeholder]:text-white/60 ${
        ariaInvalid
          ? 'border-red-500 bg-[#141414]'
          : 'border-white/10 bg-[#141414] hover:border-white/20 data-[state=open]:border-amber-500 data-[state=open]:ring-2 data-[state=open]:ring-amber-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`

  return (
    <div className={className}>
      <SelectPrimitive.Root
        value={String(value) || undefined}
        onValueChange={(v) => {
          const original = options.find((opt) => String(opt.value) === v)
          onChange(original ? original.value : v)
        }}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          id={id}
          className={triggerClassName}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <svg
              className="h-4 w-4 text-white/60 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="z-[9999] rounded-lg border border-white/10 bg-[#1a1a1a] shadow-xl backdrop-blur-sm overflow-hidden min-w-[var(--radix-select-trigger-width)]"
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="max-h-[200px]">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={String(option.value)}
                  value={String(option.value)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-white cursor-pointer outline-none data-[highlighted]:bg-white/10 data-[state=checked]:text-amber-400"
                >
                  <SelectPrimitive.ItemIndicator>
                    <svg
                      className="h-4 w-4 text-amber-400 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  )
}
