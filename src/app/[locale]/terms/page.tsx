// src/app/[locale]/terms/page.tsx
// 预订条款页 — React Server Component
// 说明入住/取消/退款/赔偿/免责声明
// Requirements: 14.2, 14.4, 14.5

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
      ? '预订条款'
      : locale === 'ja'
        ? 'ご予約規約'
        : 'Booking Terms & Conditions'

  const description =
    locale === 'zh'
      ? '福岛岳温泉零碳宠物营地预订条款，包含入住规则、取消政策、退款说明和免责声明。'
      : locale === 'ja'
        ? '福島岳温泉ゼロカーボンペットキャンプのご予約規約。チェックイン規則、キャンセルポリシー、返金規定、免責事項を含みます。'
        : 'Booking terms and conditions for Fukushima Dake Onsen Zero-Carbon Pet Camp, including check-in rules, cancellation policy, refund terms, and disclaimers.'

  const hreflangLinks = generateHreflangLinks('/terms')

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
      url: `${BASE_URL}/${locale}/terms`,
    },
  }
}

/** 预订条款内容（三语） */
function getTermsContent(locale: Locale) {
  const content = {
    zh: {
      title: '预订条款',
      lastUpdated: '最后更新：待运营确认',
      placeholder: '※ 以下内容为占位文本，待正式发布前需经法律审核确认。',
      sections: [
        {
          heading: '1. 预约与入住',
          body: `1.1 预约确认
• 所有预约均需经运营方确认后方可生效
• 确认后您将收到包含确认编号的电子邮件
• 预约为咨询性质，不构成即时订单

1.2 入住与退房时间
• 入住时间：15:00 以后
• 退房时间：10:00 以前
• 如需提前入住或延迟退房，请提前联系我们确认可用性

1.3 入住要求
• 办理入住时需出示有效身份证件
• 携宠客人需出示宠物疫苗证明文件
• 未满 18 岁的客人须由成人陪同`,
        },
        {
          heading: '2. 取消政策',
          body: `2.1 取消时限与费用
• 入住日 7 天前取消：免费取消
• 入住日 3-6 天前取消：收取首晚房费的 50%
• 入住日 2 天内取消或未到店：收取首晚全额房费

2.2 取消方式
• 通过预约确认邮件中的链接取消
• 联系客服邮箱或电话取消
• 取消确认将通过邮件发送

2.3 特殊情况
• 因自然灾害或不可抗力无法入住，可免费取消或改期
• 具体政策以运营方最终确认为准`,
        },
        {
          heading: '3. 退款规定',
          body: `3.1 退款处理
• 符合免费取消条件的预约将全额退款
• 退款将原路返回至支付账户
• 退款处理时间为 7-14 个工作日

3.2 不予退款的情况
• 超出取消时限后的取消请求
• 入住后因个人原因提前退房
• 违反入住规则被要求退房

※ MVP 阶段暂无在线支付，上述退款条款将在支付功能上线后正式生效。`,
        },
        {
          heading: '4. 赔偿责任',
          body: `4.1 客人责任
• 客人需对入住期间造成的设施损坏承担赔偿责任
• 宠物造成的损坏由宠物主人全额承担
• 赔偿金额以实际修复/更换费用为准

4.2 营地方责任
• 因设施故障或服务失误导致客人损失的，营地方将提供合理补偿
• 补偿方式包括但不限于：免费升级、延住、退还差价

4.3 贵重物品
• 建议客人妥善保管贵重物品
• 营地方不对客人遗失或损坏的个人物品承担责任`,
        },
        {
          heading: '5. 免责声明',
          body: `5.1 服务变更
• 营地方保留因维护或不可抗力临时调整设施和服务的权利
• 重大变更将提前通知已预约客人

5.2 信息准确性
• 网站信息仅供参考，以实际入住时提供的服务为准
• 图片中标注"示意图"的内容为概念效果图，实际可能存在差异

5.3 第三方服务
• 营地方不对第三方提供的服务（如周边景点、交通等）承担责任
• 相关推荐仅供参考

5.4 健康与安全
• 使用温泉设施需自行评估身体状况
• 有心脑血管疾病、高血压等情况的客人请咨询医生后再使用温泉
• 宠物的健康状况由主人负责评估和管理`,
        },
        {
          heading: '6. 争议解决',
          body: `• 本条款受日本法律管辖
• 如有争议，双方应首先通过友好协商解决
• 协商不成的，由福岛地方法院管辖

如有任何疑问，请联系：
• 邮箱：info@luckyhouse-group.com
• 电话：待公布`,
        },
      ],
    },
    ja: {
      title: 'ご予約規約',
      lastUpdated: '最終更新：運営確認後に公開',
      placeholder: '※ 以下の内容はプレースホルダーテキストです。正式公開前に法的レビューが必要です。',
      sections: [
        {
          heading: '1. ご予約とチェックイン',
          body: `1.1 予約確認
• すべてのご予約は運営側の確認後に有効となります
• 確認後、確認番号を含むメールをお送りいたします
• ご予約はお問い合わせの性質であり、即時注文ではありません

1.2 チェックイン・チェックアウト時間
• チェックイン：15:00以降
• チェックアウト：10:00まで
• アーリーチェックインまたはレイトチェックアウトをご希望の場合は、事前にお問い合わせください

1.3 チェックイン要件
• チェックイン時に有効な身分証明書のご提示が必要です
• ペット連れのお客様はペットのワクチン接種証明書のご提示が必要です
• 18歳未満のお客様は成人の同伴が必要です`,
        },
        {
          heading: '2. キャンセルポリシー',
          body: `2.1 キャンセル期限と料金
• チェックイン日の7日前まで：無料キャンセル
• チェックイン日の3〜6日前：初泊料金の50%を請求
• チェックイン日の2日前以降またはノーショー：初泊料金の全額を請求

2.2 キャンセル方法
• 予約確認メール内のリンクからキャンセル
• カスタマーサービスへメールまたは電話でご連絡
• キャンセル確認はメールでお送りいたします

2.3 特別な状況
• 自然災害や不可抗力により宿泊できない場合、無料キャンセルまたは日程変更が可能です
• 具体的なポリシーは運営側の最終確認によります`,
        },
        {
          heading: '3. 返金規定',
          body: `3.1 返金処理
• 無料キャンセル条件を満たすご予約は全額返金いたします
• 返金はお支払い方法と同じ経路で処理されます
• 返金処理には7〜14営業日かかります

3.2 返金不可の場合
• キャンセル期限を超えたキャンセル
• チェックイン後の個人的な理由による早期チェックアウト
• 利用規則違反によるチェックアウト要請

※ MVP段階ではオンライン決済がないため、上記の返金条項は決済機能開始後に正式に発効します。`,
        },
        {
          heading: '4. 損害賠償責任',
          body: `4.1 お客様の責任
• 滞在中に発生した施設の損傷について、お客様に賠償責任があります
• ペットによる損傷はペットオーナーが全額負担します
• 賠償額は実際の修繕・交換費用に基づきます

4.2 施設側の責任
• 施設の不具合やサービスの不備によりお客様に損害が生じた場合、合理的な補償を提供いたします
• 補償方法：無料アップグレード、延泊、差額返金等

4.3 貴重品
• 貴重品はお客様ご自身で管理されることをお勧めします
• 施設側はお客様の紛失・破損した私物について責任を負いません`,
        },
        {
          heading: '5. 免責事項',
          body: `5.1 サービス変更
• 施設側はメンテナンスや不可抗力により、施設やサービスを一時的に変更する権利を留保します
• 重大な変更については予約済みのお客様に事前に通知いたします

5.2 情報の正確性
• ウェブサイトの情報は参考用であり、実際のご宿泊時に提供されるサービスが優先されます
• 「イメージ図」と表示された画像はコンセプトイメージであり、実際と異なる場合があります

5.3 第三者サービス
• 施設側は第三者が提供するサービス（周辺観光地、交通機関等）について責任を負いません
• 関連するおすすめ情報は参考としてご利用ください

5.4 健康と安全
• 温泉施設のご利用はお客様ご自身で体調をご判断ください
• 心臓病、高血圧等の症状がある方は、医師にご相談の上ご利用ください
• ペットの健康状態の評価と管理はオーナーの責任です`,
        },
        {
          heading: '6. 紛争解決',
          body: `• 本規約は日本法に準拠します
• 紛争が生じた場合、まず友好的な協議により解決を図ります
• 協議で解決しない場合、福島地方裁判所を管轄裁判所とします

ご質問がございましたら、以下までお問い合わせください：
• メール：info@luckyhouse-group.com
• 電話：後日公開`,
        },
      ],
    },
    en: {
      title: 'Booking Terms & Conditions',
      lastUpdated: 'Last updated: To be confirmed by operations',
      placeholder: '※ The following content is placeholder text and requires legal review before official publication.',
      sections: [
        {
          heading: '1. Booking and Check-in',
          body: `1.1 Booking Confirmation
• All bookings are subject to confirmation by the operations team
• Upon confirmation, you will receive an email with your confirmation number
• Bookings are inquiry-based and do not constitute immediate orders

1.2 Check-in and Check-out Times
• Check-in: from 15:00
• Check-out: by 10:00
• For early check-in or late check-out, please contact us in advance to confirm availability

1.3 Check-in Requirements
• Valid identification must be presented at check-in
• Pet guests must present pet vaccination certificates
• Guests under 18 must be accompanied by an adult`,
        },
        {
          heading: '2. Cancellation Policy',
          body: `2.1 Cancellation Deadlines and Fees
• 7 or more days before check-in: free cancellation
• 3-6 days before check-in: 50% of first night's rate
• Within 2 days of check-in or no-show: full first night's rate

2.2 How to Cancel
• Cancel via the link in your booking confirmation email
• Contact customer service by email or phone
• Cancellation confirmation will be sent via email

2.3 Special Circumstances
• In cases of natural disaster or force majeure, free cancellation or rescheduling is available
• Specific policies are subject to final confirmation by the operations team`,
        },
        {
          heading: '3. Refund Policy',
          body: `3.1 Refund Processing
• Bookings eligible for free cancellation will receive a full refund
• Refunds will be returned via the original payment method
• Refund processing takes 7-14 business days

3.2 Non-refundable Cases
• Cancellations made after the cancellation deadline
• Early check-out after check-in due to personal reasons
• Check-out requested due to violation of accommodation rules

※ During the MVP phase, online payment is not available. The above refund terms will take effect once payment features are launched.`,
        },
        {
          heading: '4. Liability and Compensation',
          body: `4.1 Guest Liability
• Guests are responsible for any damage to facilities during their stay
• Damage caused by pets is the full responsibility of the pet owner
• Compensation amounts are based on actual repair/replacement costs

4.2 Camp Liability
• In cases of facility malfunction or service errors causing guest losses, reasonable compensation will be provided
• Compensation methods include but are not limited to: complimentary upgrades, extended stay, price difference refunds

4.3 Valuables
• Guests are advised to safeguard their valuable belongings
• The camp is not responsible for guests' lost or damaged personal items`,
        },
        {
          heading: '5. Disclaimers',
          body: `5.1 Service Changes
• The camp reserves the right to temporarily adjust facilities and services due to maintenance or force majeure
• Significant changes will be communicated to booked guests in advance

5.2 Information Accuracy
• Website information is for reference only; actual services provided during your stay take precedence
• Images marked as "concept rendering" are for illustrative purposes and may differ from reality

5.3 Third-Party Services
• The camp is not responsible for services provided by third parties (such as nearby attractions, transportation, etc.)
• Related recommendations are for reference only

5.4 Health and Safety
• Use of onsen facilities requires self-assessment of your physical condition
• Guests with cardiovascular conditions, high blood pressure, etc., should consult a doctor before using the onsen
• Pet owners are responsible for assessing and managing their pet's health`,
        },
        {
          heading: '6. Dispute Resolution',
          body: `• These terms are governed by Japanese law
• In case of disputes, both parties shall first attempt amicable resolution through negotiation
• If negotiation fails, the Fukushima District Court shall have jurisdiction

For any questions, please contact:
• Email: info@luckyhouse-group.com
• Phone: To be announced`,
        },
      ],
    },
  }

  return content[locale]
}

/** 预订条款页 */
export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const content = getTermsContent(locale as Locale)

  return (
    <div className="bg-[#19160F] text-[#EAE0CC] min-h-screen">
      {/* Editorial 页头 */}
      <header
        className="px-8 lg:px-[60px] pt-[60px] lg:pt-[80px] pb-[40px] lg:pb-[60px]"
        style={{ borderBottom: '1px solid rgba(234,224,204,0.08)' }}
      >
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#A07850] mb-4">
          {locale === 'zh' ? 'Legal · 预订条款' : locale === 'ja' ? 'ご予約規約' : 'Terms & Conditions'}
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
