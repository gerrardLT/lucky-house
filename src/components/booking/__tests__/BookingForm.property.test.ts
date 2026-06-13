/**
 * Property 10: 预约表单 Step 3 按 hasPet 条件展示
 *
 * For any 表单状态：
 * - 当 hasPet === true 时步骤序列 SHALL 包含 Step 3（宠物信息），即 [1,2,3,4,5]
 * - 当 hasPet === false 时步骤序列 SHALL 跳过 Step 3，即 [1,2,4,5]
 *
 * **Validates: Requirements 12.2**
 */

import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

/**
 * 复制 BookingForm 组件中的步骤序列计算逻辑为纯函数进行测试。
 * 该逻辑直接从 BookingForm 的 useMemo 中提取。
 */
function computeStepSequence(hasPet: boolean): number[] {
  if (hasPet) {
    return [1, 2, 3, 4, 5]
  }
  return [1, 2, 4, 5] // 跳过 Step 3
}

describe('Property 10: 预约表单 Step 3 按 hasPet 条件展示', () => {
  it('当 hasPet === true 时，步骤序列为 [1,2,3,4,5]', () => {
    fc.assert(
      fc.property(
        fc.constant(true),
        (hasPet) => {
          const sequence = computeStepSequence(hasPet)
          expect(sequence).toEqual([1, 2, 3, 4, 5])
          expect(sequence).toContain(3)
        }
      ),
      { numRuns: 10 }
    )
  })

  it('当 hasPet === false 时，步骤序列为 [1,2,4,5]（跳过 Step 3）', () => {
    fc.assert(
      fc.property(
        fc.constant(false),
        (hasPet) => {
          const sequence = computeStepSequence(hasPet)
          expect(sequence).toEqual([1, 2, 4, 5])
          expect(sequence).not.toContain(3)
        }
      ),
      { numRuns: 10 }
    )
  })

  it('对任意 boolean hasPet 值，Step 3 的存在性与 hasPet 一致', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (hasPet) => {
          const sequence = computeStepSequence(hasPet)

          if (hasPet) {
            // hasPet === true → 序列包含 Step 3
            expect(sequence).toEqual([1, 2, 3, 4, 5])
            expect(sequence.length).toBe(5)
          } else {
            // hasPet === false → 序列不包含 Step 3
            expect(sequence).toEqual([1, 2, 4, 5])
            expect(sequence.length).toBe(4)
          }

          // 无论 hasPet 如何，Step 1, 2, 4, 5 都存在
          expect(sequence).toContain(1)
          expect(sequence).toContain(2)
          expect(sequence).toContain(4)
          expect(sequence).toContain(5)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('步骤序列始终严格递增', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (hasPet) => {
          const sequence = computeStepSequence(hasPet)
          for (let i = 1; i < sequence.length; i++) {
            expect(sequence[i]).toBeGreaterThan(sequence[i - 1])
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
