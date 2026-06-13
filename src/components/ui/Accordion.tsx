'use client'

import { useState, useCallback } from 'react'

export interface AccordionItem {
  id: string
  question: string
  answer: string
}

export interface AccordionProps {
  items: AccordionItem[]
  defaultOpen?: string[]
  className?: string
}

export function Accordion({
  items,
  defaultOpen = [],
  className = '',
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(defaultOpen)
  )

  const toggle = useCallback((id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle(id)
      }
    },
    [toggle]
  )

  return (
    <div className={`divide-y divide-stone-700 border-y border-stone-700 ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id)
        const panelId = `accordion-panel-${item.id}`
        const headerId = `accordion-header-${item.id}`

        return (
          <div key={item.id}>
            <h3>
              <button
                id={headerId}
                type="button"
                className="flex w-full items-center justify-between py-4 px-1 text-left text-white font-medium hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset rounded"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
              >
                <span>{item.question}</span>
                <svg
                  className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className={isOpen ? 'pb-4 px-1' : ''}
            >
              {isOpen && (
                <p className="text-stone-300 text-sm leading-relaxed">
                  {item.answer}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
