// src/app/admin/dashboard/page.tsx
// 仪表盘 — 统计卡片 + 最近预约列表

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StatCard } from '@/components/admin/StatCard'
import { StatusBadge } from '@/components/admin/StatusBadge'
import type { DashboardStats } from '@/types'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-stone-500">Loading...</p>
  }

  if (!stats) {
    return <p className="text-red-400">Failed to load stats</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-100 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Bookings" value={stats.totalBookings} icon="📅" />
        <StatCard
          title="Pending"
          value={stats.pendingBookings}
          subtitle={stats.pendingBookings > 0 ? 'Needs attention' : undefined}
          icon="⏳"
          trend={stats.pendingBookings > 0 ? 'down' : 'neutral'}
        />
        <StatCard title="Contacts" value={stats.totalContacts} subtitle={`${stats.pendingContacts} pending`} icon="✉️" />
        <StatCard title="Subscribers" value={stats.totalSubscribers} icon="👥" />
      </div>

      <div className="bg-stone-800 border border-stone-700 rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-700">
          <h2 className="text-lg font-medium text-stone-200">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-amber-400 hover:text-amber-300">
            View All →
          </Link>
        </div>

        {stats.recentBookings.length === 0 ? (
          <p className="text-center text-stone-500 py-8">No bookings yet</p>
        ) : (
          <div className="divide-y divide-stone-700">
            {stats.recentBookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/admin/bookings/${booking.id}`}
                className="flex items-center justify-between px-6 py-3 hover:bg-stone-700/30 transition-colors"
              >
                <div>
                  <span className="text-sm font-mono text-amber-400">{booking.id}</span>
                  <span className="text-xs text-stone-500 ml-3">
                    {booking.checkIn} → {booking.checkOut}
                  </span>
                </div>
                <StatusBadge type="booking" status={booking.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
