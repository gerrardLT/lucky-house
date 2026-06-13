import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from '../Badge'

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge variant="pet-friendly">宠物友好</Badge>)
    expect(screen.getByText('宠物友好')).toBeInTheDocument()
  })

  it('applies green styles for pet-friendly variant', () => {
    render(<Badge variant="pet-friendly">宠物友好</Badge>)
    const badge = screen.getByText('宠物友好')
    expect(badge.className).toContain('bg-green-100')
    expect(badge.className).toContain('text-green-800')
  })

  it('applies green styles for open variant', () => {
    render(<Badge variant="open">营业中</Badge>)
    const badge = screen.getByText('营业中')
    expect(badge.className).toContain('bg-green-100')
    expect(badge.className).toContain('text-green-800')
  })

  it('applies yellow styles for coming-soon variant', () => {
    render(<Badge variant="coming-soon">即将开放</Badge>)
    const badge = screen.getByText('即将开放')
    expect(badge.className).toContain('bg-yellow-100')
    expect(badge.className).toContain('text-yellow-800')
  })

  it('applies blue styles for rendering variant', () => {
    render(<Badge variant="rendering">示意图</Badge>)
    const badge = screen.getByText('示意图')
    expect(badge.className).toContain('bg-blue-100')
    expect(badge.className).toContain('text-blue-800')
  })

  it('applies red styles for maintenance variant', () => {
    render(<Badge variant="maintenance">维护中</Badge>)
    const badge = screen.getByText('维护中')
    expect(badge.className).toContain('bg-red-100')
    expect(badge.className).toContain('text-red-800')
  })

  it('applies gray styles for normal variant', () => {
    render(<Badge variant="normal">普通房</Badge>)
    const badge = screen.getByText('普通房')
    expect(badge.className).toContain('bg-stone-100')
    expect(badge.className).toContain('text-stone-700')
  })

  it('accepts custom className', () => {
    render(<Badge variant="open" className="ml-2">Open</Badge>)
    expect(screen.getByText('Open').className).toContain('ml-2')
  })
})
