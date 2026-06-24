// src/app/[locale]/pet-friendly/page.tsx
// 宠物友好页 — React Server Component
// Requirements: 6.1–6.8

import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getFacilities, getFAQs } from '@/lib/cms'
import { PetServiceList } from '@/components/pet/PetServiceList'
import { isValidLocale } from '@/lib/i18n/config'
import type { Locale } from '@/types'

// === 多语言文案 ===

const PAGE_TEXT = {
  zh: {
    // Hero / 价值主张
    heroTitle: '宠物也是家人',
    heroSubtitle: '在福岛岳温泉，和毛孩子一起享受天然温泉与自然度假',
    heroDescription: '我们相信每一位家庭成员都值得被好好对待——包括您的宠物伙伴。这里不是简单的"可以带宠物"，而是真正为宠物家庭打造的度假体验。',
    // 服务清单
    servicesTitle: '宠物专属服务',
    servicesSubtitle: '从温泉到运动，为毛孩子准备的全方位关怀',
    // 入住流程
    flowTitle: '携宠入住流程',
    flowSubtitle: '简单四步，开启宠物友好假期',
    flowSteps: [
      { title: '在线预约', description: '通过预约表单选择房型、填写宠物信息' },
      { title: '到店抵达', description: '携带宠物疫苗证明，前往前台办理入住' },
      { title: '确认入住', description: '签署宠物入住协议，领取宠物欢迎包' },
      { title: '尽情享受', description: '自由使用 Dog Run、宠物温泉等设施' },
    ],
    // 规则说明
    rulesTitle: '宠物入住须知',
    rulesSubtitle: '为了所有住客和宠物的安全与舒适',
    rulesNote: '涉及医疗/健康/疫苗要求的内容待运营确认后发布',
    // 生活方式场景
    lifestyleTitle: '宠物生活方式',
    lifestyleSubtitle: '和毛孩子一起的度假日常',
    scenes: [
      {
        title: '清晨散步',
        description: '沿着林间步道和爱宠一起呼吸清新空气，欣赏安达太良山的晨光。',
        icon: '🌅',
      },
      {
        title: 'Dog Run 运动',
        description: '在500平方米的天然草坪跑场尽情奔跑，大型犬区与中小型犬区分开使用。',
        icon: '🐕',
      },
      {
        title: 'BBQ 陪伴时光',
        description: '在户外BBQ露台享受家庭烧烤，宠物在专属围栏区域安心陪伴用餐。',
        icon: '🔥',
      },
      {
        title: '咖啡休闲',
        description: '在营地咖啡厅的宠物友好露台座位区，与爱宠共享悠闲午后。',
        icon: '☕',
      },
      {
        title: '宠物社交活动',
        description: '月度宠物交流会让毛孩子结交新朋友，主人们互相交流养宠心得。',
        icon: '🎉',
      },
    ],
    // CTA
    ctaPrimary: '查看宠物友好房',
    ctaSecondary: '携宠预约',
    ctaBottomTitle: '准备好带上毛孩子出发了吗？',
    ctaBottomDescription: '立即预约，为您和爱宠开启一段温泉度假之旅。',
    // 核心问题回答
    coreAnswer: '我的宠物能住吗？',
    coreAnswerText: '可以！我们接受犬类和猫类入住，提供专门的宠物友好房型、宠物设施和服务。具体品种和体重限制请在预约时确认。',
  },
  ja: {
    heroTitle: 'ペットも家族です',
    heroSubtitle: '福島岳温泉で、愛するペットと一緒に天然温泉と自然のバケーションを',
    heroDescription: '私たちは家族全員が大切にされるべきだと信じています——ペットのパートナーも含めて。ここは単なる「ペット可」ではなく、ペット家族のために作られた本当のバケーション体験です。',
    servicesTitle: 'ペット専用サービス',
    servicesSubtitle: '温泉から運動まで、わんちゃんのためのトータルケア',
    flowTitle: 'ペット宿泊の流れ',
    flowSubtitle: '簡単4ステップで、ペットフレンドリーな休日を',
    flowSteps: [
      { title: 'オンライン予約', description: '予約フォームでお部屋タイプを選び、ペット情報を入力' },
      { title: 'ご到着', description: 'ペットの予防接種証明書をお持ちいただき、フロントでチェックイン' },
      { title: 'チェックイン確認', description: 'ペット宿泊同意書にサイン、ウェルカムキットをお受け取り' },
      { title: 'お楽しみください', description: 'ドッグラン、ペット温泉などの施設を自由にご利用' },
    ],
    rulesTitle: 'ペット宿泊のご案内',
    rulesSubtitle: 'すべてのお客様とペットの安全と快適のために',
    rulesNote: '医療・健康・ワクチンに関する要件は運営確認後に公開予定',
    lifestyleTitle: 'ペットライフスタイル',
    lifestyleSubtitle: '愛犬と一緒のバケーションの日常',
    scenes: [
      {
        title: '朝の散歩',
        description: '林間の遊歩道で愛犬と一緒に新鮮な空気を吸い、安達太良山の朝日を眺める。',
        icon: '🌅',
      },
      {
        title: 'ドッグラン',
        description: '500㎡の天然芝ドッグランで思いっきり走り回れる。大型犬と中小型犬のエリア分け。',
        icon: '🐕',
      },
      {
        title: 'BBQタイム',
        description: '屋外BBQテラスでご家族と焼肉を楽しみ、ペットは専用フェンスエリアでお付き合い。',
        icon: '🔥',
      },
      {
        title: 'カフェタイム',
        description: 'キャンプカフェのペット同伴可テラス席で、のんびりとした午後を。',
        icon: '☕',
      },
      {
        title: 'ペット交流会',
        description: '月例ペット交流会でわんちゃんも新しいお友達を作り、飼い主同士も情報交換。',
        icon: '🎉',
      },
    ],
    ctaPrimary: 'ペットフレンドリールームを見る',
    ctaSecondary: 'ペット連れ予約',
    ctaBottomTitle: '愛犬と一緒に出かける準備はできましたか？',
    ctaBottomDescription: '今すぐご予約いただき、ペットとの温泉バケーションを始めましょう。',
    coreAnswer: 'うちのペットは泊まれますか？',
    coreAnswerText: 'はい！犬と猫のご宿泊を受け付けております。専用のペットフレンドリールーム、ペット施設とサービスをご用意しています。犬種・体重制限の詳細はご予約時にご確認ください。',
  },
  en: {
    heroTitle: 'Pets Are Family Too',
    heroSubtitle: 'Enjoy natural hot springs and nature getaways with your furry companion at Fukushima Dake Onsen',
    heroDescription: "We believe every family member deserves to be well cared for — including your pet companions. This isn't just \"pet-allowed\" — it's a vacation experience truly designed for pet families.",
    servicesTitle: 'Pet Services',
    servicesSubtitle: 'Comprehensive care for your furry friends, from onsen to exercise',
    flowTitle: 'Pet Check-in Process',
    flowSubtitle: 'Four simple steps to start your pet-friendly holiday',
    flowSteps: [
      { title: 'Book Online', description: 'Select room type and fill in pet information via booking form' },
      { title: 'Arrive', description: 'Bring pet vaccination certificates and check in at the front desk' },
      { title: 'Confirm Check-in', description: 'Sign pet stay agreement and receive welcome kit' },
      { title: 'Enjoy', description: 'Freely use Dog Run, pet onsen, and other facilities' },
    ],
    rulesTitle: 'Pet Stay Guidelines',
    rulesSubtitle: 'For the safety and comfort of all guests and pets',
    rulesNote: 'Medical/health/vaccination requirements to be confirmed by operations',
    lifestyleTitle: 'Pet Lifestyle',
    lifestyleSubtitle: 'Daily vacation moments with your furry companion',
    scenes: [
      {
        title: 'Morning Walks',
        description: 'Breathe in fresh air along forest trails with your pet, watching the morning light over Mount Adatara.',
        icon: '🌅',
      },
      {
        title: 'Dog Run Fun',
        description: 'Run freely on 500+ sqm of natural grass, with separate zones for large and small/medium dogs.',
        icon: '🐕',
      },
      {
        title: 'BBQ Companionship',
        description: 'Enjoy family barbecue on the outdoor terrace while pets relax in the dedicated fenced area.',
        icon: '🔥',
      },
      {
        title: 'Café Time',
        description: 'Share a relaxed afternoon at the pet-friendly terrace of the campsite café.',
        icon: '☕',
      },
      {
        title: 'Pet Social Events',
        description: 'Monthly pet meetups where furry friends make new pals and owners exchange tips.',
        icon: '🎉',
      },
    ],
    ctaPrimary: 'View Pet-Friendly Rooms',
    ctaSecondary: 'Book with Pet',
    ctaBottomTitle: 'Ready to travel with your furry friend?',
    ctaBottomDescription: 'Book now and start your onsen vacation with your beloved pet.',
    coreAnswer: 'Can my pet stay here?',
    coreAnswerText: 'Yes! We welcome dogs and cats with dedicated pet-friendly rooms, pet facilities, and services. Please confirm specific breed and weight restrictions when booking.',
  },
}

