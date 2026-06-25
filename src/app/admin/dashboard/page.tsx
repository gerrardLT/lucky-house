// src/app/admin/dashboard/page.tsx
// 仪表盘 — 统计卡片 + 最近预约列表

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Clock, Mail, Users, ArrowRight } from 'lucide-react'
import { StatCard } from '@/components/admin/StatCard'
import { StatusBadge } from '@/components/admin/StatusBadge'
import type { DashboardStats } from '@/types'

function DashboardSkeleton() {
  return (
    <div>
      <div className="h-7 w-32 bg-stone-800 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-stone-900 border border-stone-800 rounded-xl p-5">
            <div className="h-3 w-20 bg-stone-800 rounded animate-pulse" />
            <div className="h-7 w-12 bg-stone-800 rounded animate-pulse mt-3" />
          </div>
        ))}
      </div>
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6">
        <div className="h-5 w-36 bg-stone-800 rounded animate-pulse mb-4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-10 bg-stone-800/40 rounded mb-2 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

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

  if (loading) return <DashboardSkeleton />

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-red-400">Failed to load stats</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-stone-100 mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={CalendarDays}
          accent="amber"
        />
        <StatCard
          title="Pending"
          value={stats.pendingBookings}
          subtitle={stats.pendingBookings > 0 ? 'Needs attention' : 'All clear'}
          icon={Clock}
          accent={stats.pendingBookings > 0 ? 'red' : 'green'}
          trend={stats.pendingBookings > 0 ? 'down' : 'neutral'}
        />
        <StatCard
          title="Contacts"
          value={stats.totalContacts}
          subtitle={`${stats.pendingContacts} pending`}
          icon={Mail}
          accent="blue"
        />
        <StatCard
          title="Subscribers"
          value={stats.totalSubscribers}
          icon={Users}
          accent="green"
        />
      </div>

      {/* Recent Bookings */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
          <h2 className="text-sm font-medium text-stone-200">Recent Bookings</h2>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400 transition-colors"
          >
            View All
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {stats.recentBookings.length === 0 ? (
          <p className="text-center text-sm text-stone-600 py-10">No bookings yet</p>
        ) : (
          <div className="divide-y divide-stone-800/60">
            {stats.recentBookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/admin/bookings/${booking.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-stone-800/30 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-amber-500">{booking.id}</span>
                  <span className="text-xs text-stone-600">
                    {booking.checkIn} → {booking.checkOut}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-stone-600">
                    {booking.adults}A + {booking.children}C
                  </span>
                  <StatusBadge type="booking" status={booking.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
