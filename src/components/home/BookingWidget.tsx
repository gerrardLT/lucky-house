'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import * as Popover from '@radix-ui/react-popover'
import { Button, DatePicker, Checkbox } from '@/components/ui'
import type { Locale } from '@/types'

export interface BookingWidgetProps {
  /** CMS 可配置是否显示 */
  visible: boolean
  /** 当前语言 */
  locale: Locale
  /** 内嵌于 Hero 时为 true，移除外层 section 和标题，使用半透明深色背景 */
  embedded?: boolean
}

/** 获取本地化标签 */
function getLabels(locale: Locale) {
  const labels = {
    zh: {
      title: '快速预约',
      checkIn: '入住日期',
      checkOut: '退房日期',
      guests: '住客',
      adultsLabel: '成人',
      childrenLabel: '儿童',
      hasPet: '携带宠物',
      submit: '查看可用房型',
    },
    ja: {
      title: 'クイック予約',
      checkIn: 'チェックイン',
      checkOut: 'チェックアウト',
      guests: 'ゲスト',
      adultsLabel: '大人',
      childrenLabel: 'お子様',
      hasPet: 'ペット同伴',
      submit: '空室を検索',
    },
    en: {
      title: 'Quick Booking',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      guests: 'Guests',
      adultsLabel: 'Adults',
      childrenLabel: 'Children',
      hasPet: 'Bringing Pet',
      submit: 'Check Availability',
    },
  }
  return labels[locale]
}

/** NumberInput 控件：+/- 按钮 */
function NumberInput({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  label: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>
        <span className="w-6 text-center text-sm font-medium text-white">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  )
}

/**
 * BookingWidget 快速预约组件
 *
 * 首页快速预约表单：入住/退房日期、住客数（成人+儿童）、是否携宠。
 * 提交后跳转到 /[locale]/booking 并带上 URL 参数预填。
 * CMS 可通过 visible=false 隐藏该组件。
 *
 * embedded 模式：内嵌于 HeroSection，移除外层 section 和标题，
 * 使用半透明深色背景 + 白色文字，桌面端横向单行排列。
 */
export function BookingWidget({ visible, locale, embedded = false }: BookingWidgetProps) {
  const router = useRouter()
  const labels = getLabels(locale)

  // 默认日期：明天入住、后天退房
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dayAfter = new Date()
  dayAfter.setDate(dayAfter.getDate() + 2)

  const [checkIn, setCheckIn] = useState(tomorrow.toISOString().split('T')[0])
  const [checkOut, setCheckOut] = useState(dayAfter.toISOString().split('T')[0])
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [hasPet, setHasPet] = useState(false)

  // CMS 配置隐藏时不渲染
  if (!visible) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
      hasPet: String(hasPet),
    })
    router.push(`/${locale}/stay?${params.toString()}`)
  }

  // 今天的 ISO 日期字符串（用于 min 属性）
  const today = new Date().toISOString().split('T')[0]

  // 样式配置：内嵌模式 vs 独立模式
  const formClassName = embedded
    ? 'flex flex-col gap-4 rounded-xl bg-black/60 backdrop-blur-md p-6 lg:flex-row lg:items-end lg:gap-3'
    : 'flex flex-col gap-4 rounded-2xl bg-stone-800 p-6 shadow-lg border border-stone-700 lg:flex-row lg:items-end lg:gap-3'

  const labelClassName = embedded
    ? 'text-sm font-medium text-white'
    : 'text-sm font-medium text-stone-300'

  const checkboxLabelClassName = embedded
    ? 'text-sm font-medium text-white'
    : 'text-sm font-medium text-stone-300'

  // Guests Popover 触发按钮样式（与 DatePicker 输入框一致）
  const guestsTriggerClassName = embedded
    ? 'flex items-center justify-between w-full rounded-lg border px-3 py-2 text-sm text-white min-h-[44px] cursor-pointer transition-all duration-200 border-white/30 bg-white/10 hover:border-white/50 data-[state=open]:border-amber-500 data-[state=open]:bg-white/10 data-[state=open]:ring-2 data-[state=open]:ring-amber-500'
    : 'flex items-center justify-between w-full rounded-lg border px-3 py-2 text-sm text-white min-h-[44px] cursor-pointer transition-all duration-200 border-white/10 bg-[#141414] hover:border-white/20 data-[state=open]:border-amber-500 data-[state=open]:bg-[#141414] data-[state=open]:ring-2 data-[state=open]:ring-amber-500'

  // Guests 显示文本
  const guestsDisplayText = `${adults} ${labels.adultsLabel} · ${children} ${labels.childrenLabel}`

  // 内嵌模式下的表单内容
  const formContent = (
    <form onSubmit={handleSubmit} className={formClassName}>
      {/* 入住日期 */}
      <div className="flex flex-1 flex-col gap-1">
        <label htmlFor="bw-checkin" className={labelClassName}>
          {labels.checkIn}
        </label>
        <DatePicker
          id="bw-checkin"
          value={checkIn}
          onChange={setCheckIn}
          min={today}
          locale={locale}
          embedded={embedded}
          required
        />
      </div>

      {/* 退房日期 */}
      <div className="flex flex-1 flex-col gap-1">
        <label htmlFor="bw-checkout" className={labelClassName}>
          {labels.checkOut}
        </label>
        <DatePicker
          id="bw-checkout"
          value={checkOut}
          onChange={setCheckOut}
          min={checkIn || today}
          locale={locale}
          embedded={embedded}
          required
        />
      </div>

      {/* 住客数 - Guests Popover */}
      <div className="flex flex-1 flex-col gap-1">
        <label className={labelClassName}>
          {labels.guests}
        </label>
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              type="button"
              className={guestsTriggerClassName}
            >
              <span className="text-white">{guestsDisplayText}</span>
              <svg
                className="h-4 w-4 text-white/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="z-[9999] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl p-4 min-w-[280px] w-[var(--radix-popover-trigger-width)] space-y-4"
              side="top"
              sideOffset={8}
              align="start"
            >
              <NumberInput
                value={adults}
                min={1}
                max={6}
                onChange={setAdults}
                label={labels.adultsLabel}
              />
              <NumberInput
                value={children}
                min={0}
                max={4}
                onChange={setChildren}
                label={labels.childrenLabel}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      {/* 携带宠物 */}
      <div className="flex flex-1 items-center gap-2 lg:pb-0.5">
        <Checkbox
          id="bw-pet"
          checked={hasPet}
          onCheckedChange={setHasPet}
        />
        <label htmlFor="bw-pet" className={checkboxLabelClassName}>
          {labels.hasPet}
        </label>
      </div>

      {/* 提交按钮 */}
      <div className="lg:pb-0">
        <Button type="submit" variant="primary" size="md" className="w-full lg:w-auto min-h-[44px]">
          {labels.submit}
        </Button>
      </div>
    </form>
  )

  // 内嵌模式：不渲染外层 section 和标题
  if (embedded) {
    return formContent
  }

  // 独立模式：保留外层 section 和标题（深色主题适配）
  return (
    <section className="mx-auto max-w-5xl px-4 py-8" aria-labelledby="booking-widget-title">
      <h2 id="booking-widget-title" className="sr-only">
        {labels.title}
      </h2>
      {formContent}
    </section>
  )
}
