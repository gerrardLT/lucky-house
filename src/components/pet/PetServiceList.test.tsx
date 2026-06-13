import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PetServiceList } from './PetServiceList'
import type { Facility } from '@/types'

const mockFacilities: Facility[] = [
  {
    slug: 'pet-onsen',
    category: 'pet-service',
    name: { zh: '宠物温泉', ja: 'ペット温泉', en: 'Pet Onsen' },
    description: {
      zh: '专为毛孩子打造的温泉浴池',
      ja: 'わんちゃん専用の温泉浴槽',
      en: 'A dedicated hot spring bath for pets',
    },
    status: 'opening_soon',
    icon: 'pet-bath',
    linkedFAQ: 'faq-pet-onsen',
    linkedBooking: true,
    sortOrder: 1,
  },
  {
    slug: 'dog-run-outdoor',
    category: 'pet-service',
    name: { zh: '室外 Dog Run', ja: '屋外ドッグラン', en: 'Outdoor Dog Run' },
    description: {
      zh: '超过500平方米的跑场',
      ja: '500㎡以上のドッグラン',
      en: 'Over 500 sqm running area',
    },
    status: 'open',
    icon: 'dog-run',
    linkedFAQ: 'faq-dog-run',
    linkedBooking: false,
    sortOrder: 2,
  },
  {
    slug: 'grooming-station',
    category: 'pet-service',
    name: { zh: '宠物梳理 & 吹干站', ja: 'グルーミング＆ドライステーション', en: 'Grooming & Drying Station' },
    description: {
      zh: '配备专业吹水机的自助服务站',
      ja: 'プロ仕様のブロワーを備えたセルフサービスステーション',
      en: 'Self-service station with professional blow dryers',
    },
    status: 'opening_soon',
    icon: 'grooming',
    linkedBooking: false,
    sortOrder: 3,
  },
  {
    slug: 'bbq-terrace',
    category: 'dining',
    name: { zh: 'BBQ 露台', ja: 'BBQテラス', en: 'BBQ Terrace' },
    description: {
      zh: '户外BBQ区域',
      ja: '屋外BBQエリア',
      en: 'Outdoor BBQ area',
    },
    status: 'open',
    icon: 'bbq',
    linkedBooking: true,
    sortOrder: 7,
  },
]

describe('PetServiceList', () => {
  it('仅显示 pet-service 类设施', () => {
    render(<PetServiceList facilities={mockFacilities} locale="zh" />)
    expect(screen.getByText('宠物温泉')).toBeInTheDocument()
    expect(screen.getByText('室外 Dog Run')).toBeInTheDocument()
    expect(screen.getByText('宠物梳理 & 吹干站')).toBeInTheDocument()
    // 非 pet-service 类不应出现
    expect(screen.queryByText('BBQ 露台')).not.toBeInTheDocument()
  })

  it('显示设施描述', () => {
    render(<PetServiceList facilities={mockFacilities} locale="zh" />)
    expect(screen.getByText('专为毛孩子打造的温泉浴池')).toBeInTheDocument()
  })

  it('open 状态显示绿色"已开放"标签', () => {
    render(<PetServiceList facilities={mockFacilities} locale="zh" />)
    expect(screen.getByText('已开放')).toBeInTheDocument()
  })

  it('opening_soon 状态显示黄色"即将开放"标签', () => {
    render(<PetServiceList facilities={mockFacilities} locale="zh" />)
    expect(screen.getAllByText('即将开放')).toHaveLength(2) // 宠物温泉 + 梳理站
  })

  it('linkedBooking 为 true 时显示"预约"按钮', () => {
    render(<PetServiceList facilities={mockFacilities} locale="zh" />)
    const bookingButtons = screen.getAllByText('预约')
    expect(bookingButtons).toHaveLength(1) // 只有宠物温泉有 linkedBooking
  })

  it('linkedBooking 为 false 时不显示预约按钮', () => {
    const noBooking: Facility[] = [
      { ...mockFacilities[1], linkedBooking: false },
    ]
    render(<PetServiceList facilities={noBooking} locale="zh" />)
    expect(screen.queryByText('预约')).not.toBeInTheDocument()
  })

  it('预约按钮链接到正确的预约页', () => {
    render(<PetServiceList facilities={mockFacilities} locale="zh" />)
    const bookingLink = screen.getByText('预约')
    expect(bookingLink).toHaveAttribute('href', '/zh/booking')
  })

  it('多语言支持 - 日文', () => {
    render(<PetServiceList facilities={mockFacilities} locale="ja" />)
    expect(screen.getByText('ペット温泉')).toBeInTheDocument()
    expect(screen.getByText('営業中')).toBeInTheDocument()
    expect(screen.getAllByText('近日オープン')).toHaveLength(2)
    expect(screen.getByText('予約')).toBeInTheDocument()
  })

  it('多语言支持 - 英文', () => {
    render(<PetServiceList facilities={mockFacilities} locale="en" />)
    expect(screen.getByText('Pet Onsen')).toBeInTheDocument()
    expect(screen.getByText('Open')).toBeInTheDocument()
    expect(screen.getAllByText('Opening Soon')).toHaveLength(2)
    expect(screen.getByText('Book')).toBeInTheDocument()
  })

  it('无 pet-service 设施时不渲染任何内容', () => {
    const nonPet: Facility[] = [mockFacilities[3]] // only dining
    const { container } = render(<PetServiceList facilities={nonPet} locale="zh" />)
    expect(container.innerHTML).toBe('')
  })

  it('按 sortOrder 排序显示', () => {
    const reversed: Facility[] = [...mockFacilities].reverse()
    render(<PetServiceList facilities={reversed} locale="zh" />)
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('宠物温泉')
    expect(items[1]).toHaveTextContent('室外 Dog Run')
    expect(items[2]).toHaveTextContent('宠物梳理 & 吹干站')
  })

  it('显示图标 emoji', () => {
    render(<PetServiceList facilities={mockFacilities} locale="zh" />)
    expect(screen.getByText('🛁')).toBeInTheDocument() // pet-bath
    expect(screen.getByText('🐕')).toBeInTheDocument() // dog-run
    expect(screen.getByText('✂️')).toBeInTheDocument() // grooming
  })
})
