// src/app/[locale]/privacy/page.tsx
// 隐私政策页 — React Server Component
// 说明数据收集目的、存储周期、第三方服务、用户删除/修改请求方式
// Requirements: 14.1, 14.4, 14.5

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, BCP47_MAP, BASE_URL } from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/config'
import { generateHreflangLinks } from '@/lib/i18n/hreflang'

/** 页面 SEO 元数据 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  const title =
    locale === 'zh'
      ? '隐私政策'
      : locale === 'ja'
        ? 'プライバシーポリシー'
        : 'Privacy Policy'

  const description =
    locale === 'zh'
      ? '了解福岛岳温泉零碳宠物营地如何收集、使用和保护您的个人信息。'
      : locale === 'ja'
        ? '福島岳温泉ゼロカーボンペットキャンプがどのようにお客様の個人情報を収集・利用・保護しているかをご確認ください。'
        : 'Learn how Fukushima Dake Onsen Zero-Carbon Pet Camp collects, uses, and protects your personal information.'

  const hreflangLinks = generateHreflangLinks('/privacy')

  return {
    title,
    description,
    alternates: {
      languages: Object.fromEntries(
        hreflangLinks.map((link) => [link.locale, link.href])
      ),
    },
    openGraph: {
      title,
      description,
      locale: BCP47_MAP[locale as Locale],
      type: 'website',
      url: `${BASE_URL}/${locale}/privacy`,
    },
  }
}

/** 隐私政策内容（三语） */
function getPrivacyContent(locale: Locale) {
  const content = {
    zh: {
      title: '隐私政策',
      lastUpdated: '最后更新：待运营确认',
      placeholder: '※ 以下内容为占位文本，待运营确认后正式发布。',
      sections: [
        {
          heading: '1. 信息收集目的',
          body: `我们收集您的个人信息用于以下目的：
• 处理您的预约咨询和住宿申请
• 发送预约确认和服务通知
• 根据您的偏好提供个性化服务（如宠物相关安排）
• 改进我们的服务质量和网站体验
• 发送您订阅的营销内容（仅在您明确同意后）
• 遵守法律法规要求`,
        },
        {
          heading: '2. 收集的信息类型',
          body: `我们可能收集以下信息：
• 个人身份信息：姓名、邮箱地址、电话号码、国家/地区
• 预约信息：入住/退房日期、人数、房型偏好
• 宠物信息：宠物类型、品种、体重、疫苗状态（仅携宠客人）
• 技术信息：浏览器类型、设备信息、IP 地址、Cookie 数据
• 来源信息：访问来源 URL、UTM 参数`,
        },
        {
          heading: '3. 数据存储与保护',
          body: `• 存储周期：个人数据在您的预约完成后保留 3 年，之后将被安全删除或匿名化处理
• 存储位置：数据存储在位于日本的安全服务器上
• 安全措施：我们采用 SSL/TLS 加密、访问权限控制和定期安全审计来保护您的数据
• 员工培训：所有接触客户数据的员工均接受数据保护培训`,
        },
        {
          heading: '4. 第三方服务',
          body: `我们可能与以下第三方服务商共享必要数据：
• Google Analytics：用于网站访问统计分析（匿名数据）
• 邮件服务提供商：用于发送确认邮件和通知
• Google Maps：用于展示地图位置（不传输个人数据）
• 支付服务商：未来开通在线支付时使用（目前不适用）

我们不会将您的个人信息出售给任何第三方。`,
        },
        {
          heading: '5. Cookie 使用',
          body: `本网站使用以下类型的 Cookie：
• 必要 Cookie：用于语言偏好存储和网站基本功能
• 分析 Cookie：用于了解用户如何使用网站（需您同意）
• 功能 Cookie：用于记住您的偏好设置

您可以通过浏览器设置管理或删除 Cookie。`,
        },
        {
          heading: '6. 您的权利',
          body: `根据适用的数据保护法规，您享有以下权利：
• 访问权：查阅我们持有的您的个人数据
• 更正权：更正不准确或不完整的个人数据
• 删除权：请求删除您的个人数据
• 限制处理权：在特定情况下限制数据处理
• 数据可携带权：以机器可读格式获取您的数据
• 撤回同意权：随时撤回之前给予的同意

如需行使以上权利，请通过以下方式联系我们。`,
        },
        {
          heading: '7. 联系方式',
          body: `如您对本隐私政策有任何疑问或希望行使您的数据权利，请联系：
• 邮箱：privacy@luckyhouse.jp
• 电话：待公布
• 地址：福岛县二本松市岳温泉（具体地址待公布）

我们将在收到请求后 30 日内回复。`,
        },
      ],
    },
    ja: {
      title: 'プライバシーポリシー',
      lastUpdated: '最終更新：運営確認後に公開',
      placeholder: '※ 以下の内容はプレースホルダーテキストです。運営確認後に正式に公開されます。',
      sections: [
        {
          heading: '1. 情報収集の目的',
          body: `当施設では以下の目的でお客様の個人情報を収集いたします：
• ご予約のお問い合わせおよび宿泊申請の処理
• 予約確認およびサービス通知の送信
• お客様のご希望に応じたパーソナライズサービスの提供（ペット関連の手配など）
• サービス品質およびウェブサイト体験の改善
• ご同意いただいたマーケティングコンテンツの配信
• 法令遵守`,
        },
        {
          heading: '2. 収集する情報の種類',
          body: `以下の情報を収集する場合があります：
• 個人識別情報：氏名、メールアドレス、電話番号、国・地域
• 予約情報：チェックイン/チェックアウト日、人数、お部屋タイプのご希望
• ペット情報：ペットの種類、犬種/猫種、体重、ワクチン接種状況（ペット連れのお客様のみ）
• 技術情報：ブラウザの種類、デバイス情報、IPアドレス、Cookieデータ
• アクセス元情報：参照URL、UTMパラメータ`,
        },
        {
          heading: '3. データの保管と保護',
          body: `• 保管期間：個人データはご予約完了後3年間保管し、その後安全に削除または匿名化処理いたします
• 保管場所：日本国内の安全なサーバーにデータを保管しています
• セキュリティ対策：SSL/TLS暗号化、アクセス権限管理、定期的なセキュリティ監査を実施しています
• 従業員教育：顧客データにアクセスする全従業員がデータ保護研修を受けています`,
        },
        {
          heading: '4. 第三者サービス',
          body: `以下の第三者サービスプロバイダーと必要なデータを共有する場合があります：
• Google Analytics：ウェブサイトのアクセス統計分析（匿名データ）
• メールサービスプロバイダー：確認メールおよび通知の送信
• Google Maps：地図上の位置表示（個人データは送信されません）
• 決済サービスプロバイダー：将来オンライン決済を開始する際に使用（現在は該当なし）

お客様の個人情報を第三者に販売することは一切ございません。`,
        },
        {
          heading: '5. Cookieの使用',
          body: `本ウェブサイトでは以下の種類のCookieを使用しています：
• 必須Cookie：言語設定の保存およびウェブサイトの基本機能
• 分析Cookie：ウェブサイトの利用状況の把握（お客様の同意が必要）
• 機能Cookie：お客様の設定の記憶

ブラウザの設定からCookieの管理・削除が可能です。`,
        },
        {
          heading: '6. お客様の権利',
          body: `適用されるデータ保護法に基づき、お客様には以下の権利があります：
• アクセス権：当施設が保有するお客様の個人データの閲覧
• 訂正権：不正確または不完全な個人データの訂正
• 削除権：個人データの削除の要求
• 処理制限権：特定の状況における処理の制限
• データポータビリティ権：機械可読形式でのデータ取得
• 同意撤回権：以前に与えた同意の撤回

上記の権利を行使される場合は、以下の連絡先までお問い合わせください。`,
        },
        {
          heading: '7. お問い合わせ先',
          body: `本プライバシーポリシーに関するご質問やデータに関する権利の行使については、以下までご連絡ください：
• メール：privacy@luckyhouse.jp
• 電話：後日公開
• 住所：福島県二本松市岳温泉（詳細住所は後日公開）

ご要求受領後30日以内にご回答いたします。`,
        },
      ],
    },
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: To be confirmed by operations',
      placeholder: '※ The following content is placeholder text and will be officially published after operations confirmation.',
      sections: [
        {
          heading: '1. Purpose of Information Collection',
          body: `We collect your personal information for the following purposes:
• Processing your booking inquiries and accommodation applications
• Sending booking confirmations and service notifications
• Providing personalized services based on your preferences (such as pet-related arrangements)
• Improving our service quality and website experience
• Sending marketing content you have subscribed to (only with your explicit consent)
• Complying with legal and regulatory requirements`,
        },
        {
          heading: '2. Types of Information Collected',
          body: `We may collect the following information:
• Personal identification: name, email address, phone number, country/region
• Booking information: check-in/check-out dates, number of guests, room type preferences
• Pet information: pet type, breed, weight, vaccination status (pet guests only)
• Technical information: browser type, device information, IP address, cookie data
• Source information: referral URL, UTM parameters`,
        },
        {
          heading: '3. Data Storage and Protection',
          body: `• Retention period: Personal data is retained for 3 years after your booking is completed, then securely deleted or anonymized
• Storage location: Data is stored on secure servers located in Japan
• Security measures: We employ SSL/TLS encryption, access control, and regular security audits to protect your data
• Staff training: All employees with access to customer data receive data protection training`,
        },
        {
          heading: '4. Third-Party Services',
          body: `We may share necessary data with the following third-party service providers:
• Google Analytics: for website traffic analysis (anonymous data)
• Email service provider: for sending confirmation emails and notifications
• Google Maps: for displaying map locations (no personal data transmitted)
• Payment service provider: for future online payment integration (not currently applicable)

We will never sell your personal information to any third party.`,
        },
        {
          heading: '5. Cookie Usage',
          body: `This website uses the following types of cookies:
• Essential cookies: for language preference storage and basic website functionality
• Analytics cookies: for understanding how users interact with the website (requires your consent)
• Functional cookies: for remembering your preference settings

You can manage or delete cookies through your browser settings.`,
        },
        {
          heading: '6. Your Rights',
          body: `Under applicable data protection regulations, you have the following rights:
• Right of access: view the personal data we hold about you
• Right to rectification: correct inaccurate or incomplete personal data
• Right to erasure: request deletion of your personal data
• Right to restrict processing: limit data processing in certain circumstances
• Right to data portability: obtain your data in a machine-readable format
• Right to withdraw consent: withdraw previously given consent at any time

To exercise any of these rights, please contact us using the information below.`,
        },
        {
          heading: '7. Contact Information',
          body: `If you have any questions about this privacy policy or wish to exercise your data rights, please contact:
• Email: privacy@luckyhouse.jp
• Phone: To be announced
• Address: Dake Onsen, Nihonmatsu City, Fukushima Prefecture (detailed address to be announced)

We will respond within 30 days of receiving your request.`,
        },
      ],
    },
  }

  return content[locale]
}

