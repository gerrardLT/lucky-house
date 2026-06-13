'use client'

import { Select } from '@/components/ui'
import type { Step4Data } from '@/lib/schemas/booking'
import type { Locale } from '@/types'

interface Step4Props {
  data: Partial<Step4Data>
  errors: Record<string, string>
  locale: Locale
  onChange: (field: string, value: unknown) => void
}

const labels: Record<Locale, Record<string, string>> = {
  zh: {
    title: '联系方式',
    name: '姓名',
    namePlaceholder: '请输入您的姓名',
    email: '邮箱',
    emailPlaceholder: 'example@email.com',
    phone: '电话',
    phonePlaceholder: '+86 13800138000',
    country: '国家/地区',
    countryPlaceholder: '请选择',
    preferredChannel: '首选联系渠道',
    channelEmail: '邮件',
    channelPhone: '电话',
    channelLine: 'LINE',
    channelWechat: '微信',
    channelWhatsapp: 'WhatsApp',
  },
  ja: {
    title: '連絡先',
    name: 'お名前',
    namePlaceholder: 'お名前を入力してください',
    email: 'メールアドレス',
    emailPlaceholder: 'example@email.com',
    phone: '電話番号',
    phonePlaceholder: '+81 90-1234-5678',
    country: '国/地域',
    countryPlaceholder: '選択してください',
    preferredChannel: 'ご希望の連絡方法',
    channelEmail: 'メール',
    channelPhone: '電話',
    channelLine: 'LINE',
    channelWechat: 'WeChat',
    channelWhatsapp: 'WhatsApp',
  },
  en: {
    title: 'Contact Information',
    name: 'Full Name',
    namePlaceholder: 'Enter your name',
    email: 'Email',
    emailPlaceholder: 'example@email.com',
    phone: 'Phone',
    phonePlaceholder: '+1 234-567-8900',
    country: 'Country/Region',
    countryPlaceholder: 'Select',
    preferredChannel: 'Preferred Contact Channel',
    channelEmail: 'Email',
    channelPhone: 'Phone',
    channelLine: 'LINE',
    channelWechat: 'WeChat',
    channelWhatsapp: 'WhatsApp',
  },
}

const countries = [
  { value: 'CN', zh: '中国', ja: '中国', en: 'China' },
  { value: 'JP', zh: '日本', ja: '日本', en: 'Japan' },
  { value: 'US', zh: '美国', ja: 'アメリカ', en: 'United States' },
  { value: 'GB', zh: '英国', ja: 'イギリス', en: 'United Kingdom' },
  { value: 'AU', zh: '澳大利亚', ja: 'オーストラリア', en: 'Australia' },
  { value: 'KR', zh: '韩国', ja: '韓国', en: 'South Korea' },
  { value: 'TW', zh: '台湾', ja: '台湾', en: 'Taiwan' },
  { value: 'HK', zh: '香港', ja: '香港', en: 'Hong Kong' },
  { value: 'SG', zh: '新加坡', ja: 'シンガポール', en: 'Singapore' },
  { value: 'OTHER', zh: '其他', ja: 'その他', en: 'Other' },
]

const channels = [
  { value: 'email', key: 'channelEmail' },
  { value: 'phone', key: 'channelPhone' },
  { value: 'line', key: 'channelLine' },
  { value: 'wechat', key: 'channelWechat' },
  { value: 'whatsapp', key: 'channelWhatsapp' },
] as const

export function Step4Contact({ data, errors, locale, onChange }: Step4Props) {
  const t = labels[locale]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">{t.title}</h2>

      {/* Name */}
      <div>
        <label htmlFor="contactName" className="block text-sm font-medium text-stone-300 mb-1">
          {t.name} <span className="text-red-500">*</span>
        </label>
        <input
          id="contactName"
          type="text"
          maxLength={60}
          value={data.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder={t.namePlaceholder}
          className={`w-full rounded-lg border px-3 py-2 text-white bg-[#141414] focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            errors.name ? 'border-red-500' : 'border-white/10'
          }`}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contactName-error' : undefined}
        />
        {errors.name && (
          <p id="contactName-error" className="mt-1 text-sm text-red-600" role="alert">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contactEmail" className="block text-sm font-medium text-stone-300 mb-1">
          {t.email} <span className="text-red-500">*</span>
        </label>
        <input
          id="contactEmail"
          type="email"
          value={data.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder={t.emailPlaceholder}
          className={`w-full rounded-lg border px-3 py-2 text-white bg-[#141414] focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            errors.email ? 'border-red-500' : 'border-white/10'
          }`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'contactEmail-error' : undefined}
        />
        {errors.email && (
          <p id="contactEmail-error" className="mt-1 text-sm text-red-600" role="alert">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="contactPhone" className="block text-sm font-medium text-stone-300 mb-1">
          {t.phone} <span className="text-red-500">*</span>
        </label>
        <input
          id="contactPhone"
          type="tel"
          value={data.phone || ''}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder={t.phonePlaceholder}
          className={`w-full rounded-lg border px-3 py-2 text-white bg-[#141414] focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            errors.phone ? 'border-red-500' : 'border-white/10'
          }`}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'contactPhone-error' : undefined}
        />
        {errors.phone && (
          <p id="contactPhone-error" className="mt-1 text-sm text-red-600" role="alert">{errors.phone}</p>
        )}
      </div>

      {/* Country */}
      <div>
        <label htmlFor="contactCountry" className="block text-sm font-medium text-stone-300 mb-1">
          {t.country} <span className="text-red-500">*</span>
        </label>
        <Select
          id="contactCountry"
          value={data.country || ''}
          options={[
            { value: '', label: t.countryPlaceholder },
            ...countries.map((c) => ({ value: c.value, label: c[locale] })),
          ]}
          onChange={(v) => onChange('country', v)}
          aria-invalid={!!errors.country}
          aria-describedby={errors.country ? 'contactCountry-error' : undefined}
        />
        {errors.country && (
          <p id="contactCountry-error" className="mt-1 text-sm text-red-600" role="alert">{errors.country}</p>
        )}
      </div>

      {/* Preferred Channel */}
      <div>
        <fieldset>
          <legend className="block text-sm font-medium text-stone-300 mb-2">
            {t.preferredChannel}
          </legend>
          <div className="flex flex-wrap gap-3">
            {channels.map((ch) => (
              <label
                key={ch.value}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer text-sm transition-colors ${
                  (data.preferredChannel || 'email') === ch.value
                    ? 'border-amber-500 bg-amber-900/20 text-amber-400'
                    : 'border-white/10 hover:border-white/20 text-stone-400'
                }`}
              >
                <input
                  type="radio"
                  name="preferredChannel"
                  value={ch.value}
                  checked={(data.preferredChannel || 'email') === ch.value}
                  onChange={() => onChange('preferredChannel', ch.value)}
                  className="sr-only"
                />
                {t[ch.key]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  )
}
