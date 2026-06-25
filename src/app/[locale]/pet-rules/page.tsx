// src/app/[locale]/pet-rules/page.tsx
// 宠物入住规则页 — React Server Component
// 独立页面/章节说明宠物入住的完整规则
// Requirements: 14.3, 14.4, 14.5

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
      ? '宠物入住规则'
      : locale === 'ja'
        ? 'ペット宿泊規則'
        : 'Pet Accommodation Rules'

  const description =
    locale === 'zh'
      ? '福岛岳温泉零碳宠物营地宠物入住规则，包含宠物数量、体型限制、疫苗要求、公共区域规范等完整说明。'
      : locale === 'ja'
        ? '福島岳温泉ゼロカーボンペットキャンプのペット宿泊規則。ペットの頭数、サイズ制限、ワクチン要件、共用エリアのルールなどの詳細をご確認ください。'
        : 'Pet accommodation rules for Fukushima Dake Onsen Zero-Carbon Pet Camp, including pet limits, size restrictions, vaccination requirements, and common area guidelines.'

  const hreflangLinks = generateHreflangLinks('/pet-rules')

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
      url: `${BASE_URL}/${locale}/pet-rules`,
    },
  }
}

/** 宠物入住规则内容（三语） */
function getPetRulesContent(locale: Locale) {
  const content = {
    zh: {
      title: '宠物入住规则',
      lastUpdated: '最后更新：待运营确认',
      placeholder: '※ 以下内容为占位文本，待正式发布前需经运营确认。部分规则标注"待公布"表示细节尚在确定中。',
      sections: [
        {
          heading: '1. 可入住宠物类型与数量',
          body: `1.1 可接受的宠物类型
• 犬类（所有品种）
• 猫类（所有品种）
• 其他小型宠物：请提前咨询确认

1.2 数量限制
• 每间客房最多可携带 3 只宠物
• 超过 3 只需提前联系确认特殊安排

1.3 体型限制
• 单只宠物体重上限：80kg
• 超大型犬请提前咨询，需确认房间空间适配性`,
        },
        {
          heading: '2. 健康与疫苗要求',
          body: `2.1 必备证明文件
• 狂犬病疫苗接种证明（1年内有效）
• 综合疫苗接种证明（犬：DHPPi / 猫：FVRCP）
• 入住时需出示原件或清晰复印件

2.2 健康状况
• 宠物须健康无传染性疾病
• 如宠物近期有身体不适，请提前告知
• 营地保留拒绝明显不适宠物入住的权利

2.3 驱虫要求
• 建议入住前一周内完成体内外驱虫
• 详细要求待公布`,
        },
        {
          heading: '3. 公共区域规范',
          body: `3.1 牵引要求
• 在所有公共区域（大堂、走廊、餐厅等），宠物必须使用牵引绳
• 牵引绳长度不超过 2 米
• Dog Run 区域内可解开牵引绳自由活动

3.2 禁入区域
• 人类专用温泉区域
• 厨房及食品准备区
• 其他客人的私人区域
• 具体禁入区域以现场标识为准

3.3 电梯使用
• 携宠使用电梯时请抱起小型宠物或缩短牵引绳
• 如电梯内有其他客人，请征得同意后再进入`,
        },
        {
          heading: '4. 噪音与行为管理',
          body: `4.1 噪音控制
• 夜间安静时段（22:00 - 7:00）请确保宠物保持安静
• 如宠物持续吠叫影响其他客人，工作人员可能上门沟通
• 多次提醒无效可能需要采取进一步措施

4.2 行为规范
• 宠物不得攻击或威胁其他客人及宠物
• 主人需全程负责管理宠物行为
• 如发生攻击事件，营地保留要求退房的权利

4.3 看护责任
• 宠物不得单独留在客房内超过 1 小时（待公布具体时限）
• 需要暂时离开时，可使用宠物寄养服务
• 主人外出时请确保宠物安全和舒适`,
        },
        {
          heading: '5. 清洁与卫生',
          body: `5.1 排泄物处理
• 主人须自行清理宠物在客房和公共区域的排泄物
• 客房内请使用提供的宠物垫/尿片
• 户外排泄物请使用便便袋并投入指定垃圾桶

5.2 客房清洁
• 退房时请保持客房基本整洁
• 宠物毛发造成的额外清洁将收取清洁费（金额待公布）
• 严重污损可能产生额外赔偿费用

5.3 宠物清洁设施
• 营地提供宠物清洁区域（洗脚/洗澡）
• 外出归来请先清洁宠物足部后再进入室内
• 宠物温泉和梳理服务需提前预约`,
        },
        {
          heading: '6. 赔偿规定',
          body: `6.1 损坏赔偿
• 宠物造成的家具、地板、墙壁等损坏，由主人全额承担修复费用
• 赔偿金额以实际修复/更换成本为准
• 入住时会进行房间状态确认，退房时进行对照检查

6.2 伤害赔偿
• 宠物造成其他客人或工作人员受伤的，主人须承担全部医疗费用及相关责任
• 建议购买宠物责任保险

6.3 押金（待公布）
• 携宠入住可能需缴纳额外押金
• 押金金额和退还条件待公布`,
        },
        {
          heading: '7. 宠物设施使用规则',
          body: `7.1 宠物温泉
• 使用前需确认宠物皮肤健康状态
• 有皮肤病的宠物不可使用温泉
• 使用时间需提前预约
• 主人须全程陪同

7.2 Dog Run（室内/室外）
• 使用前请确认宠物已完成疫苗接种
• 攻击性宠物不得进入公共 Dog Run
• 主人须在场监护
• 请自行清理宠物排泄物

7.3 宠物寄养
• 需提前至少 24 小时预约
• 寄养时间和费用待公布
• 需提供宠物饮食习惯和特殊需求说明`,
        },
        {
          heading: '8. 紧急情况处理',
          body: `8.1 宠物生病或受伤
• 营地可协助联系最近的宠物医院
• 紧急情况请立即联系前台
• 医疗费用由主人承担

8.2 宠物走失
• 请立即通知前台和工作人员
• 建议宠物佩戴含联系方式的名牌
• 营地将协助搜寻但不承担相关责任

如有任何疑问，请联系：
• 邮箱：pet@luckyhouse-group.com
• 电话：待公布`,
        },
      ],
    },
    ja: {
      title: 'ペット宿泊規則',
      lastUpdated: '最終更新：運営確認後に公開',
      placeholder: '※ 以下の内容はプレースホルダーテキストです。正式公開前に運営確認が必要です。一部の規則で「後日公開」と記載されている項目は詳細を確定中です。',
      sections: [
        {
          heading: '1. 受入可能なペットの種類と頭数',
          body: `1.1 受入可能なペット
• 犬（全犬種）
• 猫（全猫種）
• その他の小動物：事前にお問い合わせください

1.2 頭数制限
• 1部屋あたり最大3頭まで
• 3頭を超える場合は事前にお問い合わせください

1.3 サイズ制限
• 1頭あたりの体重上限：80kg
• 超大型犬は事前にお問い合わせください（お部屋のスペース適合性の確認が必要です）`,
        },
        {
          heading: '2. 健康とワクチン要件',
          body: `2.1 必要な証明書類
• 狂犬病ワクチン接種証明書（1年以内有効）
• 混合ワクチン接種証明書（犬：DHPPi / 猫：FVRCP）
• チェックイン時に原本または鮮明なコピーのご提示が必要です

2.2 健康状態
• ペットは健康で感染症のない状態でなければなりません
• ペットに最近体調不良がある場合は事前にお知らせください
• 施設側は明らかに体調不良のペットの受入を拒否する権利を留保します

2.3 駆虫要件
• チェックイン前1週間以内の内外駆虫を推奨します
• 詳細要件は後日公開`,
        },
        {
          heading: '3. 共用エリアのルール',
          body: `3.1 リード着用
• すべての共用エリア（ロビー、廊下、レストラン等）ではリードを着用してください
• リードの長さは2メートル以内
• ドッグランエリア内ではリードを外して自由に活動できます

3.2 立入禁止エリア
• 人間専用温泉エリア
• キッチンおよび食品調理エリア
• 他のお客様のプライベートエリア
• 具体的な立入禁止エリアは現地の表示に従ってください

3.3 エレベーターの利用
• ペット連れでエレベーターをご利用の際は、小型ペットは抱っこするかリードを短くしてください
• エレベーター内に他のお客様がいる場合は、同意を得てからお入りください`,
        },
        {
          heading: '4. 騒音と行動管理',
          body: `4.1 騒音管理
• 夜間の静粛時間帯（22:00〜7:00）はペットを静かに保つようお願いいたします
• ペットの持続的な吠え声が他のお客様に影響する場合、スタッフがご連絡することがあります
• 度重なる注意にもかかわらず改善されない場合、さらなる対応が必要になることがあります

4.2 行動規範
• ペットは他のお客様やペットを攻撃・威嚇してはなりません
• オーナーは常にペットの行動に責任を持つ必要があります
• 攻撃事件が発生した場合、施設側はチェックアウトを要求する権利を留保します

4.3 監護責任
• ペットを客室に1時間以上放置しないでください（具体的な時間制限は後日公開）
• 一時的に離れる必要がある場合は、ペット預かりサービスをご利用ください
• 外出時はペットの安全と快適さを確保してください`,
        },
        {
          heading: '5. 清潔と衛生',
          body: `5.1 排泄物の処理
• オーナーは客室および共用エリアでのペットの排泄物を自ら清掃してください
• 客室内では提供されるペットシートをご使用ください
• 屋外の排泄物はマナー袋を使用し、指定のゴミ箱に廃棄してください

5.2 客室の清掃
• チェックアウト時は客室を基本的に清潔な状態に保ってください
• ペットの毛による追加清掃には清掃料金が発生します（金額は後日公開）
• 重度の汚損には追加の賠償費用が発生する場合があります

5.3 ペット清掃施設
• 施設にはペット清掃エリア（足洗い/シャワー）があります
• 外出から戻ったら、室内に入る前にペットの足を清掃してください
• ペット温泉とグルーミングサービスは事前予約が必要です`,
        },
        {
          heading: '6. 損害賠償規定',
          body: `6.1 損傷賠償
• ペットによる家具、床、壁等の損傷は、オーナーが修復費用を全額負担します
• 賠償額は実際の修繕・交換費用に基づきます
• チェックイン時に部屋の状態確認を行い、チェックアウト時に照合確認を行います

6.2 傷害賠償
• ペットが他のお客様やスタッフを負傷させた場合、オーナーが全医療費および関連責任を負います
• ペット賠償責任保険への加入を推奨します

6.3 保証金（後日公開）
• ペット連れのご宿泊には追加の保証金が必要な場合があります
• 保証金の金額と返金条件は後日公開します`,
        },
        {
          heading: '7. ペット施設利用規則',
          body: `7.1 ペット温泉
• ご利用前にペットの皮膚の健康状態をご確認ください
• 皮膚疾患のあるペットは温泉をご利用いただけません
• ご利用時間は事前予約が必要です
• オーナーが常に付き添ってください

7.2 ドッグラン（室内/室外）
• ご利用前にペットのワクチン接種が完了していることをご確認ください
• 攻撃的なペットは共用ドッグランに入れないでください
• オーナーが必ず監督してください
• ペットの排泄物はご自身で清掃してください

7.3 ペット預かり
• 少なくとも24時間前の予約が必要です
• 預かり時間と料金は後日公開
• ペットの食事の好みや特別なニーズの説明をご提供ください`,
        },
        {
          heading: '8. 緊急時の対応',
          body: `8.1 ペットの病気やケガ
• 施設は最寄りのペット病院への連絡をお手伝いします
• 緊急時は直ちにフロントにご連絡ください
• 医療費はオーナーのご負担となります

8.2 ペットの迷子
• 直ちにフロントとスタッフにお知らせください
• ペットに連絡先入りの迷子札を付けることを推奨します
• 施設は捜索に協力しますが、関連する責任は負いません

ご質問がございましたら、以下までお問い合わせください：
• メール：pet@luckyhouse-group.com
• 電話：後日公開`,
        },
      ],
    },
    en: {
      title: 'Pet Accommodation Rules',
      lastUpdated: 'Last updated: To be confirmed by operations',
      placeholder: '※ The following content is placeholder text and requires operations confirmation before official publication. Items marked "TBA" indicate details still being finalized.',
      sections: [
        {
          heading: '1. Accepted Pet Types and Limits',
          body: `1.1 Accepted Pets
• Dogs (all breeds)
• Cats (all breeds)
• Other small pets: please inquire in advance

1.2 Number Limits
• Maximum 3 pets per room
• For more than 3 pets, please contact us in advance for special arrangements

1.3 Size Limits
• Maximum weight per pet: 80kg
• For extra-large dogs, please inquire in advance to confirm room space suitability`,
        },
        {
          heading: '2. Health and Vaccination Requirements',
          body: `2.1 Required Documentation
• Rabies vaccination certificate (valid within 1 year)
• Combined vaccination certificate (dogs: DHPPi / cats: FVRCP)
• Original or clear copy must be presented at check-in

2.2 Health Condition
• Pets must be healthy and free of contagious diseases
• If your pet has recently been unwell, please inform us in advance
• The camp reserves the right to refuse check-in for visibly unwell pets

2.3 Parasite Prevention
• Deworming within one week before check-in is recommended
• Detailed requirements TBA`,
        },
        {
          heading: '3. Common Area Rules',
          body: `3.1 Leash Requirements
• Pets must be on a leash in all common areas (lobby, corridors, restaurant, etc.)
• Leash length must not exceed 2 meters
• Pets may be unleashed in designated Dog Run areas

3.2 Restricted Areas
• Human-only onsen areas
• Kitchen and food preparation areas
• Other guests' private areas
• Specific restricted areas are indicated by on-site signage

3.3 Elevator Use
• When using elevators with pets, carry small pets or shorten the leash
• If other guests are in the elevator, please ask for their permission before entering`,
        },
        {
          heading: '4. Noise and Behavior Management',
          body: `4.1 Noise Control
• During quiet hours (22:00 - 7:00), please ensure your pet remains quiet
• If continuous barking affects other guests, staff may reach out to you
• Repeated disturbances without improvement may require further action

4.2 Behavioral Standards
• Pets must not attack or threaten other guests or pets
• Owners must be responsible for managing their pet's behavior at all times
• In case of an attack incident, the camp reserves the right to request check-out

4.3 Supervision Responsibility
• Pets should not be left alone in the room for more than 1 hour (specific time limit TBA)
• If you need to leave temporarily, please use the pet sitting service
• When going out, ensure your pet's safety and comfort`,
        },
        {
          heading: '5. Cleanliness and Hygiene',
          body: `5.1 Waste Disposal
• Owners must clean up pet waste in rooms and common areas
• Please use the provided pet pads in the room
• Use waste bags for outdoor waste and dispose in designated bins

5.2 Room Cleanliness
• Please maintain basic cleanliness in the room at check-out
• Extra cleaning due to pet hair will incur a cleaning fee (amount TBA)
• Severe damage may result in additional compensation charges

5.3 Pet Cleaning Facilities
• The camp provides pet cleaning areas (paw washing/bathing)
• Please clean your pet's paws before entering indoor areas after outings
• Pet onsen and grooming services require advance booking`,
        },
        {
          heading: '6. Compensation Policy',
          body: `6.1 Damage Compensation
• Owners bear full responsibility for furniture, floor, wall, or other damage caused by pets
• Compensation amounts are based on actual repair/replacement costs
• Room condition will be documented at check-in and compared at check-out

6.2 Injury Compensation
• If a pet injures another guest or staff member, the owner bears full medical costs and related liability
• Pet liability insurance is recommended

6.3 Security Deposit (TBA)
• Pet stays may require an additional security deposit
• Deposit amount and return conditions TBA`,
        },
        {
          heading: '7. Pet Facility Usage Rules',
          body: `7.1 Pet Onsen
• Confirm your pet's skin health before use
• Pets with skin conditions cannot use the onsen
• Usage times require advance booking
• Owners must accompany pets at all times

7.2 Dog Run (Indoor/Outdoor)
• Confirm your pet's vaccinations are complete before use
• Aggressive pets are not permitted in shared Dog Run areas
• Owners must be present to supervise
• Clean up pet waste yourself

7.3 Pet Sitting
• Requires at least 24 hours advance booking
• Sitting hours and fees TBA
• Please provide information about your pet's dietary habits and special needs`,
        },
        {
          heading: '8. Emergency Procedures',
          body: `8.1 Pet Illness or Injury
• The camp can assist in contacting the nearest veterinary hospital
• In emergencies, please contact the front desk immediately
• Medical expenses are the owner's responsibility

8.2 Lost Pet
• Please notify the front desk and staff immediately
• We recommend pets wear ID tags with contact information
• The camp will assist in searching but does not bear related liability

For any questions, please contact:
• Email: pet@luckyhouse-group.com
• Phone: To be announced`,
        },
      ],
    },
  }

  return content[locale]
}

/** 宠物入住规则页 */
export default async function PetRulesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const content = getPetRulesContent(locale as Locale)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          {content.title}
        </h1>
        <p className="mt-2 text-sm text-stone-400">{content.lastUpdated}</p>
        <p className="mt-4 rounded-md bg-amber-900/20 border border-amber-700/30 px-4 py-3 text-sm text-amber-400">
          {content.placeholder}
        </p>
      </header>

      <div className="space-y-8">
        {content.sections.map((section, index) => (
          <section key={index}>
            <h2 className="text-xl font-semibold text-white mb-3">
              {section.heading}
            </h2>
            <div className="text-stone-400 leading-relaxed whitespace-pre-line">
              {section.body}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
