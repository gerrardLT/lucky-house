'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui'
import type { Step2Data } from '@/lib/schemas/booking'
import type { Locale } from '@/types'

interface Step2Props {
  data: Partial<Step2Data>
  errors: Record<string, string>
  locale: Locale
  onChange: (field: string, value: unknown) => void
}

const labels: Record<Locale, Record<string, string>> = {
  zh: {
    title: '房型偏好',
    roomPreference: '偏好房型',
    standard: '普通房',
    'pet-friendly': '宠物友好房',
    villa: '营地小别墅',
    'no-preference': '无偏好',
    acceptAlternative: '如首选房型不可用，是否接受替代房型？',
    yes: '是',
    no: '否',
  },
  ja: {
    title: 'お部屋の希望',
    roomPreference: '希望のお部屋タイプ',
    standard: 'スタンダードルーム',
    'pet-friendly': 'ペットフレンドリールーム',
    villa: 'キャンプヴィラ',
    'no-preference': '特にこだわりなし',
    acceptAlternative: 'ご希望のお部屋が利用できない場合、代替をお受けになりますか？',
    yes: 'はい',
    no: 'いいえ',
  },
  en: {
    title: 'Room Preference',
    roomPreference: 'Preferred Room Type',
    standard: 'Standard Room',
    'pet-friendly': 'Pet-Friendly Room',
    villa: 'Campsite Villa',
    'no-preference': 'No Preference',
    acceptAlternative: 'Accept alternative room if preferred is unavailable?',
    yes: 'Yes',
    no: 'No',
  },
}

const roomOptions = ['standard', 'pet-friendly', 'villa', 'no-preference'] as const

export function Step2RoomPreference({ data, errors, locale, onChange }: Step2Props) {
  const t = labels[locale]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">{t.title}</h2>

      {/* Room Preference */}
      <div>
        <fieldset>
          <legend className="block text-sm font-medium text-stone-300 mb-3">
            {t.roomPreference} <span className="text-red-500">*</span>
          </legend>
          <RadioGroup
            value={data.roomPreference || ''}
            onValueChange={(v) => onChange('roomPreference', v)}
            className="space-y-2"
          >
            {roomOptions.map((option) => (
              <label
                key={option}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  data.roomPreference === option
                    ? 'border-amber-500 bg-amber-900/20'
                    : 'border-stone-600 hover:border-stone-500'
                }`}
              >
                <RadioGroupItem value={option} id={`room-${option}`}>
                  {t[option]}
                </RadioGroupItem>
              </label>
            ))}
          </RadioGroup>
          {errors.roomPreference && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.roomPreference}
            </p>
          )}
        </fieldset>
      </div>

      {/* Accept Alternative */}
      <div>
        <fieldset>
          <legend className="block text-sm font-medium text-stone-300 mb-2">
            {t.acceptAlternative}
          </legend>
          <RadioGroup
            value={data.acceptAlternative !== false ? 'true' : 'false'}
            onValueChange={(v) => onChange('acceptAlternative', v === 'true')}
            className="flex gap-4"
          >
            <RadioGroupItem value="true" id="acceptAlt-yes">
              {t.yes}
            </RadioGroupItem>
            <RadioGroupItem value="false" id="acceptAlt-no">
              {t.no}
            </RadioGroupItem>
          </RadioGroup>
        </fieldset>
      </div>
    </div>
  )
}
