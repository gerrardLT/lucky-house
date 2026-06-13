import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PriceDisplay } from './PriceDisplay'

// Mock next/link to render as a simple anchor tag
vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

describe('PriceDisplay', () => {
  describe('status: available', () => {
    it('renders the price with ¥ symbol and /晚 suffix for zh locale', () => {
      render(<PriceDisplay status="available" price={15000} locale="zh" />)
      expect(screen.getByText('¥15,000')).toBeInTheDocument()
      expect(screen.getByText('/晚')).toBeInTheDocument()
    })

    it('renders the price with /泊 suffix for ja locale', () => {
      render(<PriceDisplay status="available" price={25000} locale="ja" />)
      expect(screen.getByText('¥25,000')).toBeInTheDocument()
      expect(screen.getByText('/泊')).toBeInTheDocument()
    })

    it('renders the price with /night suffix for en locale', () => {
      render(<PriceDisplay status="available" price={8000} locale="en" />)
      expect(screen.getByText('¥8,000')).toBeInTheDocument()
      expect(screen.getByText('/night')).toBeInTheDocument()
    })

    it('formats large numbers with locale-appropriate separators', () => {
      render(<PriceDisplay status="available" price={150000} locale="zh" />)
      expect(screen.getByText('¥150,000')).toBeInTheDocument()
    })

    it('falls back to coming_soon text when price is undefined', () => {
      render(<PriceDisplay status="available" locale="zh" />)
      expect(screen.getByText('即将公布')).toBeInTheDocument()
    })
  })

  describe('status: coming_soon', () => {
    it('renders "即将公布" for zh locale', () => {
      render(<PriceDisplay status="coming_soon" locale="zh" />)
      expect(screen.getByText('即将公布')).toBeInTheDocument()
    })

    it('renders "近日公開" for ja locale', () => {
      render(<PriceDisplay status="coming_soon" locale="ja" />)
      expect(screen.getByText('近日公開')).toBeInTheDocument()
    })

    it('renders "Coming Soon" for en locale', () => {
      render(<PriceDisplay status="coming_soon" locale="en" />)
      expect(screen.getByText('Coming Soon')).toBeInTheDocument()
    })

    it('renders with muted/italic styling', () => {
      const { container } = render(<PriceDisplay status="coming_soon" locale="zh" />)
      const span = container.querySelector('span')
      expect(span?.className).toContain('text-gray-400')
      expect(span?.className).toContain('italic')
    })
  })

  describe('status: inquiry', () => {
    it('renders a link with "预约获取价格" text for zh locale', () => {
      render(<PriceDisplay status="inquiry" locale="zh" />)
      const link = screen.getByRole('link', { name: '预约获取价格' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/zh/booking')
    })

    it('renders a link with "ご予約でお見積り" text for ja locale', () => {
      render(<PriceDisplay status="inquiry" locale="ja" />)
      const link = screen.getByRole('link', { name: 'ご予約でお見積り' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/ja/booking')
    })

    it('renders a link with "Inquire for Price" text for en locale', () => {
      render(<PriceDisplay status="inquiry" locale="en" />)
      const link = screen.getByRole('link', { name: 'Inquire for Price' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/en/booking')
    })
  })

  describe('default locale', () => {
    it('defaults to zh when locale is not specified', () => {
      render(<PriceDisplay status="coming_soon" />)
      expect(screen.getByText('即将公布')).toBeInTheDocument()
    })
  })

  describe('className prop', () => {
    it('applies custom className to the rendered element', () => {
      const { container } = render(
        <PriceDisplay status="coming_soon" locale="zh" className="custom-class" />
      )
      const span = container.querySelector('span')
      expect(span?.className).toContain('custom-class')
    })
  })
})
