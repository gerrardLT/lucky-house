import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CookieConsent } from '../CookieConsent'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('CookieConsent', () => {
  let mockStorage: Record<string, string>

  beforeEach(() => {
    mockStorage = {}
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => mockStorage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => { mockStorage[key] = value }),
      removeItem: vi.fn((key: string) => { delete mockStorage[key] }),
    })
  })

  it('shows banner on first visit (no localStorage entry)', () => {
    render(<CookieConsent locale="zh" />)
    expect(screen.getByRole('region', { name: 'Cookie consent' })).toBeInTheDocument()
  })

  it('does not show banner if consent already accepted', () => {
    mockStorage['cookie_consent'] = 'accepted'
    render(<CookieConsent locale="zh" />)
    expect(screen.queryByRole('region', { name: 'Cookie consent' })).not.toBeInTheDocument()
  })

  it('hides banner and stores consent when Accept is clicked', () => {
    render(<CookieConsent locale="zh" />)
    const acceptButton = screen.getByRole('button', { name: '接受' })
    fireEvent.click(acceptButton)
    expect(localStorage.setItem).toHaveBeenCalledWith('cookie_consent', 'accepted')
    expect(screen.queryByRole('region', { name: 'Cookie consent' })).not.toBeInTheDocument()
  })

  it('renders privacy policy link with correct locale path', () => {
    render(<CookieConsent locale="en" />)
    const link = screen.getByRole('link', { name: 'Learn More' })
    expect(link).toHaveAttribute('href', '/en/privacy')
  })

  it('renders Japanese text for ja locale', () => {
    render(<CookieConsent locale="ja" />)
    expect(screen.getByRole('button', { name: '同意する' })).toBeInTheDocument()
  })

  it('renders English text for en locale', () => {
    render(<CookieConsent locale="en" />)
    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument()
  })

  it('has fixed bottom positioning with z-40', () => {
    render(<CookieConsent locale="zh" />)
    const banner = screen.getByRole('region', { name: 'Cookie consent' })
    expect(banner.className).toContain('fixed')
    expect(banner.className).toContain('bottom-0')
    expect(banner.className).toContain('z-40')
  })

  it('shows banner when localStorage throws (e.g. private browsing)', () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => { throw new Error('SecurityError') }),
      setItem: vi.fn(() => { throw new Error('SecurityError') }),
    })
    render(<CookieConsent locale="zh" />)
    expect(screen.getByRole('region', { name: 'Cookie consent' })).toBeInTheDocument()
  })
})
