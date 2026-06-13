/**
 * Property 8: 宠物相关 UI 元素按 isPetFriendly 条件渲染
 *
 * For any RoomType 数据：
 * - 当 isPetFriendly === false 时，房型卡片 SHALL 显示"不可携宠"标识
 * - 当 isPetFriendly === true 时，SHALL 渲染宠物友好标签且不显示"不可携宠"标识
 *
 * **Validates: Requirements 4.5, 5.8**
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import fc from 'fast-check'
import type { RoomType, Locale } from '@/types'
import { RoomCard } from '../RoomCard'

/** 生成随机 RoomType 数据用于渲染测试 */
function createRoomType(isPetFriendly: boolean, overrides?: Partial<RoomType>): RoomType {
  return {
    slug: 'test-room',
    category: isPetFriendly ? 'pet-friendly' : 'standard',
    name: { zh: '测试房间', ja: 'テスト部屋', en: 'Test Room' },
    description: { zh: '描述', ja: '説明', en: 'Desc' },
    area: 30,
    maxGuests: 2,
    maxChildren: 1,
    bedType: { zh: '大床', ja: 'ダブル', en: 'Double' },
    isPetFriendly,
    maxPets: isPetFriendly ? 2 : 0,
    priceStatus: 'inquiry',
    amenities: ['wifi', 'parking'],
    images: [
      {
        id: 'img-1',
        src: '/test.jpg',
        alt: { zh: '测试', ja: 'テスト', en: 'Test' },
        category: 'room',
        isRendering: false,
        sortOrder: 1,
        width: 800,
        height: 600,
      },
    ],
    tags: { zh: ['家庭'], ja: ['ファミリー'], en: ['Family'] },
    status: 'active',
    sortOrder: 1,
    ...overrides,
  }
}

/** 不可携宠警告文案 */
const NO_PET_WARNINGS: Record<Locale, string> = {
  zh: '不可携宠',
  ja: 'ペット不可',
  en: 'No Pets Allowed',
}

/** 宠物友好标签文案 */
const PET_FRIENDLY_LABELS: Record<Locale, string> = {
  zh: '宠物友好',
  ja: 'ペットフレンドリー',
  en: 'Pet-Friendly',
}

describe('Property 8: 宠物相关 UI 元素按 isPetFriendly 条件渲染', () => {
  const locales: Locale[] = ['zh', 'ja', 'en']

  it('当 isPetFriendly === true 时，渲染宠物友好标签', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...locales),
        fc.integer({ min: 1, max: 3 }), // maxPets
        (locale, maxPets) => {
          const room = createRoomType(true, { maxPets })
          const { container } = render(<RoomCard room={room} locale={locale} />)
          const text = container.textContent || ''

          // 应包含宠物友好标签
          expect(text).toContain(PET_FRIENDLY_LABELS[locale])
          // 不应包含"不可携宠"警告
          expect(text).not.toContain(NO_PET_WARNINGS[locale])
        }
      ),
      { numRuns: 30 }
    )
  })

  it('当 isPetFriendly === false 时，渲染"不可携宠"警告文案', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...locales),
        (locale) => {
          const room = createRoomType(false)
          const { container } = render(<RoomCard room={room} locale={locale} />)
          const text = container.textContent || ''

          // 应包含"不可携宠"警告
          expect(text).toContain(NO_PET_WARNINGS[locale])
        }
      ),
      { numRuns: 30 }
    )
  })
})
