// src/lib/email/templates/ActivityConfirmation.tsx
// 活动确认邮件 — 活动名/登记类型/编号/三语文案

import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Hr,
} from '@react-email/components'
import type { Locale } from '@/types'

interface Props {
  registrationId: string
  activityName: string
  type: 'interest' | 'register'
  name: string
  locale: Locale
}

const i18n = {
  zh: {
    title: '活动登记确认',
    greeting: (name: string) => `尊敬的 ${name}，`,
    interestBody: '您的兴趣登记已成功提交。活动正式确认后，我们会第一时间通知您。',
    registerBody: '您的报名已成功提交。我们会通过邮件发送确认信息。',
    regIdLabel: '登记编号',
    activityLabel: '活动名称',
    typeLabel: '登记类型',
    interestType: '兴趣登记',
    registerType: '正式报名',
    footer: '如有疑问，请随时联系我们。',
  },
  ja: {
    title: 'アクティビティ登録確認',
    greeting: (name: string) => `${name} 様、`,
    interestBody: '興味登録が完了しました。アクティビティが正式に確認され次第、お知らせいたします。',
    registerBody: 'お申し込みが完了しました。確認情報をメールでお送りします。',
    regIdLabel: '登録番号',
    activityLabel: 'アクティビティ名',
    typeLabel: '登録タイプ',
    interestType: '興味登録',
    registerType: '正式申込',
    footer: 'ご不明な点がございましたら、お気軽にお問い合わせください。',
  },
  en: {
    title: 'Activity Registration Confirmed',
    greeting: (name: string) => `Dear ${name},`,
    interestBody: 'Your interest registration has been submitted. We will notify you once the activity is officially confirmed.',
    registerBody: 'Your registration has been submitted. We will send confirmation details via email.',
    regIdLabel: 'Registration ID',
    activityLabel: 'Activity',
    typeLabel: 'Registration Type',
    interestType: 'Interest',
    registerType: 'Registration',
    footer: 'If you have any questions, please feel free to contact us.',
  },
} as const

export default function ActivityConfirmationEmail(props: Props) {
  const t = i18n[props.locale]
  const isInterest = props.type === 'interest'

  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>{t.title}</Heading>
          <Text style={greetingStyle}>{t.greeting(props.name)}</Text>
          <Text style={bodyTextStyle}>
            {isInterest ? t.interestBody : t.registerBody}
          </Text>

          <Hr style={hrStyle} />

          <DetailRow label={t.regIdLabel} value={props.registrationId} />
          <DetailRow label={t.activityLabel} value={props.activityName} />
          <DetailRow
            label={t.typeLabel}
            value={isInterest ? t.interestType : t.registerType}
          />

          <Hr style={hrStyle} />

          <Text style={footerStyle}>{t.footer}</Text>
          <Text style={brandStyle}>Luckyhouse 福岛岳温泉</Text>
        </Container>
      </Body>
    </Html>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Text style={detailStyle}>
      <span style={labelStyle}>{label}:</span>{' '}
      <strong>{value}</strong>
    </Text>
  )
}

const bodyStyle = { backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }
const containerStyle = { margin: '0 auto', padding: '40px 20px', maxWidth: '600px' }
const headingStyle = { fontSize: '24px', fontWeight: 'bold' as const, color: '#1a1a1a' }
const greetingStyle = { fontSize: '16px', color: '#333' }
const bodyTextStyle = { fontSize: '15px', color: '#555', lineHeight: '1.6' }
const hrStyle = { borderColor: '#e6ebf1', margin: '20px 0' }
const detailStyle = { fontSize: '15px', color: '#333', margin: '8px 0' }
const labelStyle = { color: '#666' }
const footerStyle = { fontSize: '13px', color: '#999', textAlign: 'center' as const }
const brandStyle = { fontSize: '12px', color: '#ccc', textAlign: 'center' as const }
