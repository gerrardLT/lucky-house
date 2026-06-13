/**
 * PawDivider — 品牌视觉母题分隔线
 *
 * 以柴犬爪印 SVG 作为 section 之间的视觉签名，
 * 取代千篇一律的 <hr> 或纯间距留白。
 */
export function PawDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-6 ${className}`} aria-hidden="true">
      {/* 左线 */}
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-600/30" />
      {/* 爪印 SVG */}
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 text-amber-600/40"
      >
        {/* 四个肉垫 */}
        <ellipse cx="7.5" cy="7" rx="2" ry="2.5" />
        <ellipse cx="16.5" cy="7" rx="2" ry="2.5" />
        <ellipse cx="5" cy="12" rx="1.8" ry="2.2" />
        <ellipse cx="19" cy="12" rx="1.8" ry="2.2" />
        {/* 主掌心 */}
        <path d="M12 21s-5-3.5-5-7.5c0-2.5 1.5-4.5 3.5-4.5 1 0 1.5.4 1.5.4s.5-.4 1.5-.4c2 0 3.5 2 3.5 4.5 0 4-5 7.5-5 7.5z" />
      </svg>
      {/* 右线 */}
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-600/30" />
    </div>
  )
}
