import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Lightbox, LightboxImage } from './Lightbox'

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

const mockImages: LightboxImage[] = [
  { src: '/img/room-1.jpg', alt: '房间1', caption: '温泉套房全景' },
  { src: '/img/room-2.jpg', alt: '房间2', caption: '宠物友好房' },
  { src: '/img/room-3.jpg', alt: '房间3' },
]

describe('Lightbox', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  afterEach(() => {
    // 恢复 body overflow
    document.body.style.overflow = ''
  })

  it('不渲染当 isOpen 为 false', () => {
    const { container } = render(
      <Lightbox images={mockImages} isOpen={false} onClose={mockOnClose} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('不渲染当 images 为空数组', () => {
    const { container } = render(
      <Lightbox images={[]} isOpen={true} onClose={mockOnClose} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('渲染全屏覆盖层当 isOpen 为 true', () => {
    render(
      <Lightbox images={mockImages} isOpen={true} onClose={mockOnClose} />
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('显示正确的图片计数器', () => {
    render(
      <Lightbox images={mockImages} initialIndex={0} isOpen={true} onClose={mockOnClose} />
    )
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('显示指定初始索引的图片', () => {
    render(
      <Lightbox images={mockImages} initialIndex={1} isOpen={true} onClose={mockOnClose} />
    )
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(screen.getByAltText('房间2')).toBeInTheDocument()
  })

  it('显示图注', () => {
    render(
      <Lightbox images={mockImages} initialIndex={0} isOpen={true} onClose={mockOnClose} />
    )
    expect(screen.getByText('温泉套房全景')).toBeInTheDocument()
  })

  it('没有图注时不渲染图注区域', () => {
    render(
      <Lightbox images={mockImages} initialIndex={2} isOpen={true} onClose={mockOnClose} />
    )
    // 第三张图没有 caption
    const caption = screen.queryByText('温泉套房全景')
    expect(caption).not.toBeInTheDocument()
  })

  it('点击关闭按钮调用 onClose', () => {
    render(
      <Lightbox images={mockImages} isOpen={true} onClose={mockOnClose} />
    )
    const closeBtn = screen.getByLabelText('关闭图片查看器')
    fireEvent.click(closeBtn)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('点击右箭头切换到下一张', () => {
    render(
      <Lightbox images={mockImages} initialIndex={0} isOpen={true} onClose={mockOnClose} />
    )
    const nextBtn = screen.getByLabelText('下一张图片')
    fireEvent.click(nextBtn)
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })

  it('点击左箭头切换到上一张', () => {
    render(
      <Lightbox images={mockImages} initialIndex={1} isOpen={true} onClose={mockOnClose} />
    )
    const prevBtn = screen.getByLabelText('上一张图片')
    fireEvent.click(prevBtn)
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('在第一张时点击左箭头循环到最后一张', () => {
    render(
      <Lightbox images={mockImages} initialIndex={0} isOpen={true} onClose={mockOnClose} />
    )
    const prevBtn = screen.getByLabelText('上一张图片')
    fireEvent.click(prevBtn)
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
  })

  it('在最后一张时点击右箭头循环到第一张', () => {
    render(
      <Lightbox images={mockImages} initialIndex={2} isOpen={true} onClose={mockOnClose} />
    )
    const nextBtn = screen.getByLabelText('下一张图片')
    fireEvent.click(nextBtn)
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('按 Escape 键关闭', () => {
    render(
      <Lightbox images={mockImages} isOpen={true} onClose={mockOnClose} />
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('按左箭头键切换到上一张', () => {
    render(
      <Lightbox images={mockImages} initialIndex={1} isOpen={true} onClose={mockOnClose} />
    )
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('按右箭头键切换到下一张', () => {
    render(
      <Lightbox images={mockImages} initialIndex={0} isOpen={true} onClose={mockOnClose} />
    )
    fireEvent.keyDown(document, { key: 'ArrowRight' })
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })

  it('打开时阻止 body 滚动', () => {
    render(
      <Lightbox images={mockImages} isOpen={true} onClose={mockOnClose} />
    )
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('单张图片时不显示导航箭头', () => {
    const singleImage: LightboxImage[] = [
      { src: '/img/single.jpg', alt: '单张图片' },
    ]
    render(
      <Lightbox images={singleImage} isOpen={true} onClose={mockOnClose} />
    )
    expect(screen.queryByLabelText('上一张图片')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('下一张图片')).not.toBeInTheDocument()
  })

  it('关闭按钮有正确的 aria-label', () => {
    render(
      <Lightbox images={mockImages} isOpen={true} onClose={mockOnClose} />
    )
    expect(screen.getByLabelText('关闭图片查看器')).toBeInTheDocument()
  })

  it('导航按钮有正确的 aria-label', () => {
    render(
      <Lightbox images={mockImages} isOpen={true} onClose={mockOnClose} />
    )
    expect(screen.getByLabelText('上一张图片')).toBeInTheDocument()
    expect(screen.getByLabelText('下一张图片')).toBeInTheDocument()
  })

  describe('触摸滑动手势', () => {
    it('右滑切换到上一张', () => {
      render(
        <Lightbox images={mockImages} initialIndex={1} isOpen={true} onClose={mockOnClose} />
      )
      const dialog = screen.getByRole('dialog')

      fireEvent.touchStart(dialog, { touches: [{ clientX: 100 }] })
      fireEvent.touchMove(dialog, { touches: [{ clientX: 200 }] })
      fireEvent.touchEnd(dialog)

      expect(screen.getByText('1 / 3')).toBeInTheDocument()
    })

    it('左滑切换到下一张', () => {
      render(
        <Lightbox images={mockImages} initialIndex={0} isOpen={true} onClose={mockOnClose} />
      )
      const dialog = screen.getByRole('dialog')

      fireEvent.touchStart(dialog, { touches: [{ clientX: 200 }] })
      fireEvent.touchMove(dialog, { touches: [{ clientX: 100 }] })
      fireEvent.touchEnd(dialog)

      expect(screen.getByText('2 / 3')).toBeInTheDocument()
    })

    it('滑动距离不足不切换', () => {
      render(
        <Lightbox images={mockImages} initialIndex={0} isOpen={true} onClose={mockOnClose} />
      )
      const dialog = screen.getByRole('dialog')

      fireEvent.touchStart(dialog, { touches: [{ clientX: 100 }] })
      fireEvent.touchMove(dialog, { touches: [{ clientX: 130 }] })
      fireEvent.touchEnd(dialog)

      expect(screen.getByText('1 / 3')).toBeInTheDocument()
    })
  })
})
