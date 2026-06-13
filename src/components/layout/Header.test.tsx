import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Header } from './Header'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('Header', () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  })

  describe('Desktop Navigation (zh)', () => {
    it('renders the brand/logo link', () => {
      render(<Header locale="zh" />)
      const logo = screen.getByText('Lucky House')
      expect(logo).toBeInTheDocument()
      expect(logo.closest('a')).toHaveAttribute('href', '/zh')
    })

    it('renders all 9 navigation links', () => {
      render(<Header locale="zh" />)
      expect(screen.getByText('首页')).toBeInTheDocument()
      expect(screen.getByText('住宿房型')).toBeInTheDocument()
      expect(screen.getByText('宠物友好')).toBeInTheDocument()
      expect(screen.getByText('温泉与设施')).toBeInTheDocument()
      expect(screen.getByText('活动社群')).toBeInTheDocument()
      expect(screen.getByText('周边探索')).toBeInTheDocument()
      expect(screen.getByText('画廊')).toBeInTheDocument()
      expect(screen.getByText('常见问题')).toBeInTheDocument()
      expect(screen.getByText('联系我们')).toBeInTheDocument()
    })

    it('renders the CTA booking button', () => {
      render(<Header locale="zh" />)
      const ctaButton = screen.getByText('立即预约')
      expect(ctaButton).toBeInTheDocument()
      expect(ctaButton.closest('a')).toHaveAttribute('href', '/zh/booking')
    })

    it('renders navigation links with correct hrefs', () => {
      render(<Header locale="zh" />)
      expect(screen.getByText('首页').closest('a')).toHaveAttribute('href', '/zh')
      expect(screen.getByText('住宿房型').closest('a')).toHaveAttribute('href', '/zh/stay')
      expect(screen.getByText('宠物友好').closest('a')).toHaveAttribute('href', '/zh/pet-friendly')
      expect(screen.getByText('温泉与设施').closest('a')).toHaveAttribute('href', '/zh/facilities')
      expect(screen.getByText('活动社群').closest('a')).toHaveAttribute('href', '/zh/activities')
      expect(screen.getByText('周边探索').closest('a')).toHaveAttribute('href', '/zh/explore')
      expect(screen.getByText('画廊').closest('a')).toHaveAttribute('href', '/zh/gallery')
      expect(screen.getByText('常见问题').closest('a')).toHaveAttribute('href', '/zh/faq')
      expect(screen.getByText('联系我们').closest('a')).toHaveAttribute('href', '/zh/contact')
    })
  })

  describe('Desktop Navigation (en)', () => {
    it('renders navigation items in English', () => {
      render(<Header locale="en" />)
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Accommodations')).toBeInTheDocument()
      expect(screen.getByText('Pet Friendly')).toBeInTheDocument()
      expect(screen.getByText('Onsen & Facilities')).toBeInTheDocument()
      expect(screen.getByText('Events & Community')).toBeInTheDocument()
      expect(screen.getByText('Explore Nearby')).toBeInTheDocument()
      expect(screen.getByText('Gallery')).toBeInTheDocument()
      expect(screen.getByText('FAQ')).toBeInTheDocument()
      expect(screen.getByText('Contact Us')).toBeInTheDocument()
    })

    it('renders CTA button with correct locale href', () => {
      render(<Header locale="en" />)
      const ctaButton = screen.getByText('Book Now')
      expect(ctaButton.closest('a')).toHaveAttribute('href', '/en/booking')
    })
  })

  describe('Desktop Navigation (ja)', () => {
    it('renders navigation items in Japanese', () => {
      render(<Header locale="ja" />)
      expect(screen.getByText('ホーム')).toBeInTheDocument()
      expect(screen.getByText('客室・宿泊')).toBeInTheDocument()
      expect(screen.getByText('ペットと一緒に')).toBeInTheDocument()
    })
  })

  describe('Sticky Compact Mode', () => {
    it('starts in non-compact mode', () => {
      render(<Header locale="zh" />)
      const header = screen.getByRole('banner')
      expect(header.className).toContain('py-4')
      expect(header.className).not.toContain('py-2')
    })

    it('switches to compact mode when scrolled past threshold', () => {
      render(<Header locale="zh" />)

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
        fireEvent.scroll(window)
      })

      const header = screen.getByRole('banner')
      expect(header.className).toContain('py-2')
      expect(header.className).toContain('shadow-md')
    })

    it('returns to normal mode when scrolled back to top', () => {
      render(<Header locale="zh" />)

      // Scroll down
      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
        fireEvent.scroll(window)
      })

      // Scroll back up
      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
        fireEvent.scroll(window)
      })

      const header = screen.getByRole('banner')
      expect(header.className).toContain('py-4')
      expect(header.className).not.toContain('shadow-md')
    })

    it('compact mode reduces logo text size', () => {
      render(<Header locale="zh" />)

      const logoLink = screen.getByText('Lucky House')

      // Initially large
      expect(logoLink.className).toContain('text-xl')

      // Scroll to trigger compact
      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
        fireEvent.scroll(window)
      })

      expect(logoLink.className).toContain('text-lg')
    })
  })

  describe('Accessibility', () => {
    it('has proper nav landmark with aria-label', () => {
      render(<Header locale="zh" />)
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('aria-label')
    })

    it('has proper banner role on header element', () => {
      render(<Header locale="zh" />)
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('hamburger button has aria-label', () => {
      render(<Header locale="zh" />)
      const hamburger = screen.getByRole('button')
      expect(hamburger).toHaveAttribute('aria-label')
    })

    it('logo has aria-label', () => {
      render(<Header locale="zh" />)
      const logo = screen.getByLabelText('Lucky House - Home')
      expect(logo).toBeInTheDocument()
    })
  })

  describe('Mobile Hamburger Menu', () => {
    it('renders hamburger menu button', () => {
      render(<Header locale="zh" />)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('hamburger button has aria-expanded=false', () => {
      render(<Header locale="zh" />)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Language Switcher Placeholder', () => {
    it('displays current language name', () => {
      render(<Header locale="zh" />)
      expect(screen.getByText('中文')).toBeInTheDocument()
    })

    it('displays English for en locale', () => {
      render(<Header locale="en" />)
      expect(screen.getByText('English')).toBeInTheDocument()
    })

    it('displays Japanese for ja locale', () => {
      render(<Header locale="ja" />)
      expect(screen.getByText('日本語')).toBeInTheDocument()
    })
  })
})
