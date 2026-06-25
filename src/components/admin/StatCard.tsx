// src/components/admin/StatCard.tsx

interface StatCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon?: string
  trend?: 'up' | 'down' | 'neutral'
}

export function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <div className="bg-stone-800 border border-stone-700 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-stone-400">{title}</p>
          <p className="text-3xl font-bold text-stone-100 mt-2">{value}</p>
          {subtitle && (
            <p className={`text-xs mt-1 ${
              trend === 'up' ? 'text-green-400' :
              trend === 'down' ? 'text-red-400' :
              'text-stone-500'
            }`}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    </div>
  )
}
