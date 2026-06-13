import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { FAQSection } from '../FAQSection'
import type { FAQ } from '@/types'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

const mockFAQs: FAQ[] = [
  {
    id: 'faq-1',
    category: 'pet',
    question: { zh: '可以带宠物入住吗？', ja: 'ペットと宿泊できますか？', en: 'Can I bring my pet?' },
    answer: { zh: '是的，我们欢迎宠物入住。', ja: 'はい、ペットの宿泊を歓迎します。', en: 'Yes, pets are welcome.' },
    sortOrder: 1,
  },
  {
    id: 'faq-2',
    category: 'room-price',
    question: { zh: '房间价格是多少？', ja: '部屋の料金はいくらですか？', en: 'What is the room price?' },
    answer: { zh: '价格因房型而异，请联系我们获取最新报价。', ja: '料金は部屋タイプによって異なります。', en: 'Prices vary by room type.' },
    sortOrder: 2,
  },
  {
    id: 'faq-3',
    category: 'onsen',
    question: { zh: '温泉有什么类型？', ja: '温泉にはどのような種類がありますか？', en: 'What types of onsen are available?' },
    answer: { zh: '我们提供室内和室外温泉，包含宠物专用温泉。', ja: '室内外の温泉とペット専用温泉があります。', en: 'We offer indoor and outdoor onsen, including pet onsen.' },
    sortOrder: 3,
  },
  {
    id: 'faq-4',
    category: 'cancel',
    question: { zh: '取消政策是什么？', ja: 'キャンセルポリシーは？', en: 'What is the cancellation policy?' },
    answer: { zh: '入住前7天免费取消，之后收取一晚费用。', ja: 'チェックイン7日前まで無料キャンセル可能です。', en: 'Free cancellation up to 7 days before check-in.' },
    sortOrder: 4,
  },
]

describe('FAQSection', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders all FAQs by default', () => {
    render(<FAQSection faqs={mockFAQs} locale="zh" />)
    expect(screen.getByText('可以带宠物入住吗？')).toBeInTheDocument()
    expect(screen.getByText('房间价格是多少？')).toBeInTheDocument()
    expect(screen.getByText('温泉有什么类型？')).toBeInTheDocument()
    expect(screen.getByText('取消政策是什么？')).toBeInTheDocument()
  })

  it('renders search input with correct placeholder for zh locale', () => {
    render(<FAQSection faqs={mockFAQs} locale="zh" />)
    expect(screen.getByPlaceholderText('搜索常见问题...')).toBeInTheDocument()
  })

  it('renders category filter bar with all categories', () => {
    render(<FAQSection faqs={mockFAQs} locale="zh" />)
    expect(screen.getByText('全部')).toBeInTheDocument()
    expect(screen.getByText('宠物')).toBeInTheDocument()
    expect(screen.getByText('房型价格')).toBeInTheDocument()
    expect(screen.getByText('温泉')).toBeInTheDocument()
    expect(screen.getByText('设施')).toBeInTheDocument()
    expect(screen.getByText('交通')).toBeInTheDocument()
    expect(screen.getByText('活动')).toBeInTheDocument()
    expect(screen.getByText('取消退款')).toBeInTheDocument()
  })

  it('filters FAQs by category', () => {
    render(<FAQSection faqs={mockFAQs} locale="zh" />)
    fireEvent.click(screen.getByText('宠物'))
    expect(screen.getByText('可以带宠物入住吗？')).toBeInTheDocument()
    expect(screen.queryByText('房间价格是多少？')).not.toBeInTheDocument()
    expect(screen.queryByText('温泉有什么类型？')).not.toBeInTheDocument()
  })

  it('filters FAQs by keyword search with debounce', () => {
    render(<FAQSection faqs={mockFAQs} locale="zh" />)
    const searchInput = screen.getByPlaceholderText('搜索常见问题...')

    fireEvent.change(searchInput, { target: { value: '宠物' } })

    // Before debounce, all FAQs should still be visible
    expect(screen.getByText('房间价格是多少？')).toBeInTheDocument()

    // After debounce (300ms)
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByText('可以带宠物入住吗？')).toBeInTheDocument()
    // faq-3 answer contains 宠物 so it should also appear
    expect(screen.getByText('温泉有什么类型？')).toBeInTheDocument()
    expect(screen.queryByText('房间价格是多少？')).not.toBeInTheDocument()
  })

  it('search matches answer text as well', () => {
    render(<FAQSection faqs={mockFAQs} locale="zh" />)
    const searchInput = screen.getByPlaceholderText('搜索常见问题...')

    fireEvent.change(searchInput, { target: { value: '免费取消' } })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByText('取消政策是什么？')).toBeInTheDocument()
    expect(screen.queryByText('可以带宠物入住吗？')).not.toBeInTheDocument()
  })

  it('search is case-insensitive', () => {
    render(<FAQSection faqs={mockFAQs} locale="en" />)
    const searchInput = screen.getByPlaceholderText('Search FAQ...')

    fireEvent.change(searchInput, { target: { value: 'PET' } })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByText('Can I bring my pet?')).toBeInTheDocument()
    // faq-3 answer contains "pet onsen"
    expect(screen.getByText('What types of onsen are available?')).toBeInTheDocument()
  })

  it('filter and search work together (intersection)', () => {
    render(<FAQSection faqs={mockFAQs} locale="zh" />)

    // First filter by onsen category
    fireEvent.click(screen.getByText('温泉'))

    // Then search for 宠物
    const searchInput = screen.getByPlaceholderText('搜索常见问题...')
    fireEvent.change(searchInput, { target: { value: '宠物' } })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Only faq-3 belongs to onsen category AND mentions 宠物 in the answer
    expect(screen.getByText('温泉有什么类型？')).toBeInTheDocument()
    expect(screen.queryByText('可以带宠物入住吗？')).not.toBeInTheDocument()
  })

  it('shows "contact us" link when search has no results', () => {
    render(<FAQSection faqs={mockFAQs} locale="zh" />)
    const searchInput = screen.getByPlaceholderText('搜索常见问题...')

    fireEvent.change(searchInput, { target: { value: '完全不存在的内容xyz' } })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByText('没有找到相关问题？')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /联系我们/ })
    expect(link).toHaveAttribute('href', '/zh/contact')
  })

  it('shows correct "no results" content for ja locale', () => {
    render(<FAQSection faqs={mockFAQs} locale="ja" />)
    const searchInput = screen.getByPlaceholderText('よくある質問を検索...')

    fireEvent.change(searchInput, { target: { value: 'zzzzzzz' } })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByText('関連する質問が見つかりませんか？')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /お問い合わせ/ })
    expect(link).toHaveAttribute('href', '/ja/contact')
  })

  it('renders in en locale correctly', () => {
    render(<FAQSection faqs={mockFAQs} locale="en" />)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Pets')).toBeInTheDocument()
    expect(screen.getByText('Can I bring my pet?')).toBeInTheDocument()
  })

  it('shows no results when category has no matching FAQs', () => {
    render(<FAQSection faqs={mockFAQs} locale="zh" />)
    // 'transport' category has no FAQs in our mock data
    fireEvent.click(screen.getByText('交通'))
    expect(screen.getByText('没有找到相关问题？')).toBeInTheDocument()
  })
})
