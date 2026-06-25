// src/components/admin/StatCard.tsx

import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  accent?: 'amber' | 'green' | 'red' | 'blue'
}

const accentMap = {
  amber: 'bg-amber-500/10 text-amber-500',
  green: 'bg-emerald-500/10 text-emerald-500',
  red: 'bg-red-500/10 text-red-500',
  blue: 'bg-blue-500/10 text-blue-500',
}

const trendConfig = {
  up: { icon: TrendingUp, color: 'text-emerald-400' },
  down: { icon: TrendingDown, color: 'text-red-400' },
  neutral: { icon: Minus, color: 'text-stone-500' },
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, accent = 'amber' }: StatCardProps) {
  const TrendIcon = trend ? trendConfig[trend].icon : null

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-stone-100 mt-2 tabular-nums">{value}</p>
          {subtitle && (
            <div className={`flex items-center gap-1 mt-1.5 ${trend ? trendConfig[trend].color : 'text-stone-500'}`}>
              {TrendIcon && <TrendIcon className="w-3 h-3" />}
              <p className="text-xs">{subtitle}</p>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accentMap[accent]}`}>
          <Icon className="w-5 h-5" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  )
}
