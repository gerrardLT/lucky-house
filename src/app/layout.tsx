import type { Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1c1917',
}

/**
 * 根 Layout — 最小化包装器
 * html/body 及 lang 属性由 app/[locale]/layout.tsx 负责
 * 保留 viewport 导出以供全局使用
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
