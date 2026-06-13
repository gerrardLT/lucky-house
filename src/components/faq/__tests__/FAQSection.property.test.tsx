/**
 * Property 9: FAQ 关键词搜索结果全部包含搜索词
 *
 * For any 非空搜索关键词和 FAQ 数据集，过滤后返回的结果集中
 * 每一条 FAQ 的问题或答案文本 SHALL 包含该关键词（大小写不敏感匹配）。
 *
 * **Validates: Requirements 11.1**
 */

import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import type { FAQ, Locale } from '@/types'

/**
 * 复制 FAQSection 组件的搜索过滤逻辑为纯函数进行属性测试。
 * 搜索逻辑：case-insensitive 部分匹配 question 或 answer 字段。
 */
function filterFAQsByKeyword(faqs: FAQ[], query: string, locale: Locale): FAQ[] {
  if (!query.trim()) return faqs
  const normalizedQuery = query.trim().toLowerCase()
  return faqs.filter((faq) => {
    const question = faq.question[locale]?.toLowerCase() ?? ''
    const answer = faq.answer[locale]?.toLowerCase() ?? ''
    return question.includes(normalizedQuery) || answer.includes(normalizedQuery)
  })
}

/** 用于测试的 FAQ 数据集 */
const testFAQs: FAQ[] = [
  {
    id: 'faq-1',
    category: 'pet',
    question: { zh: '哪些宠物可以入住？', ja: 'どんなペットが宿泊できますか？', en: 'What pets are allowed?' },
    answer: { zh: '目前接受犬类和猫类入住。', ja: '現在、犬と猫のご宿泊を受け付けております。', en: 'We currently accept dogs and cats.' },
    sortOrder: 1,
  },
  {
    id: 'faq-2',
    category: 'room-price',
    question: { zh: '房间价格是多少？', ja: '部屋の料金はいくらですか？', en: 'What are the room prices?' },
    answer: { zh: '价格即将公布，请关注我们的最新动态。', ja: '料金は近日公開予定です。', en: 'Prices will be announced soon.' },
    sortOrder: 2,
  },
  {
    id: 'faq-3',
    category: 'onsen',
    question: { zh: '温泉开放时间？', ja: '温泉の営業時間は？', en: 'What are the onsen hours?' },
    answer: { zh: '温泉24小时开放，宠物温泉开放时间为上午9点到晚上8点。', ja: '温泉は24時間営業、ペット温泉は午前9時から午後8時まで。', en: 'Onsen is open 24 hours. Pet onsen hours are 9 AM to 8 PM.' },
    sortOrder: 3,
  },
  {
    id: 'faq-4',
    category: 'transport',
    question: { zh: '如何到达酒店？', ja: 'ホテルへのアクセスは？', en: 'How do I get to the hotel?' },
    answer: { zh: '从福岛站乘坐巴士约40分钟到达岳温泉。', ja: '福島駅からバスで約40分で岳温泉に到着します。', en: 'Take a bus from Fukushima Station, about 40 minutes to Dake Onsen.' },
    sortOrder: 4,
  },
  {
    id: 'faq-5',
    category: 'cancel',
    question: { zh: '取消预约的政策是什么？', ja: 'キャンセルポリシーは何ですか？', en: 'What is the cancellation policy?' },
    answer: { zh: '入住前7天免费取消，7天内取消收取一晚房费。', ja: 'チェックイン7日前まで無料キャンセル、7日以内は1泊分のキャンセル料がかかります。', en: 'Free cancellation up to 7 days before check-in. Within 7 days, one night charge applies.' },
    sortOrder: 5,
  },
]

/** 已知能匹配到结果的搜索词（从 FAQ 数据中手动提取） */
const KNOWN_SEARCH_TERMS: Record<Locale, string[]> = {
  zh: ['宠物', '入住', '温泉', '价格', '取消', '预约', '规则', '疫苗', '酒店'],
  ja: ['ペット', '温泉', '料金', 'キャンセル', '予約', 'ルール'],
  en: ['pet', 'room', 'onsen', 'cancel', 'book', 'rule', 'vaccine', 'hotel'],
}

describe('Property 9: FAQ 关键词搜索结果全部包含搜索词', () => {
  const locales: Locale[] = ['zh', 'ja', 'en']

  it('过滤后每条结果的 question 或 answer 都包含搜索词（大小写不敏感）', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...locales),
        fc.nat(),
        (locale, index) => {
          const terms = KNOWN_SEARCH_TERMS[locale]
          const searchTerm = terms[index % terms.length]
          const results = filterFAQsByKeyword(testFAQs, searchTerm, locale)

          // 每条结果都应包含搜索词
          for (const faq of results) {
            const question = faq.question[locale]?.toLowerCase() ?? ''
            const answer = faq.answer[locale]?.toLowerCase() ?? ''
            const contains = question.includes(searchTerm.toLowerCase()) || answer.includes(searchTerm.toLowerCase())
            expect(contains).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('使用随机生成的搜索词，所有结果均包含该词', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...locales),
        fc.string({ minLength: 1, maxLength: 10 }),
        (locale, searchTerm) => {
          const results = filterFAQsByKeyword(testFAQs, searchTerm, locale)
          const normalizedTerm = searchTerm.trim().toLowerCase()

          if (!normalizedTerm) return // 空白搜索词返回全部结果

          for (const faq of results) {
            const question = faq.question[locale]?.toLowerCase() ?? ''
            const answer = faq.answer[locale]?.toLowerCase() ?? ''
            const contains = question.includes(normalizedTerm) || answer.includes(normalizedTerm)
            expect(contains).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('空搜索词返回全部 FAQ', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...locales),
        fc.constantFrom('', ' ', '  '),
        (locale, emptyQuery) => {
          const results = filterFAQsByKeyword(testFAQs, emptyQuery, locale)
          expect(results.length).toBe(testFAQs.length)
        }
      ),
      { numRuns: 30 }
    )
  })
})
