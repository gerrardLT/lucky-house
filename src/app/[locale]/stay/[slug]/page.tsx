// src/app/[locale]/stay/[slug]/page.tsx
// 房型详情页 — React Server Component
// 展示房型完整信息：图片轮播 + 详细信息 + sticky侧边栏 + 相关推荐

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getRoomTypes, getRoomBySlug } from '@/lib/cms'
import { ImageCarousel } from '@/components/ui/ImageCarousel'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { RoomCard } from '@/components/stay/RoomCard'
import { isValidLocale } from '@/lib/i18n/config'
import type { Locale, RoomType } from '@/types'

// === 多语言文案 ===

const TEXTS = {
  backToList: { zh: '← 返回房型列表', ja: '← 客室一覧に戻る', en: '← Back to Rooms' },
  area: { zh: '面积', ja: '広さ', en: 'Area' },
  areaUnit: { zh: '㎡', ja: '㎡', en: 'sqm' },
  maxGuests: { zh: '可住人数', ja: '宿泊人数', en: 'Max Guests' },
  guestUnit: { zh: '人', ja: '名', en: ' guests' },
  bedType: { zh: '床型', ja: 'ベッドタイプ', en: 'Bed Type' },
  petFriendly: { zh: '🐾 宠物友好', ja: '🐾 ペットフレンドリー', en: '🐾 Pet-Friendly' },
  noPets: { zh: '🚫 不可携宠', ja: '🚫 ペット不可', en: '🚫 No Pets Allowed' },
  maxPets: { zh: '最多可携带 {count} 只宠物', ja: '最大 {count} 匹まで', en: 'Up to {count} pets allowed' },
  maxPetWeight: { zh: '单只体重上限 {weight}kg', ja: '1匹あたり体重上限 {weight}kg', en: 'Max weight per pet: {weight}kg' },
  amenities: { zh: '客房设施', ja: '客室設備', en: 'Room Amenities' },
  suitableFor: { zh: '适合人群', ja: 'こんな方におすすめ', en: 'Suitable For' },
  bookNow: { zh: '立即预约', ja: '今すぐ予約', en: 'Book Now' },
  inquire: { zh: '咨询预约', ja: 'お問い合わせ', en: 'Inquire Now' },
  comingSoon: { zh: '即将开放', ja: '近日オープン', en: 'Coming Soon' },
  relatedRooms: { zh: '其他推荐房型', ja: 'その他のおすすめ客室', en: 'Related Rooms' },
  description: { zh: '房型介绍', ja: '客室紹介', en: 'Room Description' },
  priceLabel: { zh: '价格', ja: '料金', en: 'Price' },
} as const

/** 设施 key 对应显示名称 */
const AMENITY_LABELS: Record<string, Record<Locale, string>> = {
  wifi: { zh: 'Wi-Fi', ja: 'Wi-Fi', en: 'Wi-Fi' },
  'air-conditioning': { zh: '空调', ja: 'エアコン', en: 'Air Conditioning' },
  refrigerator: { zh: '冰箱', ja: '冷蔵庫', en: 'Refrigerator' },
  hairdryer: { zh: '吹风机', ja: 'ドライヤー', en: 'Hair Dryer' },
  'onsen-ticket': { zh: '温泉入浴券', ja: '温泉入浴券', en: 'Onsen Pass' },
  parking: { zh: '免费停车', ja: '無料駐車場', en: 'Free Parking' },
  balcony: { zh: '阳台', ja: 'バルコニー', en: 'Balcony' },
  towels: { zh: '毛巾/浴巾', ja: 'タオル', en: 'Towels' },
  sofa: { zh: '沙发', ja: 'ソファ', en: 'Sofa' },
  'pet-bed': { zh: '宠物床', ja: 'ペットベッド', en: 'Pet Bed' },
  'pet-bowls': { zh: '宠物餐碗', ja: 'ペット食器', en: 'Pet Bowls' },
  'pet-gate': { zh: '宠物围栏', ja: 'ペットゲート', en: 'Pet Gate' },
  'slip-resistant-floor': { zh: '防滑地板', ja: '滑りにくい床', en: 'Slip-Resistant Floor' },
  'dog-run-access': { zh: 'Dog Run 通道', ja: 'ドッグランアクセス', en: 'Dog Run Access' },
  'private-onsen': { zh: '私汤', ja: 'プライベート温泉', en: 'Private Onsen' },
  'separate-living': { zh: '独立客厅', ja: '独立リビング', en: 'Separate Living Room' },
  'private-bbq': { zh: '私人BBQ区', ja: 'プライベートBBQ', en: 'Private BBQ' },
  'fenced-garden': { zh: '围栏庭院', ja: 'フェンス付き庭', en: 'Fenced Garden' },
  terrace: { zh: '露台', ja: 'テラス', en: 'Terrace' },
  kitchen: { zh: '厨房', ja: 'キッチン', en: 'Kitchen' },
  washer: { zh: '洗衣机', ja: '洗濯機', en: 'Washer' },
  'lake-view': { zh: '湖景', ja: 'レイクビュー', en: 'Lake View' },
}

