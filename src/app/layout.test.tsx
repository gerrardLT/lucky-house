import { describe, it, expect } from 'vitest'

describe('Project Setup', () => {
  it('should have vitest configured correctly', () => {
    expect(1 + 1).toBe(2)
  })

  it('should resolve @/ path alias', async () => {
    const layout = await import('@/app/layout')
    expect(layout.viewport).toBeDefined()
  })

  it('should have locale layout with generateMetadata', async () => {
    const localeLayout = await import('@/app/[locale]/layout')
    expect(localeLayout.generateMetadata).toBeDefined()
    expect(localeLayout.generateStaticParams).toBeDefined()
  })
})
