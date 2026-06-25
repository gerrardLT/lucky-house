// src/app/admin/contacts/[id]/page.tsx
// 联系详情 + 标记已解决

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { StatusBadge } from '@/components/admin/StatusBadge'
import type { ContactRecord } from '@/types'

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [contact, setContact] = useState<ContactRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/contacts/${id}`)
      .then((r) => r.json())
      .then((data) => setContact(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  async function markResolved() {
    const res = await fetch(`/api/admin/contacts/${id}/resolve`, { method: 'PATCH' })
    if (res.ok) setContact(await res.json())
  }

  if (loading) return <p className="text-stone-500">Loading...</p>
  if (!contact) return <p className="text-red-400">Contact not found</p>

  return (
    <div>
      <button onClick={() => router.back()} className="text-sm text-stone-500 hover:text-stone-300 mb-4">← Back</button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-100">{contact.id}</h1>
          <p className="text-sm text-stone-500 mt-1">{new Date(contact.createdAt).toLocaleString()}</p>
        </div>
        <StatusBadge type="contact" status={contact.status} />
      </div>

      <div className="bg-stone-800 border border-stone-700 rounded-xl p-6 space-y-4 max-w-2xl">
        <div className="flex justify-between"><span className="text-stone-500">Subject</span><span className="text-stone-200">{contact.subject}</span></div>
        <div className="flex justify-between"><span className="text-stone-500">Name</span><span className="text-stone-200">{contact.name}</span></div>
        <div className="flex justify-between"><span className="text-stone-500">Email</span><span className="text-stone-200">{contact.email}</span></div>
        {contact.phone && <div className="flex justify-between"><span className="text-stone-500">Phone</span><span className="text-stone-200">{contact.phone}</span></div>}
        <div className="flex justify-between"><span className="text-stone-500">Locale</span><span className="text-stone-200">{contact.locale}</span></div>
        <div className="flex justify-between"><span className="text-stone-500">Routed To</span><span className="text-stone-200">{contact.routedTo}</span></div>

        <div className="border-t border-stone-700 pt-4">
          <p className="text-stone-500 text-sm mb-2">Message</p>
          <p className="text-stone-200 whitespace-pre-wrap">{contact.message}</p>
        </div>

        {contact.status === 'pending' && (
          <button
            onClick={markResolved}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors"
          >
            Mark as Resolved
          </button>
        )}
      </div>
    </div>
  )
}
