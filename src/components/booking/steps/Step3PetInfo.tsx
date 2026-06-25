'use client'

import { Select, RadioGroup, RadioGroupItem, Checkbox, NumberInput } from '@/components/ui'
import type { Step3Data } from '@/lib/schemas/booking'
import type { Locale } from '@/types'

interface Step3Props {
  data: Partial<Step3Data>
  errors: Record<string, string>
  locale: Locale
  onChange: (field: string, value: unknown) => void
}

const labels: Record<Locale, Record<string, string>> = {
  zh: {
    title: '宠物信息',
    petType: '宠物类型',
    dog: '狗',
    cat: '猫',
    other: '其他',
    breed: '品种',
    breedPlaceholder: '如：金毛寻回犬',
    count: '宠物数量',
    weight: '体重 (kg)',
    age: '年龄 (岁)',
    vaccineStatus: '疫苗证明状态',
    rabiesStatus: '狂犬证明状态',
    ready: '已准备',
    can_provide: '可补交',
    unsure: '不确定',
    needOnsen: '是否需要宠物温泉',
    needGrooming: '是否需要梳理服务',
    specialNotes: '特殊说明',
    specialNotesPlaceholder: '如宠物特殊需求或注意事项（最多300字）',
  },
  ja: {
    title: 'ペット情報',
    petType: 'ペットの種類',
    dog: '犬',
    cat: '猫',
    other: 'その他',
    breed: '犬種/猫種',
    breedPlaceholder: '例：ゴールデンレトリバー',
    count: 'ペット数',
    weight: '体重 (kg)',
    age: '年齢 (歳)',
    vaccineStatus: 'ワクチン証明',
    rabiesStatus: '狂犬病証明',
    ready: '準備済み',
    can_provide: '後日提出可',
    unsure: '不明',
    needOnsen: 'ペット温泉を利用しますか？',
    needGrooming: 'グルーミングサービスを利用しますか？',
    specialNotes: '特記事項',
    specialNotesPlaceholder: 'ペットの特別なニーズや注意事項（最大300文字）',
  },
  en: {
    title: 'Pet Information',
    petType: 'Pet Type',
    dog: 'Dog',
    cat: 'Cat',
    other: 'Other',
    breed: 'Breed',
    breedPlaceholder: 'e.g., Golden Retriever',
    count: 'Number of Pets',
    weight: 'Weight (kg)',
    age: 'Age (years)',
    vaccineStatus: 'Vaccination Certificate',
    rabiesStatus: 'Rabies Certificate',
    ready: 'Ready',
    can_provide: 'Can provide later',
    unsure: 'Not sure',
    needOnsen: 'Need pet onsen service?',
    needGrooming: 'Need grooming service?',
    specialNotes: 'Special Notes',
    specialNotesPlaceholder: 'Any special needs or notes about your pet (max 300 chars)',
  },
}

const petTypes = ['dog', 'cat', 'other'] as const
const vaccineOptions = ['ready', 'can_provide', 'unsure'] as const

