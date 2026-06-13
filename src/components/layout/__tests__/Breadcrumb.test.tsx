// src/components/layout/__tests__/Breadcrumb.test.tsx
// Breadcrumb 组件单元测试

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Breadcrumb } from '../Breadcrumb'

describe('Breadcrumb', () => {
  describe('条件渲染 - 路径深度控制', () => {
    it('根路径 /zh/ 不渲染面包屑', () => {
      const { container } = render(
        <Breadcrumb locale="zh" pathname="/zh/" />
      )
      expect(container.querySelector('nav')).toBeNull()
    })

    it('根路径 /zh（无尾斜杠）不渲染面包屑', () => {
      const { container } = render(
        <Breadcrumb locale="zh" pathname="/zh" />
      )
      expect(container.querySelector('nav')).toBeNull()
    })

    it('一级路径 /zh/stay 渲染面包屑', () => {
      render(<Breadcrumb locale="zh" pathname="/zh/stay" />)
      const nav = screen.getByRole('navigation', { name: 'breadcrumb' })
      expect(nav).toBeInTheDocument()
    })

    it('二级路径 /zh/stay/pet-friendly-twin 渲染面包屑', () => {
      render(
        <Breadcrumb locale="zh" pathname="/zh/stay/pet-friendly-twin" />
      )
      const nav = screen.getByRole('navigation', { name: 'breadcrumb' })
      expect(nav).toBeInTheDocument()
    })
  })

  describe('面包屑内容', () => {
    it('一级路径显示 Home > 当前页', () => {
      render(<Breadcrumb locale="zh" pathname="/zh/stay" />)
      
      // 首页链接
      const homeLink = screen.getByRole('link', { name: '首页' })
      expect(homeLink).toHaveAttribute('href', '/zh')

      // 当前页面（非链接）
      const currentPage = screen.getByText('住宿房型')
      expect(currentPage).toHaveAttribute('aria-current', 'page')
    })

    it('二级路径显示 Home > 父级 > 当前页', () => {
      render(
        <Breadcrumb locale="zh" pathname="/zh/stay/pet-friendly-twin" />
      )

      // 首页链接
      const homeLink = screen.getByRole('link', { name: '首页' })
      expect(homeLink).toHaveAttribute('href', '/zh')

      // 父级链接
      const parentLink = screen.getByRole('link', { name: '住宿房型' })
      expect(parentLink).toHaveAttribute('href', '/zh/stay')

      // 当前页面（动态 slug 格式化）
      const currentPage = screen.getByText('Pet Friendly Twin')
      expect(currentPage).toHaveAttribute('aria-current', 'page')
    })

    it('已知段使用翻译标签', () => {
      render(<Breadcrumb locale="zh" pathname="/zh/facilities" />)
      expect(screen.getByText('温泉与设施')).toHaveAttribute(
        'aria-current',
        'page'
      )
    })

    it('英语 locale 使用英文标签', () => {
      render(<Breadcrumb locale="en" pathname="/en/stay" />)

      const homeLink = screen.getByRole('link', { name: 'Home' })
      expect(homeLink).toHaveAttribute('href', '/en')

      const currentPage = screen.getByText('Accommodations')
      expect(currentPage).toHaveAttribute('aria-current', 'page')
    })

    it('日语 locale 使用日文标签', () => {
      render(<Breadcrumb locale="ja" pathname="/ja/gallery" />)

      const homeLink = screen.getByRole('link', { name: 'ホーム' })
      expect(homeLink).toHaveAttribute('href', '/ja')

      const currentPage = screen.getByText('ギャラリー')
      expect(currentPage).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('语义化 HTML', () => {
    it('使用 nav 元素并包含 aria-label="breadcrumb"', () => {
      render(<Breadcrumb locale="zh" pathname="/zh/stay" />)
      const nav = screen.getByRole('navigation', { name: 'breadcrumb' })
      expect(nav).toBeInTheDocument()
    })

    it('使用有序列表 <ol> 结构', () => {
      const { container } = render(
        <Breadcrumb locale="zh" pathname="/zh/stay" />
      )
      const ol = container.querySelector('ol')
      expect(ol).toBeInTheDocument()
    })

    it('当前页面设置 aria-current="page"', () => {
      render(<Breadcrumb locale="zh" pathname="/zh/faq" />)
      const currentPage = screen.getByText('常见问题')
      expect(currentPage).toHaveAttribute('aria-current', 'page')
    })

    it('分隔符标记为 aria-hidden', () => {
      const { container } = render(
        <Breadcrumb locale="zh" pathname="/zh/stay" />
      )
      const separators = container.querySelectorAll('[aria-hidden="true"]')
      expect(separators.length).toBeGreaterThan(0)
      expect(separators[0].textContent).toBe('/')
    })
  })

  describe('已知路径段映射', () => {
    const knownSegments = [
      { segment: 'stay', zhLabel: '住宿房型' },
      { segment: 'pet-friendly', zhLabel: '宠物友好' },
      { segment: 'facilities', zhLabel: '温泉与设施' },
      { segment: 'activities', zhLabel: '活动社群' },
      { segment: 'explore', zhLabel: '周边探索' },
      { segment: 'gallery', zhLabel: '画廊' },
      { segment: 'faq', zhLabel: '常见问题' },
      { segment: 'booking', zhLabel: '立即预约' },
      { segment: 'contact', zhLabel: '联系我们' },
      { segment: 'privacy', zhLabel: '隐私政策' },
      { segment: 'terms', zhLabel: '预订条款' },
      { segment: 'pet-rules', zhLabel: '宠物入住规则' },
    ]

    knownSegments.forEach(({ segment, zhLabel }) => {
      it(`段 "${segment}" 映射到 "${zhLabel}"`, () => {
        render(<Breadcrumb locale="zh" pathname={`/zh/${segment}`} />)
        expect(screen.getByText(zhLabel)).toBeInTheDocument()
      })
    })
  })

  describe('动态段格式化', () => {
    it('将连字符分隔的 slug 格式化为首字母大写', () => {
      render(
        <Breadcrumb locale="zh" pathname="/zh/stay/deluxe-ocean-view" />
      )
      expect(screen.getByText('Deluxe Ocean View')).toBeInTheDocument()
    })

    it('单词 slug 首字母大写', () => {
      render(
        <Breadcrumb locale="zh" pathname="/zh/stay/suite" />
      )
      expect(screen.getByText('Suite')).toBeInTheDocument()
    })
  })
})
