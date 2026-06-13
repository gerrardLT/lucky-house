import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FilterBar } from '../FilterBar'

const mockOptions = [
  { key: 'all', label: '全部' },
  { key: 'room', label: '房间' },
  { key: 'onsen', label: '温泉' },
  { key: 'pet', label: '宠物' },
]

describe('FilterBar', () => {
  it('renders all filter options', () => {
    render(<FilterBar options={mockOptions} activeKey="all" onFilter={() => {}} />)
    expect(screen.getByText('全部')).toBeInTheDocument()
    expect(screen.getByText('房间')).toBeInTheDocument()
    expect(screen.getByText('温泉')).toBeInTheDocument()
    expect(screen.getByText('宠物')).toBeInTheDocument()
  })

  it('calls onFilter with correct key when option is clicked', () => {
    const handleFilter = vi.fn()
    render(<FilterBar options={mockOptions} activeKey="all" onFilter={handleFilter} />)
    
    fireEvent.click(screen.getByText('温泉'))
    expect(handleFilter).toHaveBeenCalledWith('onsen')
  })

  it('marks active option with aria-pressed="true"', () => {
    render(<FilterBar options={mockOptions} activeKey="room" onFilter={() => {}} />)
    
    const activeBtn = screen.getByText('房间')
    expect(activeBtn).toHaveAttribute('aria-pressed', 'true')
    
    const inactiveBtn = screen.getByText('全部')
    expect(inactiveBtn).toHaveAttribute('aria-pressed', 'false')
  })

  it('applies active styling to active option', () => {
    render(<FilterBar options={mockOptions} activeKey="pet" onFilter={() => {}} />)
    const activeBtn = screen.getByText('宠物')
    expect(activeBtn.className).toContain('bg-green-700')
    expect(activeBtn.className).toContain('text-white')
  })

  it('applies inactive styling to non-active options', () => {
    render(<FilterBar options={mockOptions} activeKey="pet" onFilter={() => {}} />)
    const inactiveBtn = screen.getByText('全部')
    expect(inactiveBtn.className).toContain('bg-stone-100')
  })

  it('has nav with aria-label', () => {
    render(<FilterBar options={mockOptions} activeKey="all" onFilter={() => {}} />)
    expect(screen.getByRole('navigation', { name: '筛选选项' })).toBeInTheDocument()
  })

  it('supports custom aria-label', () => {
    render(
      <FilterBar
        options={mockOptions}
        activeKey="all"
        onFilter={() => {}}
        aria-label="画廊筛选"
      />
    )
    expect(screen.getByRole('navigation', { name: '画廊筛选' })).toBeInTheDocument()
  })

  it('accepts custom className', () => {
    render(
      <FilterBar options={mockOptions} activeKey="all" onFilter={() => {}} className="mb-4" />
    )
    const nav = screen.getByRole('navigation')
    expect(nav.className).toContain('mb-4')
  })
})
