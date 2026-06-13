import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Accordion } from '../Accordion'

const mockItems = [
  { id: 'q1', question: '可以带宠物吗？', answer: '当然可以！我们欢迎宠物。' },
  { id: 'q2', question: '有温泉吗？', answer: '是的，我们有天然温泉。' },
  { id: 'q3', question: '如何取消？', answer: '入住前48小时可免费取消。' },
]

describe('Accordion', () => {
  it('renders all questions', () => {
    render(<Accordion items={mockItems} />)
    expect(screen.getByText('可以带宠物吗？')).toBeInTheDocument()
    expect(screen.getByText('有温泉吗？')).toBeInTheDocument()
    expect(screen.getByText('如何取消？')).toBeInTheDocument()
  })

  it('hides answers by default', () => {
    render(<Accordion items={mockItems} />)
    expect(screen.queryByText('当然可以！我们欢迎宠物。')).not.toBeInTheDocument()
  })

  it('shows answer when defaultOpen includes the item id', () => {
    render(<Accordion items={mockItems} defaultOpen={['q1']} />)
    expect(screen.getByText('当然可以！我们欢迎宠物。')).toBeInTheDocument()
  })

  it('toggles answer on click', () => {
    render(<Accordion items={mockItems} />)
    const button = screen.getByText('可以带宠物吗？').closest('button')!
    
    fireEvent.click(button)
    expect(screen.getByText('当然可以！我们欢迎宠物。')).toBeInTheDocument()
    
    fireEvent.click(button)
    expect(screen.queryByText('当然可以！我们欢迎宠物。')).not.toBeInTheDocument()
  })

  it('toggles answer on Enter key', () => {
    render(<Accordion items={mockItems} />)
    const button = screen.getByText('可以带宠物吗？').closest('button')!
    
    fireEvent.keyDown(button, { key: 'Enter' })
    expect(screen.getByText('当然可以！我们欢迎宠物。')).toBeInTheDocument()
  })

  it('toggles answer on Space key', () => {
    render(<Accordion items={mockItems} />)
    const button = screen.getByText('有温泉吗？').closest('button')!
    
    fireEvent.keyDown(button, { key: ' ' })
    expect(screen.getByText('是的，我们有天然温泉。')).toBeInTheDocument()
  })

  it('has correct aria-expanded attribute', () => {
    render(<Accordion items={mockItems} />)
    const button = screen.getByText('可以带宠物吗？').closest('button')!
    
    expect(button).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('has correct aria-controls linking to panel', () => {
    render(<Accordion items={mockItems} />)
    const button = screen.getByText('可以带宠物吗？').closest('button')!
    
    expect(button).toHaveAttribute('aria-controls', 'accordion-panel-q1')
  })

  it('panel has role="region" and aria-labelledby', () => {
    render(<Accordion items={mockItems} defaultOpen={['q1']} />)
    const panel = document.getElementById('accordion-panel-q1')
    
    expect(panel).toHaveAttribute('role', 'region')
    expect(panel).toHaveAttribute('aria-labelledby', 'accordion-header-q1')
  })

  it('panel is hidden when closed', () => {
    render(<Accordion items={mockItems} />)
    const panel = document.getElementById('accordion-panel-q1')
    expect(panel).toHaveAttribute('hidden')
  })

  it('allows multiple items open simultaneously', () => {
    render(<Accordion items={mockItems} />)
    
    fireEvent.click(screen.getByText('可以带宠物吗？').closest('button')!)
    fireEvent.click(screen.getByText('有温泉吗？').closest('button')!)
    
    expect(screen.getByText('当然可以！我们欢迎宠物。')).toBeInTheDocument()
    expect(screen.getByText('是的，我们有天然温泉。')).toBeInTheDocument()
  })

  it('accepts custom className', () => {
    const { container } = render(<Accordion items={mockItems} className="my-class" />)
    expect(container.firstElementChild?.className).toContain('my-class')
  })
})
