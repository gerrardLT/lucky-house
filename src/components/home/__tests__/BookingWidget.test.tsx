import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BookingWidget } from '../BookingWidget'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('BookingWidget', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders nothing when visible is false', () => {
    const { container } = render(<BookingWidget visible={false} locale="zh" />)
    expect(container.innerHTML).toBe('')
  })

  it('renders the form when visible is true', () => {
    render(<BookingWidget visible={true} locale="zh" />)
    expect(screen.getByLabelText('入住日期')).toBeInTheDocument()
    expect(screen.getByLabelText('退房日期')).toBeInTheDocument()
    expect(screen.getByLabelText('成人')).toBeInTheDocument()
    expect(screen.getByLabelText('携带宠物')).toBeInTheDocument()
  })

  it('renders English labels for en locale', () => {
    render(<BookingWidget visible={true} locale="en" />)
    expect(screen.getByLabelText('Check-in')).toBeInTheDocument()
    expect(screen.getByLabelText('Check-out')).toBeInTheDocument()
    expect(screen.getByLabelText('Adults')).toBeInTheDocument()
    expect(screen.getByLabelText('Bringing Pet')).toBeInTheDocument()
  })

  it('renders Japanese labels for ja locale', () => {
    render(<BookingWidget visible={true} locale="ja" />)
    expect(screen.getByLabelText('チェックイン')).toBeInTheDocument()
    expect(screen.getByLabelText('チェックアウト')).toBeInTheDocument()
    expect(screen.getByLabelText('大人')).toBeInTheDocument()
    expect(screen.getByLabelText('ペット同伴')).toBeInTheDocument()
  })

  it('pet checkbox is unchecked by default', () => {
    render(<BookingWidget visible={true} locale="zh" />)
    const petCheckbox = screen.getByLabelText('携带宠物') as HTMLInputElement
    expect(petCheckbox.checked).toBe(false)
  })

  it('navigates to stay page with query params on submit', () => {
    render(<BookingWidget visible={true} locale="zh" />)

    // Change adults to 3
    fireEvent.change(screen.getByLabelText('成人'), { target: { value: '3' } })
    // Check pet
    fireEvent.click(screen.getByLabelText('携带宠物'))

    // Submit form
    fireEvent.click(screen.getByText('查看可用房型'))

    expect(mockPush).toHaveBeenCalledTimes(1)
    const pushUrl = mockPush.mock.calls[0][0] as string
    expect(pushUrl).toContain('/zh/stay?')
    expect(pushUrl).toContain('adults=3')
    expect(pushUrl).toContain('hasPet=true')
  })

  it('navigates with correct locale prefix for en', () => {
    render(<BookingWidget visible={true} locale="en" />)
    fireEvent.click(screen.getByText('Check Availability'))

    const pushUrl = mockPush.mock.calls[0][0] as string
    expect(pushUrl.startsWith('/en/stay?')).toBe(true)
  })

  it('adults select has options 1-6', () => {
    render(<BookingWidget visible={true} locale="zh" />)
    const select = screen.getByLabelText('成人') as HTMLSelectElement
    expect(select.options.length).toBe(6)
    expect(select.options[0].value).toBe('1')
    expect(select.options[5].value).toBe('6')
  })

  it('has accessible form with labels', () => {
    render(<BookingWidget visible={true} locale="zh" />)
    // All inputs should have associated labels
    expect(screen.getByLabelText('入住日期')).toHaveAttribute('id', 'bw-checkin')
    expect(screen.getByLabelText('退房日期')).toHaveAttribute('id', 'bw-checkout')
    expect(screen.getByLabelText('成人')).toHaveAttribute('id', 'bw-adults')
    expect(screen.getByLabelText('携带宠物')).toHaveAttribute('id', 'bw-pet')
  })
})
