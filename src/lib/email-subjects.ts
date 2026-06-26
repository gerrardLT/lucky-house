// src/lib/email-subjects.ts
// 邮件标题多语言支持 — 根据用户 locale 返回对应语言的邮件标题

type Locale = 'zh' | 'ja' | 'en'

function resolveLocale(locale?: string): Locale {
  if (locale === 'ja') return 'ja'
  if (locale === 'en') return 'en'
  return 'zh'
}

/** 预约确认邮件标题（发给用户） */
export function bookingConfirmationSubject(locale?: string): string {
  const l = resolveLocale(locale)
  const map: Record<Locale, string> = {
    zh: '预约确认 - Luckyhouse',
    ja: 'ご予約確認 - Luckyhouse',
    en: 'Booking Confirmation - Luckyhouse',
  }
  return map[l]
}

/** 新预约通知邮件标题（发给管理员） */
export function bookingNotificationSubject(confirmationId: string): string {
  return `New Booking: ${confirmationId}`
}

/** 联系自动回复邮件标题 */
export function contactAutoReplySubject(locale?: string): string {
  const l = resolveLocale(locale)
  const map: Record<Locale, string> = {
    zh: '消息已收到 - Luckyhouse',
    ja: 'メッセージ受信確認 - Luckyhouse',
    en: 'Message Received - Luckyhouse',
  }
  return map[l]
}

/** 活动登记确认邮件标题 */
export function activityConfirmationSubject(locale?: string): string {
  const l = resolveLocale(locale)
  const map: Record<Locale, string> = {
    zh: '活动登记确认 - Luckyhouse',
    ja: 'アクティビティ登録確認 - Luckyhouse',
    en: 'Activity Registration - Luckyhouse',
  }
  return map[l]
}
