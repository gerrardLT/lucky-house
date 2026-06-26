// src/components/admin/InfoSection.tsx
// 共享详情卡片区块 + InfoRow

export function InfoSection({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  children: React.ReactNode
}) {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-stone-500" strokeWidth={1.5} />
        <h2 className="text-sm font-medium text-stone-200">{title}</h2>
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  )
}

export function InfoRow({
  label,
  value,
  indent = false,
}: {
  label: string
  value: string
  indent?: boolean
}) {
  return (
    <div className={`flex justify-between items-baseline ${indent ? 'pl-6' : ''}`}>
      <span className="text-xs text-stone-500">{label}</span>
      <span className="text-xs text-stone-200 font-medium">{value}</span>
    </div>
  )
}
