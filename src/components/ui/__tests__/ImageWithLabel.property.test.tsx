// Property 6: 概念图自动标注"示意图"标签
// Validates: Requirements 3.12, 10.5

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { render } from '@testing-library/react'
import { ImageWithLabel } from '../ImageWithLabel'

// Mock next/image to avoid Next.js image optimization in tests
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('Property 6: 概念图自动标注"示意图"标签', () => {
  it('when isRendering === true, rendered output contains "示意图" text', () => {
    fc.assert(
      fc.property(fc.constant(true), (_isRendering) => {
        const { container } = render(
          <ImageWithLabel
            src="/test-image.jpg"
            alt="测试图片"
            width={800}
            height={600}
            isRendering={true}
          />
        )
        const labelElement = container.querySelector('[aria-label="示意图"]')
        expect(labelElement).not.toBeNull()
        expect(labelElement?.textContent).toBe('示意图')
      }),
      { numRuns: 10 }
    )
  })

  it('when isRendering === false, rendered output does NOT contain "示意图" text', () => {
    fc.assert(
      fc.property(fc.constant(false), (_isRendering) => {
        const { container } = render(
          <ImageWithLabel
            src="/test-image.jpg"
            alt="测试图片"
            width={800}
            height={600}
            isRendering={false}
          />
        )
        const labelElement = container.querySelector('[aria-label="示意图"]')
        expect(labelElement).toBeNull()
      }),
      { numRuns: 10 }
    )
  })

  it('isRendering boolean controls the label presence for random inputs', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.integer({ min: 100, max: 2000 }),
        fc.integer({ min: 100, max: 2000 }),
        (isRendering, alt, width, height) => {
          const { container } = render(
            <ImageWithLabel
              src="/test-image.jpg"
              alt={alt}
              width={width}
              height={height}
              isRendering={isRendering}
            />
          )
          const labelElement = container.querySelector('[aria-label="示意图"]')

          if (isRendering) {
            expect(labelElement).not.toBeNull()
            expect(labelElement?.textContent).toBe('示意图')
          } else {
            expect(labelElement).toBeNull()
          }
        }
      ),
      { numRuns: 50 }
    )
  })
})
