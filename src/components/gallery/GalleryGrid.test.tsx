import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GalleryGrid } from './GalleryGrid'
import type { GalleryAsset } from '@/types'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ priority, ...props }: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} data-priority={priority ? 'true' : undefined} />
  },
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: Record<string, unknown>) => (
    <a href={href as string} {...props}>{children as React.ReactNode}</a>
  ),
}))

const mockAssets: GalleryAsset[] = [
  {
    id: 'test-room-1',
    src: '/images/room-1.webp',
    alt: { zh: '房间1', ja: '部屋1', en: 'Room 1' },
    category: 'room',
    isRendering: true,
    linkedPage: '/stay/room-1',
    sortOrder: 1,
    width: 1200,
    height: 800,
  },
  {
    id: 'test-onsen-1',
    src: '/images/onsen-1.webp',
    alt: { zh: '温泉1', ja: '温泉1', en: 'Onsen 1' },
    category: 'onsen',
    isRendering: false,
    sortOrder: 2,
    width: 1200,
    height: 900,
  },
  {
    id: 'test-pet-1',
    src: '/images/pet-1.webp',
    alt: { zh: '宠物1', ja: 'ペット1', en: 'Pet 1' },
    category: 'pet',
    isRendering: false,
    linkedPage: '/pet-friendly',
    sortOrder: 3,
    width: 1200,
    height: 800,
  },
]

describe('GalleryGrid', () => {
  it('渲染所有图片（默认"全部"分类）', () => {
    render(<GalleryGrid assets={mockAssets} locale="zh" />)
    expect(screen.getAllByRole('img')).toHaveLength(3)
  })

  it('渲染分类筛选栏', () => {
    render(<GalleryGrid assets={mockAssets} locale="zh" />)
    expect(screen.getByText('全部')).toBeInTheDocument()
    expect(screen.getByText('房间')).toBeInTheDocument()
    expect(screen.getByText('温泉')).toBeInTheDocument()
    expect(screen.getByText('宠物')).toBeInTheDocument()
  })

  it('点击分类按钮后只显示对应分类图片', () => {
    render(<GalleryGrid assets={mockAssets} locale="zh" />)

    fireEvent.click(screen.getByText('房间'))
    expect(screen.getAllByRole('img')).toHaveLength(1)
    expect(screen.getByAltText('房间1')).toBeInTheDocument()
  })

  it('点击"全部"恢复显示所有图片', () => {
    render(<GalleryGrid assets={mockAssets} locale="zh" />)

    // 先筛选
    fireEvent.click(screen.getByText('温泉'))
    expect(screen.getAllByRole('img')).toHaveLength(1)

    // 恢复全部
    fireEvent.click(screen.getByText('全部'))
    expect(screen.getAllByRole('img')).toHaveLength(3)
  })

  it('概念图显示"示意图"标签', () => {
    render(<GalleryGrid assets={mockAssets} locale="zh" />)
    // 第一张 isRendering=true 应有"示意图"标签
    expect(screen.getAllByText('示意图')).toHaveLength(1)
  })

  it('点击图片打开 Lightbox', () => {
    render(<GalleryGrid assets={mockAssets} locale="zh" />)

    // 点击第一张图片（通过 alt 文本找到图片按钮）
    const imageButton = screen.getByAltText('房间1').closest('[role="button"]')!
    fireEvent.click(imageButton)

    // Lightbox 应该打开（dialog 存在）
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('Lightbox 显示图片 alt 文本作为图注', () => {
    render(<GalleryGrid assets={mockAssets} locale="zh" />)

    const imageButton = screen.getByAltText('房间1').closest('[role="button"]')!
    fireEvent.click(imageButton)

    // Lightbox 中图注显示 caption（与 alt 文本相同）
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('房间1')
  })

  it('筛选无结果时显示空状态提示', () => {
    // 传入只包含 room 类图片
    const roomOnly: GalleryAsset[] = [mockAssets[0]]
    render(<GalleryGrid assets={roomOnly} locale="zh" />)

    // 点击"温泉"分类
    fireEvent.click(screen.getByText('温泉'))
    expect(screen.getByText('暂无该分类的图片')).toBeInTheDocument()
  })

  it('多语言支持 - 日文标签', () => {
    render(<GalleryGrid assets={mockAssets} locale="ja" />)
    expect(screen.getByText('すべて')).toBeInTheDocument()
    expect(screen.getByText('客室')).toBeInTheDocument()
  })

  it('多语言支持 - 英文标签', () => {
    render(<GalleryGrid assets={mockAssets} locale="en" />)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Rooms')).toBeInTheDocument()
  })

  it('使用响应式网格布局类名', () => {
    const { container } = render(<GalleryGrid assets={mockAssets} locale="zh" />)
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-2')
    expect(grid).toHaveClass('md:grid-cols-3')
    expect(grid).toHaveClass('lg:grid-cols-4')
  })

  it('有 linkedPage 的图片显示关联跳转链接', () => {
    render(<GalleryGrid assets={mockAssets} locale="zh" />)
    // room-1 有 linkedPage: '/stay/room-1'，应渲染带 locale 前缀的链接
    const links = screen.getAllByText('查看详情 →')
    expect(links).toHaveLength(2) // room-1 和 pet-1 都有 linkedPage
    expect(links[0].closest('a')).toHaveAttribute('href', '/zh/stay/room-1')
    expect(links[1].closest('a')).toHaveAttribute('href', '/zh/pet-friendly')
  })

  it('无 linkedPage 的图片不显示关联跳转链接', () => {
    // onsen-1 没有 linkedPage
    const onsenOnly: GalleryAsset[] = [mockAssets[1]]
    render(<GalleryGrid assets={onsenOnly} locale="zh" />)
    expect(screen.queryByText('查看详情 →')).not.toBeInTheDocument()
  })

  it('关联跳转链接使用当前 locale', () => {
    render(<GalleryGrid assets={mockAssets} locale="en" />)
    const links = screen.getAllByText('View details →')
    expect(links[0].closest('a')).toHaveAttribute('href', '/en/stay/room-1')
  })
})