/** 隐私政策页 */
export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const content = getPrivacyContent(locale as Locale)

  return (
    <div className="bg-[#19160F] text-[#EAE0CC] min-h-screen">
      {/* Editorial 页头 */}
      <header
        className="px-8 lg:px-[60px] pt-[60px] lg:pt-[80px] pb-[40px] lg:pb-[60px]"
        style={{ borderBottom: '1px solid rgba(234,224,204,0.08)' }}
      >
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#A07850] mb-4">
          {locale === 'zh' ? 'Legal · 隐私政策' : locale === 'ja' ? 'プライバシー' : 'Privacy Policy'}
        </p>
        <h1
          className="font-serif font-normal leading-[1.1] text-[#EAE0CC] mb-3"
          style={{ fontSize: 'clamp(28px,4vw,52px)' }}
        >
          {content.title}
        </h1>
        <p className="text-[11px] tracking-[0.1em]" style={{ color: 'rgba(234,224,204,0.35)' }}>
          {content.lastUpdated}
        </p>
        <div
          className="mt-5 px-4 py-3 text-sm"
          style={{
            background: 'rgba(160,120,80,0.08)',
            border: '1px solid rgba(160,120,80,0.2)',
            color: '#A07850',
          }}
        >
          {content.placeholder}
        </div>
      </header>

      {/* 正文 */}
      <div className="px-8 lg:px-[60px] py-12 lg:py-16 max-w-4xl">
        <div className="space-y-10">
          {content.sections.map((section, index) => (
            <section
              key={index}
              className="pb-10"
              style={{ borderBottom: '1px solid rgba(234,224,204,0.06)' }}
            >
              <h2
                className="font-serif font-normal text-[#EAE0CC] mb-4"
                style={{ fontSize: 'clamp(16px,2vw,22px)' }}
              >
                {section.heading}
              </h2>
              <div
                className="text-sm leading-[1.9] whitespace-pre-line"
                style={{ color: 'rgba(234,224,204,0.65)' }}
              >
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
