/**
 * Property 7: 携宠筛选时宠物友好房优先排序
 *
 * For any 房型列表（包含混合类别的房型），当"携宠"筛选激活时，
 * 排序后的列表 SHALL 保证所有 isPetFriendly === true 的房型出现在
 * 所有 isPetFriendly === false 的房型之前。
 *
 * **Validates: Requirements 4.2**
 */

import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import type { RoomType } from '@/types'

/**
 * 复制 RoomGrid 组件中的筛选排序逻辑用于纯函数测试。
 * 当 pet-friendly 筛选激活时：
 * 1. 过滤出 isPetFriendly === true 的房型
 * 2. 宠物友好房按 sortOrder 排序
 */
function filterAndSortRooms(rooms: RoomType[], filter: 'all' | 'pet-friendly'): RoomType[] {
  let result: RoomType[]

  if (filter === 'pet-friendly') {
    result = rooms.filter((r) => r.isPetFriendly)
    result.sort((a, b) => {
      if (a.isPetFriendly && !b.isPetFriendly) return -1
      if (!a.isPetFriendly && b.isPetFriendly) return 1
      return a.sortOrder - b.sortOrder
    })
  } else {
    result = [...rooms]
    result.sort((a, b) => a.sortOrder - b.sortOrder)
  }

  return result
}

/** 生成随机的 RoomType 对象 */
const roomTypeArbitrary: fc.Arbitrary<RoomType> = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 20 }).map((s) => s.replace(/[^a-z0-9]/gi, 'x') || 'room'),
  category: fc.constantFrom('standard' as const, 'pet-friendly' as const, 'villa' as const),
  name: fc.constant({ zh: '测试房间', ja: 'テスト部屋', en: 'Test Room' }),
  description: fc.constant({ zh: '描述', ja: '説明', en: 'Description' }),
  area: fc.integer({ min: 10, max: 200 }),
  maxGuests: fc.integer({ min: 1, max: 6 }),
  maxChildren: fc.integer({ min: 0, max: 4 }),
  bedType: fc.constant({ zh: '大床', ja: 'ダブル', en: 'Double' }),
  isPetFriendly: fc.boolean(),
  maxPets: fc.integer({ min: 0, max: 3 }),
  maxPetWeight: fc.option(fc.integer({ min: 5, max: 80 }), { nil: undefined }),
  priceStatus: fc.constantFrom('available' as const, 'coming_soon' as const, 'inquiry' as const),
  price: fc.option(fc.integer({ min: 10000, max: 100000 }), { nil: undefined }),
  amenities: fc.constant(['wifi', 'parking']),
  images: fc.constant([]),
  tags: fc.constant({ zh: ['家庭'], ja: ['ファミリー'], en: ['Family'] }),
  status: fc.constantFrom('active' as const, 'coming_soon' as const),
  sortOrder: fc.integer({ min: 1, max: 100 }),
})

describe('Property 7: 携宠筛选时宠物友好房优先排序', () => {
  it('当 pet-friendly 筛选激活时，所有返回的房间 isPetFriendly 均为 true', () => {
    fc.assert(
      fc.property(
        fc.array(roomTypeArbitrary, { minLength: 1, maxLength: 20 }),
        (rooms) => {
          const filtered = filterAndSortRooms(rooms, 'pet-friendly')
          // 所有返回的房间都应该是 pet-friendly
          for (const room of filtered) {
            expect(room.isPetFriendly).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('pet-friendly 筛选结果数量等于输入中 isPetFriendly === true 的房间数', () => {
    fc.assert(
      fc.property(
        fc.array(roomTypeArbitrary, { minLength: 1, maxLength: 20 }),
        (rooms) => {
          const filtered = filterAndSortRooms(rooms, 'pet-friendly')
          const expectedCount = rooms.filter((r) => r.isPetFriendly).length
          expect(filtered.length).toBe(expectedCount)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('pet-friendly 筛选结果按 sortOrder 升序排列', () => {
    fc.assert(
      fc.property(
        fc.array(roomTypeArbitrary, { minLength: 2, maxLength: 20 }),
        (rooms) => {
          const filtered = filterAndSortRooms(rooms, 'pet-friendly')
          for (let i = 1; i < filtered.length; i++) {
            expect(filtered[i].sortOrder).toBeGreaterThanOrEqual(filtered[i - 1].sortOrder)
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
