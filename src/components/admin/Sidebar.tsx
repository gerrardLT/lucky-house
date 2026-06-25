// src/components/admin/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarDays,
  Mail,
  Users,
  Compass,
  LogOut,
  Mountain,
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
  { href: '/admin/contacts', label: 'Contacts', icon: Mail },
  { href: '/admin/subscribers', label: 'Subscribers', icon: Users },
  { href: '/admin/activities', label: 'Activities', icon: Compass },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen bg-stone-900 border-r border-stone-800 flex flex-col">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-stone-800">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center">
            <Mountain className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-stone-100 block leading-tight">Luckyhouse</span>
            <span className="text-[10px] text-stone-500 uppercase tracking-wider">Admin</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                isActive
                  ? 'bg-amber-600/10 text-amber-500 font-medium'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="px-3 py-4 border-t border-stone-800">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2 text-[13px] text-stone-500 hover:text-stone-300 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
