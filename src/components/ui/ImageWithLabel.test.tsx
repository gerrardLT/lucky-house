import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ImageWithLabel } from './ImageWithLabel'

// Mock next/image to render a simple img element for testing
vi.mock('next/image', () => ({
  default: ({ priority, ...props }: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} data-priority={priority ? 'true' : undefined} />
  },
}))

describe('ImageWithLabel', () => {
  const baseProps = {
    src: '/images/test.jpg',
    alt: '测试图片',
    width: 800,
    height: 600,
  }

  it('渲染图片并设置正确的 alt 文本', () => {
    render(<ImageWithLabel {...baseProps} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', '测试图片')
    expect(img).toHaveAttribute('src', '/images/test.jpg')
  })

  it('isRendering 为 false 时不显示"示意图"标签', () => {
    render(<ImageWithLabel {...baseProps} isRendering={false} />)
    expect(screen.queryByText('示意图')).not.toBeInTheDocument()
  })

  it('isRendering 为 true 时显示"示意图"标签', () => {
    render(<ImageWithLabel {...baseProps} isRendering={true} />)
    expect(screen.getByText('示意图')).toBeInTheDocument()
  })

  it('isRendering 默认为 false', () => {
    render(<ImageWithLabel {...baseProps} />)
    expect(screen.queryByText('示意图')).not.toBeInTheDocument()
  })

  it('"示意图"标签有半透明黑色背景', () => {
    render(<ImageWithLabel {...baseProps} isRendering={true} />)
    const label = screen.getByText('示意图')
    expect(label).toHaveClass('bg-black/60')
  })

  it('容器设置正确的宽高比', () => {
    const { container } = render(<ImageWithLabel {...baseProps} />)
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.style.aspectRatio).toBe('800 / 600')
  })

  it('priority 为 true 时图片设置 priority 属性', () => {
    render(<ImageWithLabel {...baseProps} priority={true} />)
    const img = screen.getByRole('img')
    // When priority is true, loading should not be set to lazy
    expect(img).not.toHaveAttribute('loading', 'lazy')
  })

  it('priority 为 false（默认）时图片使用 lazy-load', () => {
    render(<ImageWithLabel {...baseProps} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('支持 className 传入', () => {
    const { container } = render(
      <ImageWithLabel {...baseProps} className="rounded-lg shadow-md" />
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper).toHaveClass('rounded-lg')
    expect(wrapper).toHaveClass('shadow-md')
  })

  it('支持 sizes 属性传入', () => {
    render(<ImageWithLabel {...baseProps} sizes="(max-width: 768px) 100vw, 50vw" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw')
  })

  it('支持 onClick 事件', () => {
    const handleClick = vi.fn()
    render(<ImageWithLabel {...baseProps} onClick={handleClick} />)
    const wrapper = screen.getByRole('button')
    fireEvent.click(wrapper)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('无 onClick 时容器不具有 button role', () => {
    render(<ImageWithLabel {...baseProps} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('有 onClick 时支持键盘 Enter 触发', () => {
    const handleClick = vi.fn()
    render(<ImageWithLabel {...baseProps} onClick={handleClick} />)
    const wrapper = screen.getByRole('button')
    fireEvent.keyDown(wrapper, { key: 'Enter' })
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('有 onClick 时支持键盘 Space 触发', () => {
    const handleClick = vi.fn()
    render(<ImageWithLabel {...baseProps} onClick={handleClick} />)
    const wrapper = screen.getByRole('button')
    fireEvent.keyDown(wrapper, { key: ' ' })
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
