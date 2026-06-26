// src/app/admin/contacts/[id]/page.tsx
// 联系详情 + 标记已解决

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MessageSquare, CheckCircle2, User, Globe, Loader2 } from 'lucide-react'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { InfoRow } from '@/components/admin/InfoSection'
import { ErrorToast } from '@/components/admin/ErrorToast'
import { useAdminLocale } from '@/lib/i18n/useAdminLocale'
import type { ContactRecord } from '@/types'

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { t } = useAdminLocale()
  const [contact, setContact] = useState<ContactRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [resolving, setResolving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/admin/contacts/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('HTTP_ERROR')
        return r.json()
      })
      .then((data) => setContact(data))
      .catch(() => setError(t('common.errorLoad')))
      .finally(() => setLoading(false))
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function markResolved() {
    setResolving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/contacts/${id}/resolve`, { method: 'PATCH' })
      if (res.ok) {
        setContact(await res.json())
      } else {
        setError(t('common.errorAction'))
      }
    } catch {
      setError(t('common.errorNetwork'))
    } finally {
      setResolving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <div className="h-4 w-16 bg-stone-800 rounded animate-pulse mb-6" />
        <div className="h-7 w-48 bg-stone-800 rounded animate-pulse mb-8" />
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3.5 bg-stone-800/50 rounded animate-pulse mb-3" />
          ))}
        </div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-red-400">{t('contacts.detail.notFound')}</p>
      </div>
    )
  }

  return (
    <div>
      <ErrorToast message={error} onClose={() => setError(null)} />

      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-300 mb-5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t('contacts.detail.back')}
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-stone-100 font-mono">{contact.id}</h1>
          <p className="text-xs text-stone-500 mt-1">{new Date(contact.createdAt).toLocaleString()}</p>
        </div>
        <StatusBadge type="contact" status={contact.status} />
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4 max-w-2xl">
        {/* Info section */}
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-stone-500" strokeWidth={1.5} />
          <span className="text-sm font-medium text-stone-200">{t('contacts.detail.details')}</span>
        </div>

        <InfoRow label={t('contacts.detail.subject')} value={contact.subject} indent />
        <InfoRow label={t('contacts.detail.name')} value={contact.name} indent />
        <InfoRow label={t('contacts.detail.email')} value={contact.email} indent />
        {contact.phone && <InfoRow label={t('contacts.detail.phone')} value={contact.phone} indent />}

        <div className="flex items-center gap-2 pt-2">
          <Globe className="w-4 h-4 text-stone-500" strokeWidth={1.5} />
          <span className="text-sm font-medium text-stone-200">{t('contacts.detail.routing')}</span>
        </div>
        <InfoRow label={t('contacts.detail.locale')} value={contact.locale} indent />
        <InfoRow label={t('contacts.detail.routedTo')} value={contact.routedTo} indent />

        {/* Message */}
        <div className="border-t border-stone-800 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-stone-500" strokeWidth={1.5} />
            <span className="text-sm font-medium text-stone-200">{t('contacts.detail.message')}</span>
          </div>
          <p className="text-sm text-stone-300 whitespace-pre-wrap leading-relaxed pl-6">{contact.message}</p>
        </div>

        {/* Resolve button */}
        {contact.status === 'pending' && (
          <div className="border-t border-stone-800 pt-4">
            <button
              onClick={markResolved}
              disabled={resolving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white text-xs font-medium rounded-lg transition-colors"
            >
              {resolving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {t('contacts.detail.markResolved')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
