import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card } from '../Card'

describe('Card', () => {
  it('renders children content', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies default padding (md)', () => {
    const { container } = render(<Card>Content</Card>)
    const paddingDiv = container.querySelector('.p-5')
    expect(paddingDiv).toBeInTheDocument()
  })

  it('applies sm padding', () => {
    const { container } = render(<Card padding="sm">Content</Card>)
    expect(container.querySelector('.p-3')).toBeInTheDocument()
  })

  it('applies lg padding', () => {
    const { container } = render(<Card padding="lg">Content</Card>)
    expect(container.querySelector('.p-7')).toBeInTheDocument()
  })

  it('applies no padding', () => {
    const { container } = render(<Card padding="none">Content</Card>)
    // Should not have padding classes
    const inner = container.firstElementChild?.lastElementChild
    expect(inner?.className).toBe('')
  })

  it('renders with rounded corners and shadow', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstElementChild
    expect(card?.className).toContain('rounded-xl')
    expect(card?.className).toContain('shadow-sm')
  })

  it('renders as article when as="article"', () => {
    render(<Card as="article">Content</Card>)
    expect(screen.getByText('Content').closest('article')).toBeInTheDocument()
  })

  it('renders image when image prop is provided', () => {
    render(
      <Card image={{ src: '/test.jpg', alt: 'Test image' }}>
        Content
      </Card>
    )
    const img = screen.getByAltText('Test image')
    expect(img).toBeInTheDocument()
  })

  it('accepts custom className', () => {
    const { container } = render(<Card className="my-custom">Content</Card>)
    expect(container.firstElementChild?.className).toContain('my-custom')
  })
})
