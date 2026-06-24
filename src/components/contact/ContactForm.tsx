'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/i18n/config'
import { contactSchema } from '@/lib/schemas/contact'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'

/** 主题选项值 */
const SUBJECT_OPTIONS = ['accommodation', 'pet', 'activity', 'general'] as const
type Subject = (typeof SUBJECT_OPTIONS)[number]

/** 主题选项标签映射（三语） */
const SUBJECT_LABELS: Record<Locale, Record<Subject, string>> = {
  zh: {
    accommodation: '住宿咨询',
    pet: '宠物相关',
    activity: '活动咨询',
    general: '其他问题',
  },
  ja: {
    accommodation: 'ご宿泊について',
    pet: 'ペットについて',
    activity: 'アクティビティについて',
    general: 'その他',
  },
  en: {
    accommodation: 'Accommodation',
    pet: 'Pet Related',
    activity: 'Activities',
    general: 'General Inquiry',
  },
}

/** 表单 UI 文案（三语） */
const UI_TEXT: Record<Locale, {
  title: string
  subjectLabel: string
  subjectPlaceholder: string
  nameLabel: string
  namePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  messageLabel: string
  messagePlaceholder: string
  submitButton: string
  submitting: string
  successMessage: string
  errorMessage: string
  required: string
  errors: {
    subjectRequired: string
    nameRequired: string
    emailRequired: string
    emailInvalid: string
    messageRequired: string
    messageMinLength: string
  }
}> = {
  zh: {
    title: '联系我们',
    subjectLabel: '咨询主题',
    subjectPlaceholder: '请选择主题',
    nameLabel: '姓名',
    namePlaceholder: '请输入您的姓名',
    emailLabel: '邮箱',
    emailPlaceholder: '请输入您的邮箱',
    phoneLabel: '电话（选填）',
    phonePlaceholder: '请输入您的电话号码',
    messageLabel: '留言内容',
    messagePlaceholder: '请输入您的留言（至少10个字符）',
    submitButton: '发送消息',
    submitting: '发送中...',
    successMessage: '感谢您的留言，我们会尽快回复',
    errorMessage: '发送失败，请稍后重试或联系客服',
    required: '*',
    errors: {
      subjectRequired: '请选择咨询主题',
      nameRequired: '请输入姓名',
      emailRequired: '请输入邮箱',
      emailInvalid: '请输入有效的邮箱地址',
      messageRequired: '请输入留言内容',
      messageMinLength: '留言内容至少需要10个字符',
    },
  },
  ja: {
    title: 'お問い合わせ',
    subjectLabel: 'お問い合わせ種別',
    subjectPlaceholder: '種別を選択してください',
    nameLabel: 'お名前',
    namePlaceholder: 'お名前を入力してください',
    emailLabel: 'メールアドレス',
    emailPlaceholder: 'メールアドレスを入力してください',
    phoneLabel: '電話番号（任意）',
    phonePlaceholder: '電話番号を入力してください',
    messageLabel: 'メッセージ',
    messagePlaceholder: 'メッセージを入力してください（10文字以上）',
    submitButton: '送信する',
    submitting: '送信中...',
    successMessage: 'お問い合わせありがとうございます。できるだけ早くご返信いたします',
    errorMessage: '送信に失敗しました。しばらくしてから再度お試しください',
    required: '*',
    errors: {
      subjectRequired: 'お問い合わせ種別を選択してください',
      nameRequired: 'お名前を入力してください',
      emailRequired: 'メールアドレスを入力してください',
      emailInvalid: '有効なメールアドレスを入力してください',
      messageRequired: 'メッセージを入力してください',
      messageMinLength: 'メッセージは10文字以上で入力してください',
    },
  },
  en: {
    title: 'Contact Us',
    subjectLabel: 'Subject',
    subjectPlaceholder: 'Select a subject',
    nameLabel: 'Name',
    namePlaceholder: 'Enter your name',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your email',
    phoneLabel: 'Phone (optional)',
    phonePlaceholder: 'Enter your phone number',
    messageLabel: 'Message',
    messagePlaceholder: 'Enter your message (minimum 10 characters)',
    submitButton: 'Send Message',
    submitting: 'Sending...',
    successMessage: 'Thank you for your message. We will get back to you soon',
    errorMessage: 'Failed to send. Please try again later or contact support',
    required: '*',
    errors: {
      subjectRequired: 'Please select a subject',
      nameRequired: 'Please enter your name',
      emailRequired: 'Please enter your email',
      emailInvalid: 'Please enter a valid email address',
      messageRequired: 'Please enter a message',
      messageMinLength: 'Message must be at least 10 characters',
    },
  },
}

interface ContactFormProps {
  locale: Locale
}

interface FormErrors {
  subject?: string
  name?: string
  email?: string
  message?: string
}

