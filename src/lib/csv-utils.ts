// src/lib/csv-utils.ts
// CSV 导出工具函数 — 安全转义 + 注入防护

/** CSV 导出最大记录数 */
export const MAX_EXPORT_ROWS = 10000

/**
 * 安全转义 CSV 字段
 * - 包裹双引号
 * - 转义内部双引号
 * - 防止 CSV 注入（= + - @ \t \r 开头添加前缀单引号）
 */
export function escapeCsvField(value: string): string {
  const dangerous = /^[=+\-@\t\r]/
  const safe = dangerous.test(value) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}

/** 将字符串数组拼接为 CSV 行 */
export function toCsvRow(fields: string[]): string {
  return fields.map(escapeCsvField).join(',')
}

/** 生成 CSV Response */
export function csvResponse(csv: string, filename: string): Response {
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
