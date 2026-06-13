import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { HeroSection } from '../HeroSection'
import type { GalleryAsset, Locale } from '@/types'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, priority, ...props }: { src: string; alt: string; priority?: boolean; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-priority={priority ? 'true' : undefined} {...props} />
  ),
}))

// Mock BookingWidget
vi.mock('../BookingWidget', () => ({
  BookingWidget: ({ visible, locale, embedded }: { visible: boolean; locale: string; embedded?: boolean }) => (
    visible ? (
      <div data-testid="booking-widget" data-locale={locale} data-embedded={embedded ? 'true' : 'false'}>
        BookingWidget
      </div>
    ) : null
  ),
}))

const mockImage: GalleryAsset = {
  id: 'hero-1',
  src: '/images/hero.jpg',
  alt: { zh: '温泉全景', ja: '温泉パノラマ', en: 'Onsen Panorama' },
  category: 'room',
  isRendering: false,
  sortOrder: 1,
  width: 1920,
  height: 1080,
}

const mockTitle: Record<Locale, string> = {
  zh: '福岛岳温泉零碳宠物营地',
  ja: '福島岳温泉ゼロカーボンペットキャンプ',
  en: 'Fukushima Onsen Zero-Carbon Pet Camp',
}

const mockSubtitle: Record<Locale, string> = {
  zh: '携宠家庭的温泉度假首选',
  ja: 'ペット連れ家族の温泉リゾート',
  en: 'The Premier Onsen Resort for Pet Families',
}

describe('HeroSection', () => {
  it('renders the hero image with priority loading', () => {
    render(
      <HeroSection image={mockImage} title={mockTitle} subtitle={mockSubtitle} locale="zh" bookingVisible={true} />
    )
    const img = screen.getByAltText('温泉全景')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('data-priority', 'true')
  })

  it('renders title and subtitle in Chinese', () => {
    render(
      <HeroSection image={mockImage} title={mockTitle} subtitle={mockSubtitle} locale="zh" bookingVisible={true} />
    )
    expect(screen.getByText('福岛岳温泉零碳宠物营地')).toBeInTheDocument()
    expect(screen.getByText('携宠家庭的温泉度假首选')).toBeInTheDocument()
  })

  it('renders title and subtitle in English', () => {
    render(
      <HeroSection image={mockImage} title={mockTitle} subtitle={mockSubtitle} locale="en" bookingVisible={true} />
    )
    expect(screen.getByText('Fukushima Onsen Zero-Carbon Pet Camp')).toBeInTheDocument()
    expect(screen.getByText('The Premier Onsen Resort for Pet Families')).toBeInTheDocument()
  })

  it('renders title and subtitle in Japanese', () => {
    render(
      <HeroSection image={mockImage} title={mockTitle} subtitle={mockSubtitle} locale="ja" bookingVisible={true} />
    )
    expect(screen.getByText('福島岳温泉ゼロカーボンペットキャンプ')).toBeInTheDocument()
    expect(screen.getByText('ペット連れ家族の温泉リゾート')).toBeInTheDocument()
  })

  it('does not render CTA buttons (removed in favor of embedded BookingWidget)', () => {
    render(
      <HeroSection image={mockImage} title={mockTitle} subtitle={mockSubtitle} locale="zh" bookingVisible={true} />
    )
    expect(screen.queryByText('立即预约')).not.toBeInTheDocument()
    expect(screen.queryByText('了解更多')).not.toBeInTheDocument()
  })

  it('renders embedded BookingWidget when bookingVisible is true', () => {
    render(
      <HeroSection image={mockImage} title={mockTitle} subtitle={mockSubtitle} locale="zh" bookingVisible={true} />
    )
    const widget = screen.getByTestId('booking-widget')
    expect(widget).toBeInTheDocument()
    expect(widget).toHaveAttribute('data-embedded', 'true')
    expect(widget).toHaveAttribute('data-locale', 'zh')
  })

  it('does not render BookingWidget when bookingVisible is false', () => {
    render(
      <HeroSection image={mockImage} title={mockTitle} subtitle={mockSubtitle} locale="zh" bookingVisible={false} />
    )
    expect(screen.queryByTestId('booking-widget')).not.toBeInTheDocument()
  })

  it('shows "示意图" label when image.isRendering is true', () => {
    const renderingImage = { ...mockImage, isRendering: true }
    render(
      <HeroSection image={renderingImage} title={mockTitle} subtitle={mockSubtitle} locale="zh" bookingVisible={true} />
    )
    expect(screen.getByText('示意图')).toBeInTheDocument()
  })

  it('does NOT show "示意图" label when image.isRendering is false', () => {
    render(
      <HeroSection image={mockImage} title={mockTitle} subtitle={mockSubtitle} locale="zh" bookingVisible={true} />
    )
    expect(screen.queryByText('示意图')).not.toBeInTheDocument()
  })

  it('uses font-serif class on h1 title', () => {
    render(
      <HeroSection image={mockImage} title={mockTitle} subtitle={mockSubtitle} locale="zh" bookingVisible={true} />
    )
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('font-serif')
  })

  it('has content container with z-10 for stacking above gradient overlay', () => {
    const { container } = render(
      <HeroSection image={mockImage} title={mockTitle} subtitle={mockSubtitle} locale="zh" bookingVisible={true} />
    )
    const contentContainer = container.querySelector('.z-10.flex.flex-col.justify-between')
    expect(contentContainer).toBeInTheDocument()
  })
})
