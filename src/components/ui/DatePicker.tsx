'use client'

import { useState, useRef, useEffect } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { DayPicker } from 'react-day-picker'
import { format, parse, isValid } from 'date-fns'
import { zhCN, ja, enUS } from 'react-day-picker/locale'

export interface DatePickerProps {
  id?: string
  value?: string  // ISO date string YYYY-MM-DD
  onChange?: (value: string) => void
  min?: string    // ISO date string
  max?: string    // ISO date string
  placeholder?: string
  locale?: 'zh' | 'ja' | 'en'
  disabled?: boolean
  className?: string
  embedded?: boolean
  required?: boolean
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

const localeMap = {
  zh: zhCN,
  ja: ja,
  en: enUS,
}

const placeholderMap = {
  zh: '请选择日期',
  ja: '日付を選択',
  en: 'Select date',
}

export function DatePicker({
  id,
  value,
  onChange,
  min,
  max,
  placeholder,
  locale = 'en',
  disabled,
  className = '',
  embedded,
  required,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const dateLocale = localeMap[locale]

  // Parse value to Date
  const selectedDate = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined
  const validSelected = selectedDate && isValid(selectedDate) ? selectedDate : undefined

  // Parse min/max
  const minDate = min ? parse(min, 'yyyy-MM-dd', new Date()) : undefined
  const maxDate = max ? parse(max, 'yyyy-MM-dd', new Date()) : undefined

  // Build disabled matcher
  const disabledMatcher: Array<{ before: Date } | { after: Date }> = []
  if (minDate && isValid(minDate)) {
    disabledMatcher.push({ before: minDate })
  }
  if (maxDate && isValid(maxDate)) {
    disabledMatcher.push({ after: maxDate })
  }

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange?.(format(date, 'yyyy-MM-dd'))
    }
    setOpen(false)
  }

  // Format display value
  const displayValue = validSelected
    ? locale === 'zh'
      ? format(validSelected, 'yyyy年M月d日')
      : locale === 'ja'
      ? format(validSelected, 'yyyy年M月d日')
      : format(validSelected, 'MMM d, yyyy')
    : ''

  const inputClassName = embedded
    ? `w-full rounded-lg border border-white/30 bg-white/10 px-3 py-2 pr-10 text-sm text-white placeholder:text-white/60 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 min-h-[44px] cursor-pointer ${className}`
    : `w-full rounded-lg border border-white/10 bg-[#141414] px-3 py-2 pr-10 text-sm text-white placeholder:text-white/40 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer ${className}`

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild disabled={disabled}>
        <div className="relative">
          <input
            id={id}
            type="text"
            readOnly
            value={displayValue}
            placeholder={placeholder || placeholderMap[locale]}
            disabled={disabled}
            required={required}
            className={inputClassName}
            aria-invalid={props['aria-invalid']}
            aria-describedby={props['aria-describedby']}
            onClick={() => !disabled && setOpen(true)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-[9999] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl p-4 animate-in fade-in-0 zoom-in-95"
          side={embedded ? 'top' : 'bottom'}
          sideOffset={8}
          align="start"
        >
          <DayPicker
            mode="single"
            selected={validSelected}
            onSelect={handleSelect}
            disabled={disabledMatcher.length > 0 ? disabledMatcher : undefined}
            locale={dateLocale}
            defaultMonth={validSelected || (minDate && isValid(minDate) ? minDate : undefined)}
            classNames={{
              root: 'text-white',
              months: 'flex flex-col',
              month: 'space-y-4',
              month_caption: 'flex justify-between items-center px-2',
              caption_label: 'text-sm font-medium text-white',
              nav: 'flex gap-1',
              button_previous: 'p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors',
              button_next: 'p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors',
              chevron: 'h-4 w-4',
              month_grid: 'w-full border-collapse',
              weekdays: '',
              weekday: 'text-white/50 text-xs font-normal w-9 h-8',
              weeks: '',
              week: '',
              day: 'text-center p-0',
              day_button: 'h-9 w-9 rounded text-sm transition-colors hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-amber-500',
              selected: 'bg-amber-600 text-white hover:bg-amber-500 rounded',
              today: 'ring-1 ring-amber-500/50 rounded',
              disabled: 'text-white/20 hover:bg-transparent cursor-not-allowed',
              outside: 'text-white/20',
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