/** 设施 key 对应图标 PNG 路径 */
const AMENITY_ICONS: Record<string, string> = {
  wifi: '/icons/icon-wifi.png',
  'air-conditioning': '/icons/icon-air-conditioning.png',
  refrigerator: '/icons/icon-refrigerator.png',
  hairdryer: '/icons/icon-hairdryer.png',
  'onsen-ticket': '/icons/icon-onsen.png',
  parking: '/icons/icon-parking.png',
  balcony: '/icons/icon-terrace.png',
  towels: '/icons/icon-pet-grooming.png',
  sofa: '/icons/icon-terrace.png',
  'pet-bed': '/icons/icon-pet-house.png',
  'pet-bowls': '/icons/icon-pet-friendly.png',
  'pet-gate': '/icons/icon-leash.png',
  'slip-resistant-floor': '/icons/icon-solar-tree.png',
  'dog-run-access': '/icons/icon-dog-run.png',
  'private-onsen': '/icons/icon-pet-onsen.png',
  'separate-living': '/icons/icon-family.png',
  'private-bbq': '/icons/icon-bbq.png',
  'fenced-garden': '/icons/icon-eco-leaf.png',
  terrace: '/icons/icon-terrace.png',
  kitchen: '/icons/icon-coffee.png',
  washer: '/icons/icon-eco-leaf.png',
  'lake-view': '/icons/icon-eco-leaf.png',
}

// === generateStaticParams: 预渲染所有房型 × 所有 locale ===

export async function generateStaticParams() {
  const rooms = await getRoomTypes()
  const locales: Locale[] = ['zh', 'ja', 'en']

  // 返回所有 locale × slug 组合，确保全量预渲染
  return locales.flatMap((locale) =>
    rooms.map((room) => ({
      locale,
      slug: room.slug,
    }))
  )
}

// === Metadata ===

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  const room = await getRoomBySlug(slug)
  if (!room) {
    return {}
  }

  const typedLocale = locale as Locale

  return {
    title: room.name[typedLocale],
    description: room.description[typedLocale],
    openGraph: {
      title: room.name[typedLocale],
      description: room.description[typedLocale],
      images: room.images[0]
        ? [{ url: room.images[0].src, width: room.images[0].width, height: room.images[0].height }]
        : undefined,
    },
  }
}

// === 获取相关推荐房型 ===

function getRelatedRooms(currentRoom: RoomType, allRooms: RoomType[]): RoomType[] {
  // 优先推荐同类别，其次不同类别，排除当前房型
  const otherRooms = allRooms.filter((r) => r.slug !== currentRoom.slug)

  const sameCategory = otherRooms.filter((r) => r.category === currentRoom.category)
  const differentCategory = otherRooms.filter((r) => r.category !== currentRoom.category)

  // 取最多 3 个推荐：优先同类别，不足时补充不同类别
  const related = [...sameCategory, ...differentCategory].slice(0, 3)
  return related
}

