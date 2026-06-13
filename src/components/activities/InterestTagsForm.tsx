'use client'

import { useState } from 'react'
import type { Locale } from '@/types'
import { Button } from '@/components/ui/Button'

export interface InterestTagsFormProps {
  locale: Locale
}

/** 兴趣标签选项 */
const INTEREST_TAGS: Array<{ key: string; label: Record<Locale, string> }> = [
  { key: 'nature', label: { zh: '自然散步', ja: '自然散策', en: 'Nature Walks' } },
  { key: 'social', label: { zh: '宠物社交', ja: 'ペット交流', en: 'Pet Social' } },
  { key: 'wellness', label: { zh: '温泉养生', ja: '温泉ウェルネス', en: 'Onsen Wellness' } },
  { key: 'workshop', label: { zh: '摄影/工作坊', ja: '写真/ワークショップ', en: 'Photo/Workshop' } },
  { key: 'bbq', label: { zh: 'BBQ派对', ja: 'BBQパーティー', en: 'BBQ Party' } },
  { key: 'seasonal', label: { zh: '季节活动', ja: '季節イベント', en: 'Seasonal Events' } },
]

/**
 * InterestTagsForm 组件
 *
 * 会员兴趣标签登记功能：
 * 用户可选择想收到哪些活动类型的提醒，提交邮箱进行订阅。
 */
export function InterestTagsForm({ locale }: InterestTagsFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const toggleTag = (key: string) => {
    setSelectedTags((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 邮箱格式基础校验
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrorMessage(
        locale === 'zh'
          ? '请输入有效的邮箱地址'
          : locale === 'ja'
            ? '有効なメールアドレスを入力してください'
            : 'Please enter a valid email address'
      )
      setStatus('error')
      return
    }

    if (selectedTags.length === 0) {
      setErrorMessage(
        locale === 'zh'
          ? '请至少选择一个兴趣标签'
          : locale === 'ja'
            ? '少なくとも1つのタグを選択してください'
            : 'Please select at least one interest tag'
      )
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          interests: selectedTags,
          locale,
        }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
        setSelectedTags([])
      } else {
        setStatus('error')
        setErrorMessage(
          locale === 'zh'
            ? '提交失败，请稍后重试'
            : locale === 'ja'
              ? '送信に失敗しました。後ほどお試しください'
              : 'Submission failed. Please try again later.'
        )
      }
    } catch {
      setStatus('error')
      setErrorMessage(
        locale === 'zh'
          ? '网络错误，请检查连接后重试'
          : locale === 'ja'
            ? 'ネットワークエラー。接続を確認してください'
            : 'Network error. Please check your connection.'
      )
    }
  }

  const title = locale === 'zh'
    ? '会员兴趣标签'
    : locale === 'ja'
      ? '興味タグ登録'
      : 'Interest Tags'

  const subtitle = locale === 'zh'
    ? '选择感兴趣的活动类型，我们会第一时间通知您'
    : locale === 'ja'
      ? '興味のあるイベントタイプを選択すると、最新情報をお届けします'
      : 'Select activity types you\'re interested in and we\'ll notify you first'

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-amber-700/50 bg-amber-900/20 p-6 text-center">
        <p className="text-lg font-medium text-amber-400">
          {locale === 'zh'
            ? '🎉 兴趣登记成功！'
            : locale === 'ja'
              ? '🎉 登録完了！'
              : '🎉 Registration successful!'}
        </p>
        <p className="mt-2 text-sm text-amber-400/80">
          {locale === 'zh'
            ? '我们会在相关活动发布时通知您'
            : locale === 'ja'
              ? '関連イベント公開時にお知らせします'
              : 'We\'ll notify you when related activities are announced'}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#141414] p-6">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-1 text-sm text-stone-400">{subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* 兴趣标签选择 */}
        <fieldset>
          <legend className="sr-only">
            {locale === 'zh' ? '选择兴趣标签' : locale === 'ja' ? '興味タグを選択' : 'Select interest tags'}
          </legend>
          <div className="flex flex-wrap gap-2">
            {INTEREST_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag.key)
              return (
                <button
                  key={tag.key}
                  type="button"
                  onClick={() => toggleTag(tag.key)}
                  aria-pressed={isSelected}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                    isSelected
                      ? 'bg-amber-600 text-white'
                      : 'bg-[#141414] text-stone-300 border border-white/10 hover:bg-white/5'
                  }`}
                >
                  {tag.label[locale]}
                </button>
              )
            })}
          </div>
        </fieldset>

        {/* 邮箱输入 */}
        <div>
          <label htmlFor="interest-email" className="block text-sm font-medium text-stone-300">
            {locale === 'zh' ? '邮箱地址' : locale === 'ja' ? 'メールアドレス' : 'Email Address'}
          </label>
          <input
            id="interest-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={
              locale === 'zh'
                ? '请输入您的邮箱'
                : locale === 'ja'
                  ? 'メールアドレスを入力'
                  : 'Enter your email'
            }
            required
            className="mt-1 block w-full rounded-lg border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* 错误提示 */}
        {status === 'error' && errorMessage && (
          <p className="text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}

        {/* 提交按钮 */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={status === 'loading'}
          disabled={status === 'loading'}
        >
          {locale === 'zh' ? '订阅活动通知' : locale === 'ja' ? 'イベント通知を購読' : 'Subscribe to Notifications'}
        </Button>
      </form>
    </div>
  )
}
