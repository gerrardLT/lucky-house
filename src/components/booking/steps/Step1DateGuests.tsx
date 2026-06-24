'use client'

import { Select, DatePicker, RadioGroup, RadioGroupItem } from '@/components/ui'
import type { Step1Data } from '@/lib/schemas/booking'
import type { Locale } from '@/types'

interface Step1Props {
  data: Partial<Step1Data>
  errors: Record<string, string>
  locale: Locale
  onChange: (field: string, value: unknown) => void
}

const labels: Record<Locale, Record<string, string>> = {
  zh: {
    title: '日期与人数',
    checkIn: '入住日期',
    checkOut: '退房日期',
    adults: '成人数',
    children: '儿童数',
    rooms: '房间数',
    hasPet: '是否携宠',
    petCount: '宠物数量',
    yes: '是',
    no: '否',
  },
  ja: {
    title: '日程と人数',
    checkIn: 'チェックイン日',
    checkOut: 'チェックアウト日',
    adults: '大人',
    children: 'お子様',
    rooms: '部屋数',
    hasPet: 'ペット同伴',
    petCount: 'ペット数',
    yes: 'はい',
    no: 'いいえ',
  },
  en: {
    title: 'Date & Guests',
    checkIn: 'Check-in Date',
    checkOut: 'Check-out Date',
    adults: 'Adults',
    children: 'Children',
    rooms: 'Rooms',
    hasPet: 'Traveling with Pet',
    petCount: 'Number of Pets',
    yes: 'Yes',
    no: 'No',
  },
}

export function Step1DateGuests({ data, errors, locale, onChange }: Step1Props) {
  const t = labels[locale]
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">{t.title}</h2>

      {/* Check-in / Check-out */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="checkIn" className="block text-sm font-medium text-stone-300 mb-1">
            {t.checkIn} <span className="text-red-500">*</span>
          </label>
          <DatePicker
            id="checkIn"
            value={data.checkIn || ''}
            onChange={(v) => onChange('checkIn', v)}
            min={today}
            locale={locale}
            aria-invalid={!!errors.checkIn}
            aria-describedby={errors.checkIn ? 'checkIn-error' : undefined}
          />
          {errors.checkIn && (
            <p id="checkIn-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.checkIn}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="checkOut" className="block text-sm font-medium text-stone-300 mb-1">
            {t.checkOut} <span className="text-red-500">*</span>
          </label>
          <DatePicker
            id="checkOut"
            value={data.checkOut || ''}
            onChange={(v) => onChange('checkOut', v)}
            min={data.checkIn || today}
            locale={locale}
            aria-invalid={!!errors.checkOut}
            aria-describedby={errors.checkOut ? 'checkOut-error' : undefined}
          />
          {errors.checkOut && (
            <p id="checkOut-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.checkOut}
            </p>
          )}
        </div>
      </div>

      {/* Adults / Children / Rooms */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="adults" className="block text-sm font-medium text-stone-300 mb-1">
            {t.adults} <span className="text-red-500">*</span>
          </label>
          <Select
            id="adults"
            locale={locale}
            value={data.adults ?? 1}
            options={[1, 2, 3, 4, 5, 6].map((n) => ({ value: n, label: String(n) }))}
            onChange={(v) => onChange('adults', Number(v))}
            aria-invalid={!!errors.adults}
            aria-describedby={errors.adults ? 'adults-error' : undefined}
          />
          {errors.adults && (
            <p id="adults-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.adults}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="children" className="block text-sm font-medium text-stone-300 mb-1">
            {t.children}
          </label>
          <Select
            id="children"
            locale={locale}
            value={data.children ?? 0}
            options={[0, 1, 2, 3, 4].map((n) => ({ value: n, label: String(n) }))}
            onChange={(v) => onChange('children', Number(v))}
            aria-invalid={!!errors.children}
            aria-describedby={errors.children ? 'children-error' : undefined}
          />
          {errors.children && (
            <p id="children-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.children}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="rooms" className="block text-sm font-medium text-stone-300 mb-1">
            {t.rooms} <span className="text-red-500">*</span>
          </label>
          <Select
            id="rooms"
            locale={locale}
            value={data.rooms ?? 1}
            options={[1, 2, 3].map((n) => ({ value: n, label: String(n) }))}
            onChange={(v) => onChange('rooms', Number(v))}
            aria-invalid={!!errors.rooms}
            aria-describedby={errors.rooms ? 'rooms-error' : undefined}
          />
          {errors.rooms && (
            <p id="rooms-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.rooms}
            </p>
          )}
        </div>
      </div>

      {/* Has Pet */}
      <div>
        <fieldset>
          <legend className="block text-sm font-medium text-stone-300 mb-2">
            {t.hasPet} <span className="text-red-500">*</span>
          </legend>
          <RadioGroup
            value={data.hasPet === true ? 'true' : data.hasPet === false ? 'false' : ''}
            onValueChange={(v) => onChange('hasPet', v === 'true')}
            className="flex gap-4"
          >
            <RadioGroupItem value="true" id="hasPet-yes">
              {t.yes}
            </RadioGroupItem>
            <RadioGroupItem value="false" id="hasPet-no">
              {t.no}
            </RadioGroupItem>
          </RadioGroup>
          {errors.hasPet && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.hasPet}
            </p>
          )}
        </fieldset>
      </div>

      {/* Pet Count (conditional) */}
      {data.hasPet && (
        <div>
          <label htmlFor="petCount" className="block text-sm font-medium text-stone-300 mb-1">
            {t.petCount} <span className="text-red-500">*</span>
          </label>
          <Select
            id="petCount"
            locale={locale}
            value={data.petCount ?? 1}
            options={[1, 2, 3].map((n) => ({ value: n, label: String(n) }))}
            onChange={(v) => onChange('petCount', Number(v))}
            aria-invalid={!!errors.petCount}
            aria-describedby={errors.petCount ? 'petCount-error' : undefined}
          />
          {errors.petCount && (
            <p id="petCount-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.petCount}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
