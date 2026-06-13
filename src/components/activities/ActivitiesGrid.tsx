'use client'

import { useState, useMemo } from 'react'
import type { Activity, Locale } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ImageWithLabel } from '@/components/ui/ImageWithLabel'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { FilterBar } from '@/components/ui/FilterBar'

export interface ActivitiesGridProps {
  activities: Activity[]
  locale: Locale
}

// === 活动类别筛选 ===

type ActivityCategoryKey = 'all' | 'nature' | 'social' | 'wellness' | 'workshop'

const CATEGORY_KEYS: ActivityCategoryKey[] = [
  'all',
  'nature',
  'social',
  'wellness',
  'workshop',
]

const CATEGORY_LABELS: Record<ActivityCategoryKey, Record<Locale, string>> = {
  all: { zh: '全部', ja: 'すべて', en: 'All' },
  nature: { zh: '自然', ja: '自然', en: 'Nature' },
  social: { zh: '社交', ja: '交流', en: 'Social' },
  wellness: { zh: '养生', ja: 'ウェルネス', en: 'Wellness' },
  workshop: { zh: '工作坊', ja: 'ワークショップ', en: 'Workshop' },
}

// === 月份筛选 ===

type MonthKey = 'all' | string // 'all' or '01'~'12'

const MONTH_LABELS: Record<Locale, string[]> = {
  zh: ['全部月份', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  ja: ['全月', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  en: ['All Months', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}

// === 活动状态映射 ===

const STATUS_LABELS: Record<Activity['status'], Record<Locale, string>> = {
  open: { zh: '报名中', ja: '受付中', en: 'Open' },
  upcoming: { zh: '即将开始', ja: '近日開催', en: 'Upcoming' },
  full: { zh: '已满', ja: '満員', en: 'Full' },
  ended: { zh: '已结束', ja: '終了', en: 'Ended' },
}

function getStatusBadgeVariant(status: Activity['status']): 'open' | 'coming-soon' | 'maintenance' | 'normal' {
  switch (status) {
    case 'open':
      return 'open'
    case 'upcoming':
      return 'coming-soon'
    case 'full':
      return 'maintenance'
    case 'ended':
      return 'normal'
  }
}

/**
 * ActivitiesGrid 组件
 *
 * 活动社群页的核心交互组件：
 * - 卡片网格展示活动列表
 * - 支持按类别和月份筛选
 * - 不同状态显示不同按钮（报名/兴趣登记/已满/已结束）
 * - 展示目标受众标签
 */
export function ActivitiesGrid({ activities, locale }: ActivitiesGridProps) {
  const [activeCategory, setActiveCategory] = useState<ActivityCategoryKey>('all')
  const [activeMonth, setActiveMonth] = useState<MonthKey>('all')

  // 类别筛选选项
  const categoryOptions = useMemo(
    () =>
      CATEGORY_KEYS.map((key) => ({
        key,
        label: CATEGORY_LABELS[key][locale],
      })),
    [locale]
  )

  // 月份筛选选项
  const monthOptions = useMemo(() => {
    const options = [{ key: 'all', label: MONTH_LABELS[locale][0] }]
    for (let i = 1; i <= 12; i++) {
      options.push({
        key: String(i).padStart(2, '0'),
        label: MONTH_LABELS[locale][i],
      })
    }
    return options
  }, [locale])

  // 筛选后的活动列表
  const filteredActivities = useMemo(() => {
    let result = activities

    // 按类别筛选
    if (activeCategory !== 'all') {
      result = result.filter((a) => a.category === activeCategory)
    }

    // 按月份筛选
    if (activeMonth !== 'all') {
      result = result.filter((a) => {
        if (!a.date) return false
        const month = a.date.substring(5, 7) // 'YYYY-MM-DD' → 'MM'
        return month === activeMonth
      })
    }

    return result
  }, [activities, activeCategory, activeMonth])

  return (
    <section aria-label={locale === 'zh' ? '活动列表' : locale === 'ja' ? 'イベント一覧' : 'Activities List'}>
      {/* 类别筛选栏 */}
      <FilterBar
        options={categoryOptions}
        activeKey={activeCategory}
        onFilter={(key) => setActiveCategory(key as ActivityCategoryKey)}
        aria-label={
          locale === 'zh'
            ? '活动类别筛选'
            : locale === 'ja'
              ? 'イベントカテゴリフィルター'
              : 'Activity category filter'
        }
        className="mb-4"
      />

      {/* 月份筛选栏 */}
      <FilterBar
        options={monthOptions}
        activeKey={activeMonth}
        onFilter={(key) => setActiveMonth(key)}
        aria-label={
          locale === 'zh'
            ? '活动月份筛选'
            : locale === 'ja'
              ? 'イベント月フィルター'
              : 'Activity month filter'
        }
        className="mb-8"
      />

      {/* 活动卡片网格 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredActivities.map((activity) => (
          <ActivityCard key={activity.slug} activity={activity} locale={locale} />
        ))}
      </div>

      {/* 空状态 */}
      {filteredActivities.length === 0 && (
        <p className="py-12 text-center text-stone-500">
          {locale === 'zh'
            ? '暂无符合条件的活动'
            : locale === 'ja'
              ? '条件に一致するイベントはありません'
              : 'No activities match the current filters'}
        </p>
      )}
    </section>
  )
}

/** 单个活动卡片 */
function ActivityCard({ activity, locale }: { activity: Activity; locale: Locale }) {
  const isEnded = activity.status === 'ended'

  // 格式化日期
  const formattedDate = useMemo(() => {
    if (!activity.date) {
      return locale === 'zh' ? '日期待定' : locale === 'ja' ? '日程未定' : 'Date TBD'
    }
    const d = new Date(activity.date)
    if (locale === 'zh') {
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    }
    if (locale === 'ja') {
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }, [activity.date, locale])

  return (
    <Card
      as="article"
      className={`flex flex-col transition-opacity ${isEnded ? 'opacity-60' : ''}`}
      padding="none"
    >
      {/* 活动图片（支持概念图标注） */}
      <ImageWithLabel
        src={activity.image.src}
        alt={activity.image.alt[locale]}
        width={activity.image.width}
        height={activity.image.height}
        isRendering={activity.image.isRendering}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      <div className="flex flex-col flex-1 gap-3 p-5">
        {/* 日期和状态 */}
        <div className="flex items-center justify-between gap-2">
          <time className="text-sm text-stone-500" dateTime={activity.date || ''}>
            {formattedDate}
          </time>
          <Badge variant={getStatusBadgeVariant(activity.status)}>
            {STATUS_LABELS[activity.status][locale]}
          </Badge>
        </div>

        {/* 名称 */}
        <h3 className="text-lg font-semibold text-white">
          {activity.name[locale]}
        </h3>

        {/* 描述 */}
        <p className="text-sm text-stone-400 leading-relaxed flex-1 line-clamp-3">
          {activity.description[locale]}
        </p>

        {/* 价格状态 */}
        <div className="text-sm">
          <PriceDisplay
            status={activity.priceStatus}
            locale={locale}
          />
        </div>

        {/* 目标受众标签 */}
        <div className="flex flex-wrap gap-1.5">
          {activity.targetAudience[locale].map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-stone-800 text-stone-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="pt-3 border-t border-stone-700">
          <ActivityActionButton activity={activity} locale={locale} />
        </div>
      </div>
    </Card>
  )
}

/** 活动状态对应的操作按钮 */
function ActivityActionButton({ activity, locale }: { activity: Activity; locale: Locale }) {
  switch (activity.status) {
    case 'open':
      // 已确认时间 → 报名按钮
      return (
        <Button variant="primary" size="sm" href={`/${locale}/booking`}>
          {locale === 'zh' ? '报名' : locale === 'ja' ? '申し込む' : 'Register'}
        </Button>
      )
    case 'upcoming':
      // 未确认时间或即将开始 → 兴趣登记按钮
      return (
        <Button variant="outline" size="sm" href={`/${locale}/booking`}>
          {activity.date
            ? (locale === 'zh' ? '兴趣登记' : locale === 'ja' ? '興味登録' : 'Register Interest')
            : (locale === 'zh' ? '订阅提醒' : locale === 'ja' ? 'リマインダー登録' : 'Subscribe Reminder')}
        </Button>
      )
    case 'full':
      // 已满 → 禁用按钮
      return (
        <Button variant="secondary" size="sm" disabled>
          {locale === 'zh' ? '已满' : locale === 'ja' ? '満員' : 'Full'}
        </Button>
      )
    case 'ended':
      // 已结束 → 灰色标签
      return (
        <Button variant="ghost" size="sm" disabled>
          {locale === 'zh' ? '已结束' : locale === 'ja' ? '終了' : 'Ended'}
        </Button>
      )
  }
}
