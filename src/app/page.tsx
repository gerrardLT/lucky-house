import { redirect } from 'next/navigation'

/**
 * 根路径不承载页面内容，仅用于重定向至默认语言。
 * 完整的语言检测逻辑在 middleware.ts 中处理。
 */
export default function RootPage() {
  redirect('/zh')
}
