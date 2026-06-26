// src/app/admin/page.tsx
// /admin → 重定向到 /admin/dashboard

import { redirect } from 'next/navigation'

export default function AdminRootPage() {
  redirect('/admin/dashboard')
}
