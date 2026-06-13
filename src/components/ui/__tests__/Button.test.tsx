import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../Button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>立即预约</Button>)
    expect(screen.getByRole('button', { name: '立即预约' })).toBeInTheDocument()
  })

  it('applies primary variant styles by default', () => {
    render(<Button>Click</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-green-700')
  })

  it('applies secondary variant styles', () => {
    render(<Button variant="secondary">Click</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-stone-200')
  })

  it('applies ghost variant styles', () => {
    render(<Button variant="ghost">Click</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-transparent')
  })

  it('applies outline variant styles', () => {
    render(<Button variant="outline">Click</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('border')
  })

  it('applies size sm styles', () => {
    render(<Button size="sm">Click</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('px-3')
  })

  it('applies size lg styles', () => {
    render(<Button size="lg">Click</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('px-7')
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when loading is true', () => {
    render(<Button loading>Click</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-busy', 'true')
  })

  it('shows loading spinner when loading', () => {
    render(<Button loading>Submitting</Button>)
    const svg = screen.getByRole('button').querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders as a link when href is provided', () => {
    render(<Button href="/booking">Book</Button>)
    const link = screen.getByRole('link', { name: 'Book' })
    expect(link).toHaveAttribute('href', '/booking')
  })

  it('renders as button (not link) when href provided but disabled', () => {
    render(<Button href="/booking" disabled>Book</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('accepts custom className', () => {
    render(<Button className="mt-4">Click</Button>)
    expect(screen.getByRole('button').className).toContain('mt-4')
  })

  it('sets aria-label when provided', () => {
    render(<Button aria-label="Submit booking">OK</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Submit booking')
  })
})
