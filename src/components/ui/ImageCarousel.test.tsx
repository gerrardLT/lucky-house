import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ImageCarousel, CarouselImage } from './ImageCarousel'

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, loading, ...rest } = props
    return (
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      <img
        {...rest}
        data-fill={fill ? 'true' : undefined}
        data-priority={priority ? 'true' : undefined}
        data-loading={loading as string}
      />
    )
  },
}))

const mockImages: CarouselImage[] = [
  { src: '/images/room1.jpg', alt: '房间正面照' },
  { src: '/images/room2.jpg', alt: '房间侧面照' },
  { src: '/images/room3.jpg', alt: '概念效果图', isRendering: true },
]

describe('ImageCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders main image area with first image visible', () => {
    render(<ImageCarousel images={mockImages} />)
    expect(screen.getByRole('region', { name: '图片轮播' })).toBeInTheDocument()
    // Counter shows 1/3
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('shows empty state when no images provided', () => {
    render(<ImageCarousel images={[]} />)
    expect(screen.getByText('暂无图片')).toBeInTheDocument()
  })

  it('navigates to next image on right arrow click', () => {
    render(<ImageCarousel images={mockImages} />)
    const nextBtn = screen.getByLabelText('下一张图片')
    fireEvent.click(nextBtn)
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })

  it('navigates to previous image on left arrow click', () => {
    render(<ImageCarousel images={mockImages} />)
    // Go to second first
    fireEvent.click(screen.getByLabelText('下一张图片'))
    // Wait for transition to complete
    act(() => { vi.advanceTimersByTime(300) })
    // Then go back
    fireEvent.click(screen.getByLabelText('上一张图片'))
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('wraps around when navigating past the last image', () => {
    render(<ImageCarousel images={mockImages} />)
    const nextBtn = screen.getByLabelText('下一张图片')
    fireEvent.click(nextBtn) // 2
    act(() => { vi.advanceTimersByTime(300) })
    fireEvent.click(nextBtn) // 3
    act(() => { vi.advanceTimersByTime(300) })
    fireEvent.click(nextBtn) // back to 1
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('shows "示意图" label on rendering images', () => {
    render(<ImageCarousel images={mockImages} />)
    // The rendering label should be present in the carousel slides
    const labels = screen.getAllByText('示意图')
    expect(labels.length).toBeGreaterThan(0)
  })

  it('renders thumbnail navigation for multiple images', () => {
    render(<ImageCarousel images={mockImages} />)
    const thumbnails = screen.getAllByRole('tab')
    expect(thumbnails).toHaveLength(3)
  })

  it('highlights active thumbnail', () => {
    render(<ImageCarousel images={mockImages} />)
    const thumbnails = screen.getAllByRole('tab')
    expect(thumbnails[0]).toHaveAttribute('aria-selected', 'true')
    expect(thumbnails[1]).toHaveAttribute('aria-selected', 'false')
  })

  it('navigates to specific image via thumbnail click', () => {
    render(<ImageCarousel images={mockImages} />)
    const thumbnails = screen.getAllByRole('tab')
    fireEvent.click(thumbnails[2])
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
    expect(thumbnails[2]).toHaveAttribute('aria-selected', 'true')
  })

  it('opens fullscreen mode on main image click', () => {
    render(<ImageCarousel images={mockImages} />)
    const mainImageBtn = screen.getByRole('button', { name: '点击全屏查看' })
    fireEvent.click(mainImageBtn)
    expect(screen.getByRole('dialog', { name: '全屏图片查看' })).toBeInTheDocument()
  })

  it('closes fullscreen on close button click', () => {
    render(<ImageCarousel images={mockImages} />)
    fireEvent.click(screen.getByRole('button', { name: '点击全屏查看' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('关闭全屏'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes fullscreen on Escape key', () => {
    render(<ImageCarousel images={mockImages} />)
    fireEvent.click(screen.getByRole('button', { name: '点击全屏查看' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('does not render navigation arrows for single image', () => {
    render(<ImageCarousel images={[mockImages[0]]} />)
    expect(screen.queryByLabelText('上一张图片')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('下一张图片')).not.toBeInTheDocument()
  })

  it('does not render thumbnail row for single image', () => {
    render(<ImageCarousel images={[mockImages[0]]} />)
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
  })

  it('is keyboard accessible - region is focusable', () => {
    render(<ImageCarousel images={mockImages} />)
    const region = screen.getByRole('region', { name: '图片轮播' })
    expect(region).toHaveAttribute('tabindex', '0')
  })

  it('accepts custom className', () => {
    render(<ImageCarousel images={mockImages} className="my-custom-class" />)
    const region = screen.getByRole('region', { name: '图片轮播' })
    expect(region.className).toContain('my-custom-class')
  })
})
