import type { Locale, RoomCategory, RoomType } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { PriceDisplay } from '@/components/ui/PriceDisplay'

export interface RoomComparisonTableProps {
  rooms: RoomType[]
  locale: Locale
}

/** 表头 - 房型类别名称 */
const CATEGORY_NAMES: Record<RoomCategory, Record<Locale, string>> = {
  standard: { zh: '标准房', ja: 'スタンダード', en: 'Standard' },
  'pet-friendly': { zh: '宠物友好房', ja: 'ペットフレンドリー', en: 'Pet-Friendly' },
  villa: { zh: '营地小别墅', ja: 'キャンプヴィラ', en: 'Campsite Villa' },
}

/** 行标题 */
const ROW_LABELS: Record<string, Record<Locale, string>> = {
  area: { zh: '面积', ja: '広さ', en: 'Area' },
  guests: { zh: '可住人数', ja: '宿泊人数', en: 'Max Guests' },
  pets: { zh: '宠物政策', ja: 'ペットポリシー', en: 'Pet Policy' },
  bed: { zh: '床型', ja: 'ベッドタイプ', en: 'Bed Type' },
  amenities: { zh: '主要设施', ja: '主な設備', en: 'Key Amenities' },
  price: { zh: '价格状态', ja: '料金状況', en: 'Price Status' },
}

/** 宠物政策文案 */
const PET_POLICY: Record<Locale, { allowed: string; notAllowed: string; maxPets: string }> = {
  zh: { allowed: '可携宠', notAllowed: '不可携宠', maxPets: '最多{count}只' },
  ja: { allowed: 'ペットOK', notAllowed: 'ペット不可', maxPets: '最大{count}匹' },
  en: { allowed: 'Pets Welcome', notAllowed: 'No Pets', maxPets: 'Up to {count}' },
}

/** 面积单位 */
const AREA_UNIT: Record<Locale, string> = {
  zh: '㎡',
  ja: '㎡',
  en: 'sqm',
}

/** 人数单位 */
const GUEST_UNIT: Record<Locale, string> = {
  zh: '人',
  ja: '名',
  en: '',
}

/** 对比表标题 */
const TABLE_TITLE: Record<Locale, string> = {
  zh: '房型对比',
  ja: '客室タイプ比較',
  en: 'Room Comparison',
}

/**
 * 从房型列表中按类别选取代表房型
 * 每个类别取 sortOrder 最小（最具代表性）的房型
 */
function getRepresentativeRooms(rooms: RoomType[]): Record<RoomCategory, RoomType | null> {
  const categories: RoomCategory[] = ['standard', 'pet-friendly', 'villa']
  const result: Record<RoomCategory, RoomType | null> = {
    standard: null,
    'pet-friendly': null,
    villa: null,
  }

  for (const category of categories) {
    const categoryRooms = rooms
      .filter((r) => r.category === category)
      .sort((a, b) => a.sortOrder - b.sortOrder)
    result[category] = categoryRooms[0] || null
  }

  return result
}

/**
 * 获取面积范围文本（同一类别可能有多个房型）
 */
function getAreaRange(rooms: RoomType[], category: RoomCategory, locale: Locale): string {
  const categoryRooms = rooms.filter((r) => r.category === category)
  if (categoryRooms.length === 0) return '-'

  const areas = categoryRooms.map((r) => r.area)
  const min = Math.min(...areas)
  const max = Math.max(...areas)

  if (min === max) return `${min} ${AREA_UNIT[locale]}`
  return `${min}–${max} ${AREA_UNIT[locale]}`
}

/**
 * 获取人数范围文本
 */
function getGuestRange(rooms: RoomType[], category: RoomCategory, locale: Locale): string {
  const categoryRooms = rooms.filter((r) => r.category === category)
  if (categoryRooms.length === 0) return '-'

  const guests = categoryRooms.map((r) => r.maxGuests)
  const min = Math.min(...guests)
  const max = Math.max(...guests)

  const unit = GUEST_UNIT[locale]
  if (min === max) return `${min}${unit}`
  return `${min}–${max}${unit}`
}

/**
 * RoomComparisonTable 组件
 *
 * 普通房 vs 宠物友好房 vs 别墅对比表：
 * - 行：面积、可住人数、宠物政策、床型、设施、价格状态
 * - 列：每个房型类别一列
 * - 移动端水平滚动
 */
