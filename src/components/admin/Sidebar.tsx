// src/components/admin/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/bookings', label: 'Bookings', icon: '📅' },
  { href: '/admin/contacts', label: 'Contacts', icon: '✉️' },
  { href: '/admin/subscribers', label: 'Subscribers', icon: '👥' },
  { href: '/admin/activities', label: 'Activities', icon: '🎯' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-stone-900 border-r border-stone-700 flex flex-col">
      <div className="p-6 border-b border-stone-700">
        <Link href="/admin/dashboard" className="text-xl font-bold text-amber-400">
          Luckyhouse
        </Link>
        <p className="text-xs text-stone-500 mt-1">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-amber-900/30 text-amber-400 font-medium'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-stone-700">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="w-full text-left px-4 py-2.5 text-sm text-stone-500 hover:text-stone-300 transition-colors"
          >
            ← Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