// === Metadata ===

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  if (!isValidLocale(locale)) return {}

  const text = PAGE_TEXT[locale as Locale]

  return {
    title: text.heroTitle,
    description: text.heroSubtitle,
    openGraph: {
      title: text.heroTitle,
      description: text.heroSubtitle,
    },
  }
}

// === Page Component ===

export default async function PetFriendlyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params

  if (!isValidLocale(localeParam)) {
    notFound()
  }

  const locale = localeParam as Locale
  const text = PAGE_TEXT[locale]

  // 获取设施数据（用于 PetServiceList）
  const facilities = await getFacilities(locale)

  // 获取宠物相关 FAQ 作为规则说明
  const petFAQs = await getFAQs('pet')

  return (
    <div className="bg-[#19160F] text-[#EAE0CC]">
      {/* Section 1: Editorial Hero */}
      <section
        className="grid lg:grid-cols-2"
        style={{ borderBottom: '1px solid rgba(234,224,204,0.08)' }}
      >
        {/* 文字列 */}
        <div className="px-8 lg:px-[60px] pt-[60px] lg:pt-[80px] pb-[48px] lg:pb-[64px] flex flex-col justify-end">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#A07850] mb-4">
            {locale === 'zh' ? 'Pet-Friendly · 宠物友好' : locale === 'ja' ? 'ペットフレンドリー' : 'Pet Friendly'}
          </p>
          <h1
            className="font-serif font-normal leading-[1.1] text-[#EAE0CC]"
            style={{ fontSize: 'clamp(36px,5vw,68px)' }}
          >
            {text.heroTitle}
            <br />
            <em className="italic" style={{ color: 'rgba(234,224,204,0.5)' }}>
              {text.heroSubtitle}
            </em>
          </h1>
          <p
            className="mt-6 text-sm leading-relaxed max-w-md"
            style={{ color: 'rgba(234,224,204,0.6)' }}
          >
            {text.heroDescription}
          </p>
          <div className="flex flex-wrap gap-5 mt-8">
            <a
              href={`/${locale}/stay`}
              className="text-sm tracking-[0.1em] uppercase text-[#A07850] hover:text-[#C49A6A] transition-colors"
            >
              {text.ctaPrimary} →
            </a>
            <a
              href={`/${locale}/booking`}
              className="text-sm tracking-[0.1em] uppercase transition-colors hover:text-[#EAE0CC]"
              style={{ color: 'rgba(234,224,204,0.5)' }}
            >
              {text.ctaSecondary} →
            </a>
          </div>
        </div>
        {/* 图片列 */}
        <div
          className="relative min-h-[360px] lg:min-h-0 overflow-hidden"
          style={{ background: '#211D14' }}
        >
          <Image
            src="/images/hero/hero-02-shiba-onsen-veranda.png"
            alt={text.heroTitle}
            fill
            className="object-cover opacity-25 mix-blend-luminosity"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div
            className="absolute bottom-4 left-4 px-2 py-1 text-[9px] tracking-[0.15em] uppercase"
            style={{
              background: 'rgba(160,120,80,0.15)',
              color: '#A07850',
              border: '1px solid rgba(160,120,80,0.25)',
            }}
          >
            {locale === 'zh' ? '示意图' : locale === 'ja' ? 'イメージ' : 'Concept'}
          </div>
        </div>
      </section>
  
      {/* Section: 核心问题回答 */}
      <section
        className="px-8 lg:px-[60px] py-12 lg:py-16"
        style={{
          background: '#211D14',
          borderBottom: '1px solid rgba(234,224,204,0.08)',
        }}
      >
        <div className="max-w-3xl">
          <h2
            className="font-serif font-normal text-[#EAE0CC]"
            style={{ fontSize: 'clamp(20px,2.8vw,34px)' }}
          >
            {text.coreAnswer}
          </h2>
          <p
            className="mt-4 text-sm leading-relaxed"
            style={{ color: 'rgba(234,224,204,0.65)' }}
          >
            {text.coreAnswerText}
          </p>
        </div>
      </section>
  
      {/* Section 2: 宠物服务清单 */}
      <section
        className="px-8 lg:px-[60px] py-12 lg:py-16"
        style={{ borderBottom: '1px solid rgba(234,224,204,0.08)' }}
      >
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#A07850] mb-2">
          {text.servicesTitle}
        </p>
        <p
          className="font-serif font-normal text-[#EAE0CC] mb-10"
          style={{ fontSize: 'clamp(18px,2.5vw,28px)' }}
        >
          {text.servicesSubtitle}
        </p>
        <PetServiceList facilities={facilities} locale={locale} />
      </section>
  
      {/* Section 3: 入住流程 */}
      <section
        className="px-8 lg:px-[60px] py-12 lg:py-16"
        style={{
          background: '#211D14',
          borderBottom: '1px solid rgba(234,224,204,0.08)',
        }}
      >
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#A07850] mb-2">
          {text.flowTitle}
        </p>
        <p
          className="font-serif font-normal text-[#EAE0CC] mb-10"
          style={{ fontSize: 'clamp(18px,2.5vw,28px)' }}
        >
          {text.flowSubtitle}
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {text.flowSteps.map((step, index) => (
            <div
              key={index}
              className="p-6"
              style={{
                background: '#19160F',
                border: '1px solid rgba(234,224,204,0.08)',
              }}
            >
              <p
                className="font-serif text-3xl font-normal mb-4"
                style={{ color: '#A07850' }}
              >
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="text-sm font-medium text-[#EAE0CC] mb-2">
                {step.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: 'rgba(234,224,204,0.55)' }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
  
      {/* Section 4: 规则说明 */}
      <section
        className="px-8 lg:px-[60px] py-12 lg:py-16"
        style={{ borderBottom: '1px solid rgba(234,224,204,0.08)' }}
      >
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#A07850] mb-2">
          {text.rulesTitle}
        </p>
        <p
          className="font-serif font-normal text-[#EAE0CC] mb-8"
          style={{ fontSize: 'clamp(18px,2.5vw,28px)' }}
        >
          {text.rulesSubtitle}
        </p>
        <div className="space-y-3">
          {petFAQs.map((faq) => (
            <div
              key={faq.id}
              className="p-5"
              style={{
                background: '#211D14',
                border: '1px solid rgba(234,224,204,0.08)',
              }}
            >
              <h3 className="text-sm font-medium text-[#EAE0CC] mb-2">
                {faq.question[locale]}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(234,224,204,0.6)' }}
              >
                {faq.answer[locale]}
              </p>
            </div>
          ))}
        </div>
        <p
          className="mt-5 text-xs"
          style={{ color: 'rgba(234,224,204,0.35)' }}
        >
          ⚠️ {text.rulesNote}
        </p>
      </section>
  
      {/* Section 5: 生活方式场景 */}
      <section
        className="px-8 lg:px-[60px] py-12 lg:py-16"
        style={{
          background: '#211D14',
          borderBottom: '1px solid rgba(234,224,204,0.08)',
        }}
      >
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#A07850] mb-2">
          {text.lifestyleTitle}
        </p>
        <p
          className="font-serif font-normal text-[#EAE0CC] mb-10"
          style={{ fontSize: 'clamp(18px,2.5vw,28px)' }}
        >
          {text.lifestyleSubtitle}
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {text.scenes.map((scene, index) => (
            <div
              key={index}
              style={{
                background: '#19160F',
                border: '1px solid rgba(234,224,204,0.08)',
              }}
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={[
                    '/images/hero/hero-01-family-pet-walkway.png',
                    '/images/facilities/facility-dog-run-01.png',
                    '/images/facilities/facility-bbq-terrace-01.png',
                    '/images/rooms/room-pet-friendly-interior-01.png',
                    '/images/activities/activity-pet-sports-01.png',
                  ][index]}
                  alt={scene.title}
                  fill
                  className="object-cover opacity-25 mix-blend-luminosity"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div
                  className="absolute bottom-3 left-3 px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase"
                  style={{
                    background: 'rgba(160,120,80,0.12)',
                    color: '#A07850',
                    border: '1px solid rgba(160,120,80,0.2)',
                  }}
                >
                  {locale === 'zh' ? '示意图' : locale === 'ja' ? 'イメージ' : 'Concept'}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg" aria-hidden="true">{scene.icon}</span>
                  <h3 className="text-sm font-medium text-[#EAE0CC]">
                    {scene.title}
                  </h3>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'rgba(234,224,204,0.6)' }}
                >
                  {scene.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
  
      {/* Section 6: 底部 CTA */}
      <section className="px-8 lg:px-[60px] py-16 lg:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="font-serif font-normal text-[#EAE0CC] mb-4"
            style={{ fontSize: 'clamp(22px,3vw,40px)' }}
          >
            {text.ctaBottomTitle}
          </h2>
          <p
            className="text-sm mb-8"
            style={{ color: 'rgba(234,224,204,0.6)' }}
          >
            {text.ctaBottomDescription}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`/${locale}/stay`}
              className="inline-flex items-center px-8 py-3 text-sm tracking-[0.1em] uppercase font-medium transition-colors"
              style={{ background: '#A07850', color: '#19160F' }}
            >
              {text.ctaPrimary}
            </a>
            <a
              href={`/${locale}/booking`}
              className="inline-flex items-center px-8 py-3 text-sm tracking-[0.1em] uppercase transition-colors hover:border-[#A07850] hover:text-[#A07850]"
              style={{
                border: '1px solid rgba(234,224,204,0.25)',
                color: 'rgba(234,224,204,0.7)',
              }}
            >
              {text.ctaSecondary}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
