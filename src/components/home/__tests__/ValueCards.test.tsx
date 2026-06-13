import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ValueCards } from '../ValueCards'
import type { Locale } from '@/types'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

const mockCards: Array<{
  icon: string
  title: Record<Locale, string>
  description: Record<Locale, string>
  link: string
}> = [
  {
    icon: '🐾',
    title: { zh: '宠物友好温泉', ja: 'ペットフレンドリー温泉', en: 'Pet-Friendly Onsen' },
    description: {
      zh: '专属宠物温泉和完善的宠物设施',
      ja: '専用ペット温泉と充実した設備',
      en: 'Dedicated pet onsen and complete pet facilities',
    },
    link: '/pet-friendly',
  },
  {
    icon: '🌿',
    title: { zh: '零碳自然营地', ja: 'ゼロカーボン自然キャンプ', en: 'Zero-Carbon Nature Camp' },
    description: {
      zh: '光伏树下的可持续度假体验',
      ja: 'ソーラーツリーの下でサステナブルな休暇',
      en: 'Sustainable holiday under solar trees',
    },
    link: '/facilities',
  },
  {
    icon: '🎉',
    title: { zh: '周末社群活动', ja: '週末コミュニティイベント', en: 'Weekend Community Events' },
    description: {
      zh: '与宠物一起参加户外社群活动',
      ja: 'ペットと一緒にアウトドアイベントに参加',
      en: 'Join outdoor events with your pet',
    },
    link: '/activities',
  },
]

describe('ValueCards', () => {
  it('renders all three cards', () => {
    render(<ValueCards cards={mockCards} locale="zh" />)
    expect(screen.getByText('宠物友好温泉')).toBeInTheDocument()
    expect(screen.getByText('零碳自然营地')).toBeInTheDocument()
    expect(screen.getByText('周末社群活动')).toBeInTheDocument()
  })

  it('renders card descriptions', () => {
    render(<ValueCards cards={mockCards} locale="zh" />)
    expect(screen.getByText('专属宠物温泉和完善的宠物设施')).toBeInTheDocument()
    expect(screen.getByText('光伏树下的可持续度假体验')).toBeInTheDocument()
    expect(screen.getByText('与宠物一起参加户外社群活动')).toBeInTheDocument()
  })

  it('renders icons', () => {
    render(<ValueCards cards={mockCards} locale="zh" />)
    expect(screen.getByText('🐾')).toBeInTheDocument()
    expect(screen.getByText('🌿')).toBeInTheDocument()
    expect(screen.getByText('🎉')).toBeInTheDocument()
  })

  it('renders "了解更多" links with correct hrefs', () => {
    render(<ValueCards cards={mockCards} locale="zh" />)
    const links = screen.getAllByText('了解更多')
    expect(links).toHaveLength(3)
    expect(links[0].closest('a')).toHaveAttribute('href', '/zh/pet-friendly')
    expect(links[1].closest('a')).toHaveAttribute('href', '/zh/facilities')
    expect(links[2].closest('a')).toHaveAttribute('href', '/zh/activities')
  })

  it('renders English content and links with en locale', () => {
    render(<ValueCards cards={mockCards} locale="en" />)
    expect(screen.getByText('Pet-Friendly Onsen')).toBeInTheDocument()
    expect(screen.getByText('Zero-Carbon Nature Camp')).toBeInTheDocument()
    expect(screen.getByText('Weekend Community Events')).toBeInTheDocument()

    const links = screen.getAllByText('Learn More')
    expect(links).toHaveLength(3)
    expect(links[0].closest('a')).toHaveAttribute('href', '/en/pet-friendly')
  })

  it('renders Japanese content with ja locale', () => {
    render(<ValueCards cards={mockCards} locale="ja" />)
    expect(screen.getByText('ペットフレンドリー温泉')).toBeInTheDocument()
    expect(screen.getByText('ゼロカーボン自然キャンプ')).toBeInTheDocument()
    expect(screen.getByText('週末コミュニティイベント')).toBeInTheDocument()

    const links = screen.getAllByText('もっと見る')
    expect(links).toHaveLength(3)
  })

  it('renders as article elements for semantic HTML', () => {
    const { container } = render(<ValueCards cards={mockCards} locale="zh" />)
    const articles = container.querySelectorAll('article')
    expect(articles).toHaveLength(3)
  })
})
