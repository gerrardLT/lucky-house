import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-[#0a0a0a]">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="mt-4 text-lg text-stone-400">
        页面未找到 / ページが見つかりません / Page not found
      </p>
      <Link
        href="/zh"
        className="mt-8 rounded-lg bg-amber-600 px-6 py-3 text-white transition-colors hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
      >
        返回首页 / トップページへ / Back to Home
      </Link>
    </main>
  )
}
