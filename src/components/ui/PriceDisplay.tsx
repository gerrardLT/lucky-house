import Link from 'next/link'
import type { Locale, PriceStatus } from '@/types'
import { subtitle as subtitleTypo } from '@/lib/i18n/locale-typo'

export interface PriceDisplayProps {
  status: PriceStatus
  price?: number
  locale?: Locale
  className?: string
}

/** 各 locale 下 coming_soon 状态的文案 */
const COMING_SOON_TEXT: Record<Locale, string> = {
  zh: '即将公布',
  ja: '近日公開',
  en: 'Coming Soon',
}

/** 各 locale 下 inquiry 状态的文案 */
const INQUIRY_TEXT: Record<Locale, string> = {
  zh: '预约获取价格',
  ja: 'ご予約でお見積り',
  en: 'Inquire for Price',
}

/** 各 locale 下价格后缀（每晚） */
const PER_NIGHT_TEXT: Record<Locale, string> = {
  zh: '/晚',
  ja: '/泊',
  en: '/night',
}

/**
 * PriceDisplay 组件
 * 根据 priceStatus 枚举渲染不同状态：
 * - available: 显示格式化价格
 * - coming_soon: 显示"即将公布"灰色文案
 * - inquiry: 显示链接到预约页面的文案
 */
export function PriceDisplay({
  status,
  price,
  locale = 'zh',
  className = '',
}: PriceDisplayProps) {
  if (status === 'available' && price != null) {
    return (
      <span className={`text-lg font-semibold text-white ${className}`}>
        ¥{price.toLocaleString()}
        <span className="text-sm font-normal text-stone-300">
          {PER_NIGHT_TEXT[locale]}
        </span>
      </span>
    )
  }

  if (status === 'coming_soon') {
    return (
      <span className={`text-sm text-stone-500 ${subtitleTypo(locale)} ${className}`}>
        {COMING_SOON_TEXT[locale]}
      </span>
    )
  }

  if (status === 'inquiry') {
    return (
      <Link
        href={`/${locale}/booking`}
        className={`text-sm font-medium text-amber-400 hover:text-amber-300 underline ${className}`}
      >
        {INQUIRY_TEXT[locale]}
      </Link>
    )
  }

  // Fallback: 如果 available 但没有 price，显示 coming_soon 文案
  return (
    <span className={`text-sm text-stone-500 ${subtitleTypo(locale)} ${className}`}>
      {COMING_SOON_TEXT[locale]}
    </span>
  )
}
