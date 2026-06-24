// src/app/[locale]/stay/page.tsx
// 住宿房型列表页 — React Server Component
// 展示所有房型卡片（含筛选）+ 房型对比表

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRoomTypes } from '@/lib/cms'
import { RoomGrid } from '@/components/stay/RoomGrid'
import { RoomComparisonTable } from '@/components/stay/RoomComparisonTable'
import { isValidLocale } from '@/lib/i18n/config'
import type { Locale } from '@/types'

/** 页面标题/描述多语言映射 */
const PAGE_TITLE: Record<Locale, string> = {
  zh: '在温泉之乡，寻一处停驻',
  ja: '岳温泉に\uFF0C\u4E00\u3064\u306E\u5B50\u3092',
  en: 'Find Your Place in Dake Onsen',
}

const PAGE_KICKER: Record<Locale, string> = {
  zh: 'Accommodations · 住宿',
  ja: '宿泊 · Accommodations',
  en: 'Accommodations',
}

const PAGE_SUBTITLE: Record<Locale, string> = {
  zh: '从舒适标准房到宠物友好套房，再到林间营地别墅——总有一个空间，让您与爱宠共度温泉时光',
  ja: 'スタンダードルームからペットフレンドリースイート、森のキャンプヴィラまで——愛するペットと温泉のひとときを',
  en: 'From comfortable standard rooms to pet-friendly suites and forest campsite villas — find the perfect space to share an onsen getaway with your companion',
}

const PAGE_DESCRIPTION: Record<Locale, string> = {
  zh: '浏览福岛岳温泉零碳宠物营地的全部房型，包括标准房、宠物友好房和营地别墅。',
  ja: '福島岳温泉ゼロカーボンペットキャンプの全客室タイプをご覧ください。',
  en: 'Browse all room types at Fukushima Dake Onsen Zero-Carbon Pet Camp, including standard rooms, pet-friendly rooms, and campsite villas.',
}

/** 生成页面元数据 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  return {
    title: PAGE_TITLE[locale as Locale],
    description: PAGE_DESCRIPTION[locale as Locale],
    openGraph: {
      title: PAGE_TITLE[locale as Locale],
      description: PAGE_DESCRIPTION[locale as Locale],
    },
  }
}

/** 住宿房型列表页 */
export default async function StayPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const typedLocale = locale as Locale
  const rooms = await getRoomTypes(typedLocale)

  return (
    <div className="bg-[#19160F] text-[#EAE0CC] min-h-screen">
      {/* Editorial 页面标题区域 */}
      <header className="px-8 lg:px-[60px] pt-[60px] lg:pt-[80px] pb-[40px] lg:pb-[60px] border-b border-[rgba(234,224,204,0.08)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[60px] items-end">
          <div>
            <div className="text-[11px] tracking-[0.35em] uppercase text-[#A07850] mb-5">
              {PAGE_KICKER[typedLocale]}
            </div>
            <h1 className="font-serif text-[clamp(36px,5vw,68px)] font-normal leading-[1.1] tracking-[-0.01em] text-[#EAE0CC]">
              {typedLocale === 'zh' ? (
                <>在温泉之乡<br /><em className="italic text-[rgba(234,224,204,0.6)]">寻一处停驻</em></>
              ) : typedLocale === 'ja' ? (
                <>岳温泉で<br /><em className="italic text-[rgba(234,224,204,0.6)]">癒しの宿を</em></>
              ) : (
                <>Find Your Place<br /><em className="italic text-[rgba(234,224,204,0.6)]">in Dake Onsen</em></>
              )}
            </h1>
          </div>
          <div>
            <p className="text-[15px] leading-[1.9] text-[rgba(234,224,204,0.6)] font-light mb-8">
              {PAGE_SUBTITLE[typedLocale]}
            </p>
            <div className="flex gap-8 lg:gap-10">
              <div className="pl-4" style={{ borderLeft: '2px solid rgba(234,224,204,0.08)' }}>
                <div className="font-serif text-[28px] text-[#C49A6A] leading-none">6</div>
                <div className="text-[11px] text-[rgba(234,224,204,0.35)] tracking-[0.1em] mt-1">
                  {typedLocale === 'zh' ? '房型' : typedLocale === 'ja' ? '客室タイプ' : 'Room Types'}
                </div>
              </div>
              <div className="pl-4" style={{ borderLeft: '2px solid rgba(234,224,204,0.08)' }}>
                <div className="font-serif text-[28px] text-[#C49A6A] leading-none">4</div>
                <div className="text-[11px] text-[rgba(234,224,204,0.35)] tracking-[0.1em] mt-1">
                  {typedLocale === 'zh' ? '宠物友好' : typedLocale === 'ja' ? 'ペット可' : 'Pet-Friendly'}
                </div>
              </div>
              <div className="pl-4" style={{ borderLeft: '2px solid rgba(234,224,204,0.08)' }}>
                <div className="font-serif text-[28px] text-[#C49A6A] leading-none">28–70</div>
                <div className="text-[11px] text-[rgba(234,224,204,0.35)] tracking-[0.1em] mt-1">
                  {typedLocale === 'zh' ? 'm² 面积区间' : typedLocale === 'ja' ? 'm² 面積' : 'sqm Range'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 房型 Editorial 展示（含筛选）*/}
      <section aria-label={PAGE_KICKER[typedLocale]}>
        <RoomGrid rooms={rooms} locale={typedLocale} editorialMode />
      </section>

      {/* 房型对比表 */}
      <div className="px-8 lg:px-[60px] py-16 border-t border-[rgba(234,224,204,0.08)]">
        <RoomComparisonTable rooms={rooms} locale={typedLocale} />
      </div>
    </div>
  )
}