export function RoomComparisonTable({ rooms, locale }: RoomComparisonTableProps) {
  const representative = getRepresentativeRooms(rooms)
  const categories: RoomCategory[] = ['standard', 'pet-friendly', 'villa']

  // 过滤掉没有房型数据的类别
  const availableCategories = categories.filter((c) => representative[c] !== null)

  if (availableCategories.length === 0) return null

  return (
    <section aria-labelledby="room-comparison-title">
      <h2
        id="room-comparison-title"
        className="text-xl font-semibold text-white mb-4"
      >
        {TABLE_TITLE[locale]}
      </h2>

      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full min-w-[600px] border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-stone-700">
              <th className="py-3 px-4 text-left font-medium text-stone-400 w-1/4"></th>
              {availableCategories.map((category) => (
                <th
                  key={category}
                  className="py-3 px-4 text-center font-semibold text-white"
                >
                  {CATEGORY_NAMES[category][locale]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 面积 */}
            <tr className="border-b border-stone-700">
              <td className="py-3 px-4 font-medium text-stone-200">
                {ROW_LABELS.area[locale]}
              </td>
              {availableCategories.map((category) => (
                <td key={category} className="py-3 px-4 text-center text-stone-300">
                  {getAreaRange(rooms, category, locale)}
                </td>
              ))}
            </tr>

            {/* 人数 */}
            <tr className="border-b border-stone-700 bg-stone-800/50">
              <td className="py-3 px-4 font-medium text-stone-200">
                {ROW_LABELS.guests[locale]}
              </td>
              {availableCategories.map((category) => (
                <td key={category} className="py-3 px-4 text-center text-stone-300">
                  {getGuestRange(rooms, category, locale)}
                </td>
              ))}
            </tr>

            {/* 宠物政策 */}
            <tr className="border-b border-stone-700">
              <td className="py-3 px-4 font-medium text-stone-200">
                {ROW_LABELS.pets[locale]}
              </td>
              {availableCategories.map((category) => {
                const room = representative[category]!
                return (
                  <td key={category} className="py-3 px-4 text-center">
                    {room.isPetFriendly ? (
                      <div className="flex flex-col items-center gap-1">
                        <Badge variant="pet-friendly">
                          {PET_POLICY[locale].allowed}
                        </Badge>
                        <span className="text-xs text-stone-400">
                          {PET_POLICY[locale].maxPets.replace('{count}', String(room.maxPets))}
                        </span>
                      </div>
                    ) : (
                      <Badge variant="maintenance">
                        {PET_POLICY[locale].notAllowed}
                      </Badge>
                    )}
                  </td>
                )
              })}
            </tr>

            {/* 床型 */}
            <tr className="border-b border-stone-700 bg-stone-800/50">
              <td className="py-3 px-4 font-medium text-stone-200">
                {ROW_LABELS.bed[locale]}
              </td>
              {availableCategories.map((category) => {
                const room = representative[category]!
                return (
                  <td key={category} className="py-3 px-4 text-center text-stone-300">
                    {room.bedType[locale]}
                  </td>
                )
              })}
            </tr>

            {/* 主要设施 */}
            <tr className="border-b border-stone-700">
              <td className="py-3 px-4 font-medium text-stone-200">
                {ROW_LABELS.amenities[locale]}
              </td>
              {availableCategories.map((category) => {
                const room = representative[category]!
                const topAmenities = room.amenities.slice(0, 5)
                return (
                  <td key={category} className="py-3 px-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {topAmenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-block px-1.5 py-0.5 text-xs bg-stone-700 rounded text-stone-300"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 5 && (
                        <span className="text-xs text-stone-400">
                          +{room.amenities.length - 5}
                        </span>
                      )}
                    </div>
                  </td>
                )
              })}
            </tr>

            {/* 价格状态 */}
            <tr className="border-b border-stone-700 bg-stone-800/50">
              <td className="py-3 px-4 font-medium text-stone-200">
                {ROW_LABELS.price[locale]}
              </td>
              {availableCategories.map((category) => {
                const room = representative[category]!
                return (
                  <td key={category} className="py-3 px-4 text-center">
                    <PriceDisplay
                      status={room.priceStatus}
                      price={room.price}
                      locale={locale}
                    />
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