export function Step3PetInfo({ data, errors, locale, onChange }: Step3Props) {
  const t = labels[locale]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">{t.title}</h2>

      {/* Pet Type */}
      <div>
        <fieldset>
          <legend className="block text-sm font-medium text-stone-300 mb-2">
            {t.petType} <span className="text-red-500">*</span>
          </legend>
          <RadioGroup
            value={data.petType || ''}
            onValueChange={(v) => onChange('petType', v)}
            className="flex gap-4 flex-wrap"
          >
            {petTypes.map((type) => (
              <RadioGroupItem key={type} value={type} id={`petType-${type}`}>
                {t[type]}
              </RadioGroupItem>
            ))}
          </RadioGroup>
          {errors.petType && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.petType}</p>
          )}
        </fieldset>
      </div>

      {/* Breed */}
      <div>
        <label htmlFor="breed" className="block text-sm font-medium text-stone-300 mb-1">
          {t.breed} <span className="text-red-500">*</span>
        </label>
        <input
          id="breed"
          type="text"
          maxLength={50}
          value={data.breed || ''}
          onChange={(e) => onChange('breed', e.target.value)}
          placeholder={t.breedPlaceholder}
          className={`w-full rounded-lg border px-3 py-2 text-white bg-[#141414] focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            errors.breed ? 'border-red-500' : 'border-white/10'
          }`}
          aria-invalid={!!errors.breed}
          aria-describedby={errors.breed ? 'breed-error' : undefined}
        />
        {errors.breed && (
          <p id="breed-error" className="mt-1 text-sm text-red-600" role="alert">{errors.breed}</p>
        )}
      </div>

      {/* Count / Weight / Age */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="petInfoCount" className="block text-sm font-medium text-stone-300 mb-1">
            {t.count} <span className="text-red-500">*</span>
          </label>
          <Select
            id="petInfoCount"
            locale={locale}
            value={data.count ?? 1}
            options={[1, 2, 3].map((n) => ({ value: n, label: String(n) }))}
            onChange={(v) => onChange('count', Number(v))}
            aria-invalid={!!errors.count}
            aria-describedby={errors.count ? 'count-error' : undefined}
          />
          {errors.count && (
            <p id="count-error" className="mt-1 text-sm text-red-600" role="alert">{errors.count}</p>
          )}
        </div>
        <div>
          <label htmlFor="petWeight" className="block text-sm font-medium text-stone-300 mb-1">
            {t.weight} <span className="text-red-500">*</span>
          </label>
          <NumberInput
            id="petWeight"
            value={data.weight ?? ''}
            onChange={(v) => onChange('weight', v)}
            min={0.5}
            max={80}
            step={0.5}
            aria-invalid={!!errors.weight}
            aria-describedby={errors.weight ? 'weight-error' : undefined}
          />
          {errors.weight && (
            <p id="weight-error" className="mt-1 text-sm text-red-600" role="alert">{errors.weight}</p>
          )}
        </div>
        <div>
          <label htmlFor="petAge" className="block text-sm font-medium text-stone-300 mb-1">
            {t.age} <span className="text-red-500">*</span>
          </label>
          <NumberInput
            id="petAge"
            value={data.age ?? ''}
            onChange={(v) => onChange('age', v)}
            min={0}
            max={30}
            step={0.5}
            aria-invalid={!!errors.age}
            aria-describedby={errors.age ? 'age-error' : undefined}
          />
          {errors.age && (
            <p id="age-error" className="mt-1 text-sm text-red-600" role="alert">{errors.age}</p>
          )}
        </div>
      </div>

      {/* Vaccine Status / Rabies Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vaccineStatus" className="block text-sm font-medium text-stone-300 mb-1">
            {t.vaccineStatus} <span className="text-red-500">*</span>
          </label>
          <Select
            id="vaccineStatus"
            locale={locale}
            value={data.vaccineStatus || 'placeholder'}
            options={[
              { value: 'placeholder', label: '--' },
              ...vaccineOptions.map((opt) => ({ value: opt, label: t[opt] })),
            ]}
            onChange={(v) => onChange('vaccineStatus', v === 'placeholder' ? '' : v)}
            aria-invalid={!!errors.vaccineStatus}
            aria-describedby={errors.vaccineStatus ? 'vaccineStatus-error' : undefined}
          />
          {errors.vaccineStatus && (
            <p id="vaccineStatus-error" className="mt-1 text-sm text-red-600" role="alert">{errors.vaccineStatus}</p>
          )}
        </div>
        <div>
          <label htmlFor="rabiesStatus" className="block text-sm font-medium text-stone-300 mb-1">
            {t.rabiesStatus} <span className="text-red-500">*</span>
          </label>
          <Select
            id="rabiesStatus"
            locale={locale}
            value={data.rabiesStatus || 'placeholder'}
            options={[
              { value: 'placeholder', label: '--' },
              ...vaccineOptions.map((opt) => ({ value: opt, label: t[opt] })),
            ]}
            onChange={(v) => onChange('rabiesStatus', v === 'placeholder' ? '' : v)}
            aria-invalid={!!errors.rabiesStatus}
            aria-describedby={errors.rabiesStatus ? 'rabiesStatus-error' : undefined}
          />
          {errors.rabiesStatus && (
            <p id="rabiesStatus-error" className="mt-1 text-sm text-red-600" role="alert">{errors.rabiesStatus}</p>
          )}
        </div>
      </div>

      {/* Optional Services */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Checkbox
            id="needOnsen"
            checked={data.needOnsen ?? false}
            onCheckedChange={(v) => onChange('needOnsen', v)}
          />
          <label htmlFor="needOnsen" className="text-stone-300 cursor-pointer">
            {t.needOnsen}
          </label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            id="needGrooming"
            checked={data.needGrooming ?? false}
            onCheckedChange={(v) => onChange('needGrooming', v)}
          />
          <label htmlFor="needGrooming" className="text-stone-300 cursor-pointer">
            {t.needGrooming}
          </label>
        </div>
      </div>

      {/* Special Notes */}
      <div>
        <label htmlFor="specialNotes" className="block text-sm font-medium text-stone-300 mb-1">
          {t.specialNotes}
        </label>
        <textarea
          id="specialNotes"
          maxLength={300}
          rows={3}
          value={data.specialNotes || ''}
          onChange={(e) => onChange('specialNotes', e.target.value)}
          placeholder={t.specialNotesPlaceholder}
          className={`w-full rounded-lg border px-3 py-2 text-white bg-[#141414] focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            errors.specialNotes ? 'border-red-500' : 'border-white/10'
          }`}
          aria-invalid={!!errors.specialNotes}
          aria-describedby={errors.specialNotes ? 'specialNotes-error' : undefined}
        />
        {errors.specialNotes && (
          <p id="specialNotes-error" className="mt-1 text-sm text-red-600" role="alert">{errors.specialNotes}</p>
        )}
        <p className="mt-1 text-xs text-stone-400">
          {(data.specialNotes || '').length}/300
        </p>
      </div>
    </div>
  )
}
