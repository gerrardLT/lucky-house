import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotFound from './not-found'

describe('NotFound page', () => {
  it('should render 404 text', () => {
    render(<NotFound />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('should render trilingual message', () => {
    render(<NotFound />)
    expect(
      screen.getByText(/页面未找到.*ページが見つかりません.*Page not found/)
    ).toBeInTheDocument()
  })

  it('should have a link back to home', () => {
    render(<NotFound />)
    const link = screen.getByRole('link', { name: '返回首页' })
    expect(link).toHaveAttribute('href', '/zh')
  })
})
