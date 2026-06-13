import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StepIndicator } from '../StepIndicator'

const mockSteps = [
  { label: '日期与人数', key: 'dates' },
  { label: '房型偏好', key: 'room' },
  { label: '宠物信息', key: 'pet' },
  { label: '联系方式', key: 'contact' },
  { label: '规则确认', key: 'confirm' },
]

describe('StepIndicator', () => {
  it('renders all step labels', () => {
    render(
      <StepIndicator steps={mockSteps} currentStep={1} completedSteps={[]} />
    )
    expect(screen.getByText('日期与人数')).toBeInTheDocument()
    expect(screen.getByText('房型偏好')).toBeInTheDocument()
    expect(screen.getByText('宠物信息')).toBeInTheDocument()
    expect(screen.getByText('联系方式')).toBeInTheDocument()
    expect(screen.getByText('规则确认')).toBeInTheDocument()
  })

  it('has nav with aria-label', () => {
    render(
      <StepIndicator steps={mockSteps} currentStep={1} completedSteps={[]} />
    )
    expect(screen.getByRole('navigation', { name: '预约步骤进度' })).toBeInTheDocument()
  })

  it('marks current step with aria-current="step"', () => {
    const { container } = render(
      <StepIndicator steps={mockSteps} currentStep={3} completedSteps={[1, 2]} />
    )
    const currentStepEl = container.querySelector('[aria-current="step"]')
    expect(currentStepEl).toBeInTheDocument()
    expect(currentStepEl?.textContent).toBe('3')
  })

  it('shows checkmark for completed steps', () => {
    const { container } = render(
      <StepIndicator steps={mockSteps} currentStep={3} completedSteps={[1, 2]} />
    )
    // Completed steps should have SVG checkmark icons
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(2) // At least steps 1 and 2 have checkmarks
  })

  it('applies green styling to completed steps', () => {
    const { container } = render(
      <StepIndicator steps={mockSteps} currentStep={3} completedSteps={[1, 2]} />
    )
    const completedCircles = container.querySelectorAll('.bg-green-700.text-white')
    expect(completedCircles.length).toBe(2)
  })

  it('applies current step styling', () => {
    const { container } = render(
      <StepIndicator steps={mockSteps} currentStep={2} completedSteps={[1]} />
    )
    const currentCircle = container.querySelector('.border-green-700')
    expect(currentCircle).toBeInTheDocument()
  })

  it('applies upcoming step styling', () => {
    const { container } = render(
      <StepIndicator steps={mockSteps} currentStep={1} completedSteps={[]} />
    )
    const upcomingCircles = container.querySelectorAll('.bg-stone-100.text-stone-400')
    expect(upcomingCircles.length).toBe(4) // Steps 2-5 are upcoming
  })

  it('accepts custom className', () => {
    render(
      <StepIndicator steps={mockSteps} currentStep={1} completedSteps={[]} className="mt-6" />
    )
    const nav = screen.getByRole('navigation')
    expect(nav.className).toContain('mt-6')
  })
})
