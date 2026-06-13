import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MobileDrawerNav } from '../MobileDrawerNav'

describe('MobileDrawerNav', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    locale: 'zh' as const,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('renders dialog with proper ARIA attributes when open', () => {
    render(<MobileDrawerNav {...defaultProps} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('renders all 9 navigation items', () => {
    render(<MobileDrawerNav {...defaultProps} />)
    expect(screen.getByText('首页')).toBeInTheDocument()
    expect(screen.getByText('住宿房型')).toBeInTheDocument()
    expect(screen.getByText('宠物友好')).toBeInTheDocument()
    expect(screen.getByText('温泉与设施')).toBeInTheDocument()
    expect(screen.getByText('活动社群')).toBeInTheDocument()
    expect(screen.getByText('周边探索')).toBeInTheDocument()
    expect(screen.getByText('画廊')).toBeInTheDocument()
    expect(screen.getByText('常见问题')).toBeInTheDocument()
    // "立即预约" appears in both nav items and bottom CTA
    const bookingItems = screen.getAllByText('立即预约')
    expect(bookingItems.length).toBeGreaterThanOrEqual(1)
  })

  it('renders close button with proper aria-label', () => {
    render(<MobileDrawerNav {...defaultProps} />)
    const closeBtn = screen.getByRole('button', { name: '关闭' })
    expect(closeBtn).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(<MobileDrawerNav {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: '关闭' }))
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', () => {
    render(<MobileDrawerNav {...defaultProps} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop overlay is clicked', () => {
    render(<MobileDrawerNav {...defaultProps} />)
    // The backdrop is the first child with aria-hidden="true"
    const backdrop = document.querySelector('[aria-hidden="true"]')
    expect(backdrop).toBeInTheDocument()
    fireEvent.click(backdrop!)
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('prevents body scroll when open', () => {
    render(<MobileDrawerNav {...defaultProps} />)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body scroll when closed', () => {
    const { rerender } = render(<MobileDrawerNav {...defaultProps} />)
    expect(document.body.style.overflow).toBe('hidden')
    rerender(<MobileDrawerNav {...defaultProps} isOpen={false} />)
    expect(document.body.style.overflow).toBe('')
  })

  it('renders fixed bottom booking CTA button', () => {
    render(<MobileDrawerNav {...defaultProps} />)
    // The bottom CTA "立即预约" as a link to booking
    const bookingLinks = screen.getAllByText('立即预约')
    // One in nav items, one in bottom CTA
    expect(bookingLinks.length).toBeGreaterThanOrEqual(2)
  })

  it('renders language switcher with 3 language options', () => {
    render(<MobileDrawerNav {...defaultProps} />)
    expect(screen.getByText('中文')).toBeInTheDocument()
    expect(screen.getByText('日本語')).toBeInTheDocument()
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('highlights current locale in language switcher', () => {
    render(<MobileDrawerNav {...defaultProps} locale="zh" />)
    const zhLink = screen.getByLabelText('中文')
    expect(zhLink.className).toContain('bg-amber-600')
    expect(zhLink).toHaveAttribute('aria-current', 'true')
  })

  it('calls onClose when a nav item is clicked', () => {
    render(<MobileDrawerNav {...defaultProps} />)
    fireEvent.click(screen.getByText('住宿房型'))
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('generates correct href paths with locale prefix', () => {
    render(<MobileDrawerNav {...defaultProps} locale="ja" />)
    // When locale is 'ja', nav items are in Japanese
    const stayLink = screen.getByText('客室・宿泊')
    expect(stayLink).toHaveAttribute('href', '/ja/stay')
  })

  it('is visually hidden (translated off-screen) when closed', () => {
    render(<MobileDrawerNav {...defaultProps} isOpen={false} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.className).toContain('translate-x-full')
  })

  it('is visible (translate-x-0) when open', () => {
    render(<MobileDrawerNav {...defaultProps} isOpen={true} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.className).toContain('translate-x-0')
  })
})
