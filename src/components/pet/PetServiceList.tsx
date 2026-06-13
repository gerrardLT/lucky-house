import Image from 'next/image'
import type { Facility, FacilityStatus, Locale } from '@/types'
import { Badge } from '@/components/ui/Badge'

export interface PetServiceListProps {
  facilities: Facility[]
  locale: Locale
}

/** 状态标签多语言映射 */
const STATUS_LABELS: Record<FacilityStatus, Record<Locale, string>> = {
  open: { zh: '已开放', ja: '営業中', en: 'Open' },
  opening_soon: { zh: '即将开放', ja: '近日オープン', en: 'Opening Soon' },
  maintenance: { zh: '维护中', ja: 'メンテナンス中', en: 'Maintenance' },
}

/** 状态 → Badge variant 映射 */
const STATUS_VARIANT: Record<FacilityStatus, 'open' | 'coming-soon' | 'maintenance'> = {
  open: 'open',
  opening_soon: 'coming-soon',
  maintenance: 'maintenance',
}

/** 预约按钮多语言文案 */
const BOOKING_LABEL: Record<Locale, string> = {
  zh: '立即预约',
  ja: '予約する',
  en: 'Book Now',
}

/**
 * PetServiceList 组件 — "Floating Service Cards" 悬浮服务卡
 *
 * 展示宠物服务清单，仅显示 category === 'pet-service' 的设施。
 * 交错悬浮卡片网格布局，每张卡片有渐变背景、装饰性大图标、hover 上浮发光效果。
 */
export function PetServiceList({ facilities, locale }: PetServiceListProps) {
  // 筛选宠物服务类设施
  const petServices = facilities
    .filter((f) => f.category === 'pet-service')
    .sort((a, b) => a.sortOrder - b.sortOrder)

  if (petServices.length === 0) {
    return null
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
      role="list"
      aria-label={locale === 'zh' ? '宠物服务清单' : locale === 'ja' ? 'ペットサービス一覧' : 'Pet Services'}
    >
      {petServices.map((service) => (
        <div
          key={service.slug}
          role="listitem"
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/5 overflow-hidden transition-all duration-500 hover:border-amber-500/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(217,119,6,0.08)]"
        >
          {/* 背景装饰：大号半透明图标 */}
          <div className="absolute top-4 right-4 opacity-[0.04] pointer-events-none" aria-hidden="true">
            <Image src={getIconPath(service.icon)} alt="" width={80} height={80} />
          </div>

          {/* 图标 + 状态 */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Image
                src={getIconPath(service.icon)}
                alt=""
                width={24}
                height={24}
                className="opacity-90"
              />
            </div>
            <Badge variant={STATUS_VARIANT[service.status]}>
              {STATUS_LABELS[service.status][locale]}
            </Badge>
          </div>

          {/* 服务名称 */}
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">
            {service.name[locale]}
          </h3>

          {/* 描述 */}
          <p className="text-sm text-white/50 leading-relaxed mb-4">
            {service.description[locale]}
          </p>

          {/* 底部预约链接 */}
          {service.linkedBooking && (
            <a
              href={`/${locale}/booking`}
              className="inline-flex items-center gap-1.5 text-sm text-amber-400 font-medium hover:text-amber-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]"
            >
              {BOOKING_LABEL[locale]}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * 根据 icon key 返回对应的 PNG 图标路径
 */
function getIconPath(iconKey: string): string {
  const iconMap: Record<string, string> = {
    'pet-bath': '/icons/icon-pet-onsen.png',
    'dog-run': '/icons/icon-dog-run.png',
    'dog-run-indoor': '/icons/icon-dog-run.png',
    grooming: '/icons/icon-pet-grooming.png',
    'pet-sit': '/icons/icon-pet-house.png',
    cleanup: '/icons/icon-pet-friendly.png',
  }
  return iconMap[iconKey] || '/icons/icon-pet-friendly.png'
}
