'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Locale, RoomType } from '@/types'
import { FilterBar } from '@/components/ui/FilterBar'
import { RoomCard } from './RoomCard'

export interface RoomGridProps {
  rooms: RoomType[]
  locale: Locale
  editorialMode?: boolean
}

/**
 * 根据 URL searchParams 推导初始筛选条件
 * - hasPet=true → 预选「宠物友好」
 * - adults+children 超过某房型 maxGuests → 排除该房型
 */
function useInitialFilter(): FilterKey {
  try {
    const sp = useSearchParams()
    if (sp.get('hasPet') === 'true') return 'pet-friendly'
  } catch {
    // SSR / 无 Suspense 边界时静默降级
  }
  return 'all'
}

/** 从 URL 读取住客数，用于排除容量不足的房型 */
function useGuestFilter(): number {
  try {
    const sp = useSearchParams()
    const adults = parseInt(sp.get('adults') || '0', 10)
    const children = parseInt(sp.get('children') || '0', 10)
    return adults + children
  } catch {
    return 0
  }
}

/** 筛选选项 key */
type FilterKey = 'all' | 'pet-friendly' | 'standard' | 'villa'

/** 各语言下的筛选选项文案 */
const FILTER_LABELS: Record<FilterKey, Record<Locale, string>> = {
  all: { zh: '全部房型', ja: 'すべて', en: 'All' },
  'pet-friendly': { zh: '宠物友好', ja: 'ペットフレンドリー', en: 'Pet-Friendly' },
  standard: { zh: '标准房', ja: 'スタンダード', en: 'Standard' },
  villa: { zh: '营地别墅', ja: 'ヴィラ', en: 'Villa' },
}

/** 筛选栏 aria-label */
const FILTER_ARIA: Record<Locale, string> = {
  zh: '房型筛选',
  ja: '客室タイプフィルター',
  en: 'Room type filter',
}

/** Editorial 分区标题 */
const EDITORIAL_SECTION_LABELS: Record<string, Record<Locale, string>> = {
  standard: { zh: 'Standard Rooms · 标准客房', ja: 'スタンダードルーム', en: 'Standard Rooms' },
  'pet-friendly': { zh: 'Pet-Friendly · 宠物友好', ja: 'ペットフレンドリー', en: 'Pet-Friendly' },
  villa: { zh: 'Campsite Villas · 营地别墅', ja: 'キャンプヴィラ', en: 'Campsite Villas' },
}

/** Villa 引言文案 */
const VILLA_INTRO_TEXT: Record<Locale, string> = {
  zh: '「隐匿于林间与湖畔，独栋别墅让自然成为你们最好的同伴」',
  ja: '「森と湖畔に佇む独立ヴィラ——自然があなたたちの最良の伴となる場所」',
  en: '"Nestled in forest and lakeside — private villas where nature becomes your finest companion"',
}

/**
 * RoomGrid 组件
 *
 * 支持两种模式：
 * - 普通模式：响应式网格 + FilterBar 筛选
 * - editorialMode：Hoshinoya Editorial 杂志对开布局，按类别分区展示
 */