export function ContactForm({ locale }: ContactFormProps) {
  const t = UI_TEXT[locale]
  const subjectLabels = SUBJECT_LABELS[locale]

  // Form state
  const [subject, setSubject] = useState<string>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  // UI state
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  /** 验证单个字段 */
  function validateField(field: keyof FormErrors, value: string): string | undefined {
    switch (field) {
      case 'subject':
        if (!value) return t.errors.subjectRequired
        break
      case 'name':
        if (!value.trim()) return t.errors.nameRequired
        break
      case 'email':
        if (!value.trim()) return t.errors.emailRequired
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t.errors.emailInvalid
        break
      case 'message':
        if (!value.trim()) return t.errors.messageRequired
        if (value.trim().length < 10) return t.errors.messageMinLength
        break
    }
    return undefined
  }

  /** 验证所有字段 */
  function validateAll(): FormErrors {
    const newErrors: FormErrors = {}
    const subjectErr = validateField('subject', subject)
    const nameErr = validateField('name', name)
    const emailErr = validateField('email', email)
    const messageErr = validateField('message', message)

    if (subjectErr) newErrors.subject = subjectErr
    if (nameErr) newErrors.name = nameErr
    if (emailErr) newErrors.email = emailErr
    if (messageErr) newErrors.message = messageErr

    return newErrors
  }

  /** 字段失焦时验证 */
  function handleBlur(field: keyof FormErrors, value: string) {
    const error = validateField(field, value)
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  /** 提交表单 */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // 清除之前的状态
    setSubmitStatus('idle')

    // 前端验证
    const validationErrors = validateAll()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // 使用 Zod schema 做最终验证
    const formData = {
      subject,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      message: message.trim(),
      locale,
    }

    const result = contactSchema.safeParse(formData)
    if (!result.success) {
      // 将 Zod 错误映射到 field errors
      const zodErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof FormErrors
        if (path && !zodErrors[path]) {
          zodErrors[path] = issue.message
        }
      }
      setErrors(zodErrors)
      return
    }

    // 提交到 API
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })

      if (response.ok) {
        setSubmitStatus('success')
        // 清空表单
        setSubject('')
        setName('')
        setEmail('')
        setPhone('')
        setMessage('')
        setErrors({})
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* 成功提示 */}
      {submitStatus === 'success' && (
        <div
          className="rounded-lg border border-amber-700/50 bg-amber-900/20 p-4 text-amber-400"
          role="alert"
        >
          {t.successMessage}
        </div>
      )}

      {/* 错误提示 */}
      {submitStatus === 'error' && (
        <div
          className="rounded-lg border border-red-700/30 bg-red-900/20 p-4 text-red-400"
          role="alert"
        >
          {t.errorMessage}
        </div>
      )}

      {/* 主题选择 */}
      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-stone-300 mb-1">
          {t.subjectLabel} <span className="text-red-500">{t.required}</span>
        </label>
        <Select
          id="contact-subject"
          locale={locale}
          value={subject}
          placeholder={t.subjectPlaceholder}
          options={SUBJECT_OPTIONS.map(option => ({ value: option, label: subjectLabels[option] }))}
          onChange={(v) => {
            setSubject(String(v))
            if (errors.subject) setErrors(prev => ({ ...prev, subject: undefined }))
          }}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
        />
        {errors.subject && (
          <p id="contact-subject-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.subject}
          </p>
        )}
      </div>

      {/* 姓名 */}
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-stone-300 mb-1">
          {t.nameLabel} <span className="text-red-500">{t.required}</span>
        </label>
        <input
          type="text"
          id="contact-name"
          value={name}
          onChange={e => {
            setName(e.target.value)
            if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
          }}
          onBlur={() => handleBlur('name', name)}
          placeholder={t.namePlaceholder}
          className={`w-full rounded-lg border px-4 py-2.5 text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            errors.name ? 'border-red-500' : 'border-stone-600'
          }`}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          required
        />
        {errors.name && (
          <p id="contact-name-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* 邮箱 */}
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-stone-300 mb-1">
          {t.emailLabel} <span className="text-red-500">{t.required}</span>
        </label>
        <input
          type="email"
          id="contact-email"
          value={email}
          onChange={e => {
            setEmail(e.target.value)
            if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
          }}
          onBlur={() => handleBlur('email', email)}
          placeholder={t.emailPlaceholder}
          className={`w-full rounded-lg border px-4 py-2.5 text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            errors.email ? 'border-red-500' : 'border-stone-600'
          }`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          required
        />
        {errors.email && (
          <p id="contact-email-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* 电话（选填） */}
      <div>
        <label htmlFor="contact-phone" className="block text-sm font-medium text-stone-300 mb-1">
          {t.phoneLabel}
        </label>
        <input
          type="tel"
          id="contact-phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder={t.phonePlaceholder}
          className="w-full rounded-lg border border-stone-600 px-4 py-2.5 text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* 留言内容 */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-stone-300 mb-1">
          {t.messageLabel} <span className="text-red-500">{t.required}</span>
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={e => {
            setMessage(e.target.value)
            if (errors.message) setErrors(prev => ({ ...prev, message: undefined }))
          }}
          onBlur={() => handleBlur('message', message)}
          placeholder={t.messagePlaceholder}
          rows={5}
          className={`w-full rounded-lg border px-4 py-2.5 text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y ${
            errors.message ? 'border-red-500' : 'border-stone-600'
          }`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          required
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* 提交按钮 */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isSubmitting}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? t.submitting : t.submitButton}
      </Button>
    </form>
  )
}
