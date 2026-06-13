'use client'

import { useState, useMemo } from 'react'
import type { Locale, RoomType } from '@/types'
import { FilterBar } from '@/components/ui/FilterBar'
import { RoomCard } from './RoomCard'

export interface RoomGridProps {
  rooms: RoomType[]
  locale: Locale
}

/** 筛选选项 key */
type FilterKey = 'all' | 'pet-friendly' | 'standard' | 'villa'

/** 各语言下的筛选选项文案 */
const FILTER_LABELS: Record<FilterKey, Record<Locale, string>> = {
  all: { zh: '全部', ja: 'すべて', en: 'All' },
  'pet-friendly': { zh: '宠物友好', ja: 'ペットフレンドリー', en: 'Pet-Friendly' },
  standard: { zh: '标准房', ja: 'スタンダード', en: 'Standard' },
  villa: { zh: '别墅', ja: 'ヴィラ', en: 'Villa' },
}

/** 筛选栏 aria-label */
const FILTER_ARIA: Record<Locale, string> = {
  zh: '房型筛选',
  ja: '客室タイプフィルター',
  en: 'Room type filter',
}

/**
 * RoomGrid 组件
 *
 * 响应式网格布局展示房型卡片列表：
 * - 移动端 1 列、平板 2 列、桌面端 3 列
 * - 提供筛选栏：全部 / 宠物友好 / 标准房 / 别墅
 * - 当"宠物友好"筛选激活时，宠物友好房排在最前面
 */
export function RoomGrid({ rooms, locale }: RoomGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

  const filterOptions = useMemo(
    () =>
      (['all', 'pet-friendly', 'standard', 'villa'] as FilterKey[]).map((key) => ({
        key,
        label: FILTER_LABELS[key][locale],
      })),
    [locale]
  )

  const filteredAndSortedRooms = useMemo(() => {
    let result: RoomType[]

    // 筛选
    switch (activeFilter) {
      case 'pet-friendly':
        result = rooms.filter((r) => r.isPetFriendly)
        break
      case 'standard':
        result = rooms.filter((r) => r.category === 'standard')
        break
      case 'villa':
        result = rooms.filter((r) => r.category === 'villa')
        break
      default:
        result = [...rooms]
    }

    // 当"宠物友好"筛选激活时，宠物友好房优先排序
    if (activeFilter === 'pet-friendly') {
      result.sort((a, b) => {
        if (a.isPetFriendly && !b.isPetFriendly) return -1
        if (!a.isPetFriendly && b.isPetFriendly) return 1
        return a.sortOrder - b.sortOrder
      })
    } else {
      // 默认按 sortOrder 排序
      result.sort((a, b) => a.sortOrder - b.sortOrder)
    }

    return result
  }, [rooms, activeFilter])

  return (
    <div>
      {/* 筛选栏 */}
      <FilterBar
        options={filterOptions}
        activeKey={activeFilter}
        onFilter={(key) => setActiveFilter(key as FilterKey)}
        aria-label={FILTER_ARIA[locale]}
        className="mb-6"
      />

      {/* 房型网格 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedRooms.map((room) => (
          <RoomCard key={room.slug} room={room} locale={locale} />
        ))}
      </div>

      {/* 无结果提示 */}
      {filteredAndSortedRooms.length === 0 && (
        <p className="text-center text-stone-500 py-12">
          {locale === 'zh' && '暂无该类型房型'}
          {locale === 'ja' && '該当する客室タイプはありません'}
          {locale === 'en' && 'No rooms found for this category'}
        </p>
      )}
    </div>
  )
}
