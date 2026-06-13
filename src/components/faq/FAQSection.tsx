'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { FAQ, FAQCategory, Locale } from '@/types'
import { FilterBar } from '@/components/ui/FilterBar'
import { Accordion } from '@/components/ui/Accordion'

/** Category filter key includes 'all' in addition to FAQCategory */
type FilterKey = 'all' | FAQCategory

interface CategoryOption {
  key: FilterKey
  label: string
}

/** Category labels per locale */
const CATEGORY_LABELS: Record<Locale, Record<FilterKey, string>> = {
  zh: {
    all: '全部',
    pet: '宠物',
    'room-price': '房型价格',
    onsen: '温泉',
    facility: '设施',
    transport: '交通',
    activity: '活动',
    cancel: '取消退款',
  },
  ja: {
    all: 'すべて',
    pet: 'ペット',
    'room-price': '客室・料金',
    onsen: '温泉',
    facility: '施設',
    transport: '交通',
    activity: 'アクティビティ',
    cancel: 'キャンセル',
  },
  en: {
    all: 'All',
    pet: 'Pets',
    'room-price': 'Rooms & Pricing',
    onsen: 'Onsen',
    facility: 'Facilities',
    transport: 'Transport',
    activity: 'Activities',
    cancel: 'Cancellation',
  },
}

/** "No results" labels per locale */
const NO_RESULTS_LABELS: Record<Locale, { message: string; linkText: string }> = {
  zh: { message: '没有找到相关问题？', linkText: '联系我们' },
  ja: { message: '関連する質問が見つかりませんか？', linkText: 'お問い合わせ' },
  en: { message: "Can't find what you're looking for?", linkText: 'Contact Us' },
}

/** Search placeholder per locale */
const SEARCH_PLACEHOLDERS: Record<Locale, string> = {
  zh: '搜索常见问题...',
  ja: 'よくある質問を検索...',
  en: 'Search FAQ...',
}

export interface FAQSectionProps {
  faqs: FAQ[]
  locale: Locale
}

export function FAQSection({ faqs, locale }: FAQSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<FilterKey>('all')
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounce search input (300ms)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchQuery])

  // Build category filter options
  const categoryOptions: CategoryOption[] = useMemo(() => {
    const labels = CATEGORY_LABELS[locale]
    const keys: FilterKey[] = [
      'all',
      'pet',
      'room-price',
      'onsen',
      'facility',
      'transport',
      'activity',
      'cancel',
    ]
    return keys.map((key) => ({ key, label: labels[key] }))
  }, [locale])

  // Filter FAQs based on search + category (intersection)
  const filteredFAQs = useMemo(() => {
    let results = faqs

    // Category filter
    if (activeCategory !== 'all') {
      results = results.filter((faq) => faq.category === activeCategory)
    }

    // Keyword search (case-insensitive, partial text match on question AND answer)
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.trim().toLowerCase()
      results = results.filter((faq) => {
        const question = faq.question[locale]?.toLowerCase() ?? ''
        const answer = faq.answer[locale]?.toLowerCase() ?? ''
        return question.includes(query) || answer.includes(query)
      })
    }

    // Sort by sortOrder
    return results.sort((a, b) => a.sortOrder - b.sortOrder)
  }, [faqs, activeCategory, debouncedQuery, locale])

  // Transform filtered FAQs to Accordion items
  const accordionItems = useMemo(
    () =>
      filteredFAQs.map((faq) => ({
        id: faq.id,
        question: faq.question[locale] ?? faq.question.zh,
        answer: faq.answer[locale] ?? faq.answer.zh,
      })),
    [filteredFAQs, locale]
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
    },
    []
  )

  const handleCategoryFilter = useCallback((key: string) => {
    setActiveCategory(key as FilterKey)
  }, [])

  const noResults = accordionItems.length === 0
  const noResultsLabels = NO_RESULTS_LABELS[locale]

  return (
    <section className="w-full" aria-label="FAQ">
      {/* Search Input */}
      <div className="mb-6">
        <label htmlFor="faq-search" className="sr-only">
          {SEARCH_PLACEHOLDERS[locale]}
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            id="faq-search"
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={SEARCH_PLACEHOLDERS[locale]}
            className="w-full rounded-lg border border-stone-600 bg-stone-800 py-3 pl-10 pr-4 text-sm text-white placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Bar */}
      <FilterBar
        options={categoryOptions}
        activeKey={activeCategory}
        onFilter={handleCategoryFilter}
        className="mb-8"
        aria-label={locale === 'zh' ? 'FAQ 分类筛选' : locale === 'ja' ? 'FAQ カテゴリフィルター' : 'FAQ category filter'}
      />

      {/* FAQ Accordion or No Results */}
      {noResults ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg
            className="mb-4 h-12 w-12 text-stone-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
            />
          </svg>
          <p className="mb-3 text-stone-600 text-base">
            {noResultsLabels.message}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-colors"
          >
            {noResultsLabels.linkText}
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638l-3.96-3.96a.75.75 0 111.06-1.06l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06l3.96-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      ) : (
        <Accordion items={accordionItems} />
      )}
    </section>
  )
}
