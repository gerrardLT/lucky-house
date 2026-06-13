'use client'

import { Checkbox } from '@/components/ui'
import type { Step5Data } from '@/lib/schemas/booking'
import type { Locale, FAQ } from '@/types'

interface Step5Props {
  data: Partial<Step5Data>
  errors: Record<string, string>
  locale: Locale
  hasPet: boolean
  faqRules?: FAQ[]
  onChange: (field: string, value: unknown) => void
}

const labels: Record<Locale, Record<string, string>> = {
  zh: {
    title: '规则确认',
    privacyPolicy: '我已阅读并同意',
    privacyPolicyLink: '隐私政策',
    petRules: '我已阅读并同意',
    petRulesLink: '宠物入住规则',
    cancelPolicy: '我已阅读并同意',
    cancelPolicyLink: '取消与退款政策',
    marketingSubscribe: '我愿意接收营销邮件和活动通知',
    marketingNote: '（可随时取消订阅）',
    rulesTitle: '相关规则摘要',
  },
  ja: {
    title: 'ルール確認',
    privacyPolicy: '以下を読み、同意します：',
    privacyPolicyLink: 'プライバシーポリシー',
    petRules: '以下を読み、同意します：',
    petRulesLink: 'ペット宿泊ルール',
    cancelPolicy: '以下を読み、同意します：',
    cancelPolicyLink: 'キャンセル・返金ポリシー',
    marketingSubscribe: 'マーケティングメールやイベント通知を受け取る',
    marketingNote: '（いつでも配信停止できます）',
    rulesTitle: '関連ルールの概要',
  },
  en: {
    title: 'Agreements',
    privacyPolicy: 'I have read and agree to the',
    privacyPolicyLink: 'Privacy Policy',
    petRules: 'I have read and agree to the',
    petRulesLink: 'Pet Stay Rules',
    cancelPolicy: 'I have read and agree to the',
    cancelPolicyLink: 'Cancellation & Refund Policy',
    marketingSubscribe: 'I would like to receive marketing emails and event notifications',
    marketingNote: '(You can unsubscribe at any time)',
    rulesTitle: 'Related Rules Summary',
  },
}

export function Step5Agreements({ data, errors, locale, hasPet, faqRules, onChange }: Step5Props) {
  const t = labels[locale]

  // Filter pet-related and cancel-related FAQ rules from the unified data source
  const petFaqRules = faqRules?.filter((faq) => faq.category === 'pet') || []
  const cancelFaqRules = faqRules?.filter((faq) => faq.category === 'cancel') || []

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">{t.title}</h2>

      {/* Rules summary from faq.json unified data source */}
      {(petFaqRules.length > 0 || cancelFaqRules.length > 0) && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-medium text-stone-300">{t.rulesTitle}</h3>
          <div className="space-y-2 text-sm text-stone-400">
            {hasPet && petFaqRules.slice(0, 3).map((faq) => (
              <details key={faq.id} className="group">
                <summary className="cursor-pointer font-medium text-stone-300 hover:text-amber-400">
                  {faq.question[locale]}
                </summary>
                <p className="mt-1 pl-4 text-stone-500">{faq.answer[locale]}</p>
              </details>
            ))}
            {cancelFaqRules.slice(0, 2).map((faq) => (
              <details key={faq.id} className="group">
                <summary className="cursor-pointer font-medium text-stone-300 hover:text-amber-400">
                  {faq.question[locale]}
                </summary>
                <p className="mt-1 pl-4 text-stone-500">{faq.answer[locale]}</p>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Policy */}
      <div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="privacyPolicy"
            checked={data.privacyPolicy ?? false}
            onCheckedChange={(v) => onChange('privacyPolicy', v)}
            aria-describedby={errors.privacyPolicy ? 'privacyPolicy-error' : undefined}
          />
          <label htmlFor="privacyPolicy" className="text-sm text-stone-300 cursor-pointer">
            {t.privacyPolicy}{' '}
            <a
              href={`/${locale}/privacy`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 underline hover:text-amber-300"
            >
              {t.privacyPolicyLink}
            </a>
            {' '}<span className="text-red-500">*</span>
          </label>
        </div>
        {errors.privacyPolicy && (
          <p id="privacyPolicy-error" className="mt-1 ml-8 text-sm text-red-600" role="alert">
            {errors.privacyPolicy}
          </p>
        )}
      </div>

      {/* Pet Rules (conditional: only when hasPet === true) */}
      {hasPet && (
        <div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="petRules"
              checked={data.petRules ?? false}
              onCheckedChange={(v) => onChange('petRules', v)}
              aria-describedby={errors.petRules ? 'petRules-error' : undefined}
            />
            <label htmlFor="petRules" className="text-sm text-stone-300 cursor-pointer">
              {t.petRules}{' '}
              <a
                href={`/${locale}/pet-rules`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 underline hover:text-amber-300"
              >
                {t.petRulesLink}
              </a>
              {' '}<span className="text-red-500">*</span>
            </label>
          </div>
          {errors.petRules && (
            <p id="petRules-error" className="mt-1 ml-8 text-sm text-red-600" role="alert">
              {errors.petRules}
            </p>
          )}
        </div>
      )}

      {/* Cancel Policy */}
      <div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="cancelPolicy"
            checked={data.cancelPolicy ?? false}
            onCheckedChange={(v) => onChange('cancelPolicy', v)}
            aria-describedby={errors.cancelPolicy ? 'cancelPolicy-error' : undefined}
          />
          <label htmlFor="cancelPolicy" className="text-sm text-stone-300 cursor-pointer">
            {t.cancelPolicy}{' '}
            <a
              href={`/${locale}/terms`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 underline hover:text-amber-300"
            >
              {t.cancelPolicyLink}
            </a>
            {' '}<span className="text-red-500">*</span>
          </label>
        </div>
        {errors.cancelPolicy && (
          <p id="cancelPolicy-error" className="mt-1 ml-8 text-sm text-red-600" role="alert">
            {errors.cancelPolicy}
          </p>
        )}
      </div>

      {/* Marketing Subscribe - MUST be defaultChecked={false} */}
      <div className="pt-2 border-t border-white/10">
        <div className="flex items-start gap-3">
          <Checkbox
            id="marketingSubscribe"
            checked={data.marketingSubscribe ?? false}
            onCheckedChange={(v) => onChange('marketingSubscribe', v)}
          />
          <label htmlFor="marketingSubscribe" className="text-sm text-stone-400 cursor-pointer">
            {t.marketingSubscribe}
            <br />
            <span className="text-xs text-stone-400">{t.marketingNote}</span>
          </label>
        </div>
      </div>
    </div>
  )
}