/** 内部：读取 URL 参数并应用筛选 */
function RoomGridInner({ rooms, locale, editorialMode }: RoomGridProps) {
  const initialFilter = useInitialFilter()
  const totalGuests = useGuestFilter()
  const [activeFilter, setActiveFilter] = useState<FilterKey>(initialFilter)

  const filterOptions = useMemo(
    () =>
      (['all', 'pet-friendly', 'standard', 'villa'] as FilterKey[]).map((key) => ({
        key,
        label: FILTER_LABELS[key][locale],
      })),
    [locale]
  )

  // 若 URL 带住客数，排除容量不足的房型
  const eligibleRooms = useMemo(() => {
    if (totalGuests <= 0) return rooms
    return rooms.filter((r) => r.maxGuests >= totalGuests)
  }, [rooms, totalGuests])

  const filteredAndSortedRooms = useMemo(() => {
    let result: RoomType[]

    // 筛选
    switch (activeFilter) {
      case 'pet-friendly':
        result = eligibleRooms.filter((r) => r.isPetFriendly)
        break
      case 'standard':
        result = eligibleRooms.filter((r) => r.category === 'standard')
        break
      case 'villa':
        result = eligibleRooms.filter((r) => r.category === 'villa')
        break
      default:
        result = [...eligibleRooms]
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
  }, [eligibleRooms, activeFilter])

  // ── Editorial Mode ──
  if (editorialMode) {
    const allCategories = ['standard', 'pet-friendly', 'villa'] as const
    const categoriesToShow =
      activeFilter === 'all'
        ? [...allCategories]
        : [activeFilter as (typeof allCategories)[number]]

    return (
      <div className="bg-[#19160F]">
        {/* Editorial 分类标签栏 */}
        <div className="flex items-center border-b border-[rgba(234,224,204,0.08)] px-8 lg:px-[60px] overflow-x-auto">
          {(['all', 'standard', 'pet-friendly', 'villa'] as FilterKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className="relative py-[18px] mr-10 text-[11px] tracking-[0.15em] uppercase whitespace-nowrap transition-colors duration-300 flex-shrink-0 border-0 bg-transparent cursor-pointer"
              style={{ color: activeFilter === key ? '#EAE0CC' : 'rgba(234,224,204,0.35)' }}
            >
              {FILTER_LABELS[key][locale]}
              {activeFilter === key && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-px bg-[#A07850]" />
              )}
            </button>
          ))}
        </div>

        {/* 按分类渲染房型 */}
        {categoriesToShow.map((category) => {
          const categoryRooms = filteredAndSortedRooms.filter((r) => r.category === category)
          if (categoryRooms.length === 0) return null

          return (
            <div key={category}>
              {/* 分类区标题 */}
              <div className="flex items-center gap-5 px-8 lg:px-[60px] pt-12">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#A07850] flex-shrink-0">
                  {(EDITORIAL_SECTION_LABELS[category] || {})[locale] || category}
                </span>
                <span className="flex-1 h-px bg-[rgba(234,224,204,0.08)]" />
              </div>

              {/* Villa 引言块 */}
              {category === 'villa' && (
                <div className="bg-[#211D14] border-t border-[rgba(234,224,204,0.08)] mt-6">
                  <div className="px-8 lg:px-[60px] py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 pb-8 border-b border-[rgba(234,224,204,0.08)]">
                      <div className="text-[10px] tracking-[0.3em] uppercase text-[#A07850] pt-1">
                        Campsite Villas · 营地别墅
                      </div>
                      <div className="font-serif text-[20px] font-normal leading-[1.6] text-[rgba(234,224,204,0.6)] italic">
                        {VILLA_INTRO_TEXT[locale]}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 房型对开展示 */}
              {categoryRooms.map((room, index) => (
                <RoomCard
                  key={room.slug}
                  room={room}
                  locale={locale}
                  layout={index % 2 === 0 ? 'editorial-left' : 'editorial-right'}
                />
              ))}
            </div>
          )
        })}

        {filteredAndSortedRooms.length === 0 && (
          <p className="text-center text-[rgba(234,224,204,0.35)] py-12 px-8">
            {locale === 'zh' && '暂无符合条件的房型'}
            {locale === 'ja' && '該当する客室タイプはありません'}
            {locale === 'en' && 'No rooms match your criteria'}
          </p>
        )}
      </div>
    )
  }

  // ── 普通网格模式 ──
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
          {locale === 'zh' && '暂无符合条件的房型'}
          {locale === 'ja' && '該当する客室タイプはありません'}
          {locale === 'en' && 'No rooms match your criteria'}
        </p>
      )}
    </div>
  )
}

/** 带 Suspense 边界的导出组件（useSearchParams 需要 Suspense） */
export function RoomGrid(props: RoomGridProps) {
  return (
    <Suspense fallback={<div className="py-12 text-center text-[rgba(234,224,204,0.35)]">…</div>}>
      <RoomGridInner {...props} />
    </Suspense>
  )
}