// === 页面组件 ===

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const typedLocale = locale as Locale
  const room = await getRoomBySlug(slug)

  if (!room) {
    notFound()
  }

  const allRooms = await getRoomTypes(typedLocale)
  const relatedRooms = getRelatedRooms(room, allRooms)

  // 准备图片轮播数据
  const carouselImages = room.images.map((img) => ({
    src: img.src,
    alt: img.alt[typedLocale],
    isRendering: img.isRendering,
  }))

  // 确定 CTA 按钮行为
  const ctaHref = `/${typedLocale}/booking${room.isPetFriendly ? '?hasPet=true' : ''}`
  const ctaText =
    room.priceStatus === 'coming_soon'
      ? TEXTS.comingSoon[typedLocale]
      : room.priceStatus === 'inquiry'
        ? TEXTS.inquire[typedLocale]
        : TEXTS.bookNow[typedLocale]
  const ctaDisabled = room.status === 'coming_soon'

  return (
    <div className="bg-[#19160F] text-[#EAE0CC] min-h-screen">
      {/* 返回列表链接 */}
      <nav className="px-8 lg:px-[60px] pt-8 pb-6 border-b border-[rgba(234,224,204,0.08)]">
        <a
          href={`/${typedLocale}/stay`}
          className="inline-flex items-center text-[11px] tracking-[0.2em] uppercase text-[rgba(234,224,204,0.5)] hover:text-[#A07850] transition-colors duration-300"
        >
          {TEXTS.backToList[typedLocale]}
        </a>
      </nav>

      {/* 主内容区域 */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-0">
        {/* 左侧：图片 + 信息（占 2 列） */}
        <div className="lg:col-span-2 border-r border-[rgba(234,224,204,0.08)]">
          {/* 图片轮播 */}
          <div className="relative">
            <ImageCarousel images={carouselImages} className="" />
          </div>

          {/* 房型名称 + 状态 */}
          <div className="px-8 lg:px-[60px] pt-10 pb-8 border-b border-[rgba(234,224,204,0.08)]">
            {/* Kicker */}
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#A07850] mb-4">
              {room.category === 'standard' ? 'Standard Room' : room.category === 'pet-friendly' ? 'Pet-Friendly Room' : 'Campsite Villa'}
            </div>
            <div className="flex flex-wrap items-start gap-4 mb-3">
              <h1 className="font-serif text-[clamp(28px,4vw,52px)] font-normal leading-[1.1] text-[#EAE0CC]">
                {room.name[typedLocale]}
              </h1>
              {room.status === 'coming_soon' && (
                <span className="text-[9px] tracking-[0.25em] uppercase text-[rgba(234,224,204,0.35)] border border-[rgba(234,224,204,0.1)] px-3 py-1.5 mt-2">
                  {TEXTS.comingSoon[typedLocale]}
                </span>
              )}
            </div>
            {typedLocale !== 'en' && (
              <div className="font-serif italic text-[14px] text-[rgba(234,224,204,0.4)] mb-4">{room.name.en}</div>
            )}
            {/* 宠物状态 */}
            {room.isPetFriendly ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border border-[rgba(160,120,80,0.3)] text-[#A07850]">
                  {TEXTS.petFriendly[typedLocale]}
                </span>
                <span className="text-[13px] text-[rgba(234,224,204,0.5)]">
                  {TEXTS.maxPets[typedLocale].replace('{count}', String(room.maxPets))}
                </span>
                {room.maxPetWeight && (
                  <span className="text-[13px] text-[rgba(234,224,204,0.5)]">
                    · {TEXTS.maxPetWeight[typedLocale].replace('{weight}', String(room.maxPetWeight))}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border border-[rgba(234,224,204,0.1)] text-[rgba(234,224,204,0.35)]">
                {TEXTS.noPets[typedLocale]}
              </span>
            )}
          </div>

          {/* 基本信息规格行 */}
          <div className="flex border-b border-[rgba(234,224,204,0.08)]">
            <div className="flex-1 px-8 lg:px-[60px] py-6 border-r border-[rgba(234,224,204,0.08)]">
              <p className="text-[9px] tracking-[0.2em] uppercase text-[rgba(234,224,204,0.35)] mb-2">{TEXTS.area[typedLocale]}</p>
              <p className="font-serif text-[22px] font-normal text-[#EAE0CC]">{room.area} {TEXTS.areaUnit[typedLocale]}</p>
            </div>
            <div className="flex-1 px-6 py-6 border-r border-[rgba(234,224,204,0.08)]">
              <p className="text-[9px] tracking-[0.2em] uppercase text-[rgba(234,224,204,0.35)] mb-2">{TEXTS.maxGuests[typedLocale]}</p>
              <p className="font-serif text-[22px] font-normal text-[#EAE0CC]">{room.maxGuests}{TEXTS.guestUnit[typedLocale]}</p>
            </div>
            <div className="flex-1 px-6 py-6">
              <p className="text-[9px] tracking-[0.2em] uppercase text-[rgba(234,224,204,0.35)] mb-2">{TEXTS.bedType[typedLocale]}</p>
              <p className="text-[15px] text-[#EAE0CC]">{room.bedType[typedLocale]}</p>
            </div>
          </div>

          {/* 房型描述 */}
          <section className="px-8 lg:px-[60px] py-10 border-b border-[rgba(234,224,204,0.08)]">
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#A07850] mb-6">
              {TEXTS.description[typedLocale]}
            </h2>
            <p className="text-[15px] leading-[1.9] text-[rgba(234,224,204,0.7)]">
              {room.description[typedLocale]}
            </p>
          </section>

          {/* 设施列表 */}
          <section className="px-8 lg:px-[60px] py-10 border-b border-[rgba(234,224,204,0.08)]">
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#A07850] mb-6">
              {TEXTS.amenities[typedLocale]}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {room.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2.5 px-3 py-2.5"
                  style={{ borderBottom: '1px solid rgba(234,224,204,0.08)' }}
                >
                  <span className="inline-flex items-center justify-center w-5 h-5" aria-hidden="true">
                    {AMENITY_ICONS[amenity] ? (
                      <Image
                        src={AMENITY_ICONS[amenity]}
                        alt=""
                        width={18}
                        height={18}
                        className="opacity-50"
                      />
                    ) : (
                      <span className="text-xs text-[rgba(234,224,204,0.3)]">-</span>
                    )}
                  </span>
                  <span className="text-[13px] text-[rgba(234,224,204,0.6)]">
                    {AMENITY_LABELS[amenity]?.[typedLocale] || amenity}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 适合人群标签 */}
          <section className="px-8 lg:px-[60px] py-10 border-b border-[rgba(234,224,204,0.08)]">
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#A07850] mb-6">
              {TEXTS.suitableFor[typedLocale]}
            </h2>
            <div className="flex flex-wrap gap-2">
              {room.tags[typedLocale].map((tag) => (
                <span
                  key={tag}
                  className={`inline-block px-4 py-1.5 text-[11px] tracking-[0.12em] border ${
                    room.isPetFriendly
                      ? 'border-[rgba(160,120,80,0.25)] text-[#A07850]'
                      : 'border-[rgba(234,224,204,0.1)] text-[rgba(234,224,204,0.5)]'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* 移动端底部固定 CTA（仅移动端可见） */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#19160F] lg:hidden" style={{ borderTop: '1px solid rgba(234,224,204,0.08)' }}>
            <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
              <div>
                <PriceDisplay
                  status={room.priceStatus}
                  price={room.price}
                  locale={typedLocale}
                />
              </div>
              {!ctaDisabled && (
                <a
                  href={ctaHref}
                  className="text-[11px] tracking-[0.2em] uppercase px-6 py-3 bg-[#A07850] text-[#19160F] font-medium hover:bg-[#C49A6A] transition-colors duration-300"
                >
                  {ctaText}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：Sticky 预订侧边栏（桌面端） */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 p-10" style={{ borderLeft: '1px solid rgba(234,224,204,0.08)' }}>
            {/* 价格状态 */}
            <div className="mb-6 pb-6" style={{ borderBottom: '1px solid rgba(234,224,204,0.08)' }}>
              <p className="text-[9px] tracking-[0.2em] uppercase text-[rgba(234,224,204,0.35)] mb-3">{TEXTS.priceLabel[typedLocale]}</p>
              <PriceDisplay
                status={room.priceStatus}
                price={room.price}
                locale={typedLocale}
                className="text-2xl"
              />
            </div>

            {/* 房型基本信息摘要 */}
            <div className="mb-8 space-y-3 pb-6" style={{ borderBottom: '1px solid rgba(234,224,204,0.08)' }}>
              <p className="text-[13px] text-[rgba(234,224,204,0.5)]">{TEXTS.area[typedLocale]}：{room.area} {TEXTS.areaUnit[typedLocale]}</p>
              <p className="text-[13px] text-[rgba(234,224,204,0.5)]">{TEXTS.maxGuests[typedLocale]}：{room.maxGuests}{TEXTS.guestUnit[typedLocale]}</p>
              <p className="text-[13px] text-[rgba(234,224,204,0.5)]">{TEXTS.bedType[typedLocale]}：{room.bedType[typedLocale]}</p>
              {room.isPetFriendly && (
                <p className="text-[13px] text-[#A07850]">
                  {TEXTS.petFriendly[typedLocale]} · {TEXTS.maxPets[typedLocale].replace('{count}', String(room.maxPets))}
                </p>
              )}
            </div>

            {/* CTA 按钮 */}
            {ctaDisabled ? (
              <div className="text-[11px] tracking-[0.2em] uppercase px-6 py-3 text-center border border-[rgba(234,224,204,0.1)] text-[rgba(234,224,204,0.35)]">
                {ctaText}
              </div>
            ) : (
              <a
                href={ctaHref}
                className="block text-[11px] tracking-[0.2em] uppercase px-6 py-4 text-center bg-[#A07850] text-[#19160F] font-medium hover:bg-[#C49A6A] transition-colors duration-300 w-full"
              >
                {ctaText}
              </a>
            )}
          </div>
        </aside>
      </div>

      {/* 相关推荐房型 */}
      {relatedRooms.length > 0 && (
        <section className="px-8 lg:px-[60px] py-16 border-t border-[rgba(234,224,204,0.08)] mb-20 lg:mb-8">
          <div className="flex items-center gap-5 mb-10">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#A07850] flex-shrink-0">
              {TEXTS.relatedRooms[typedLocale]}
            </span>
            <span className="flex-1 h-px bg-[rgba(234,224,204,0.08)]" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedRooms.map((relatedRoom) => (
              <RoomCard
                key={relatedRoom.slug}
                room={relatedRoom}
                locale={typedLocale}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
