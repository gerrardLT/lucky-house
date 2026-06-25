// src/lib/email/templates/ContactAutoReply.tsx
// 联系表单自动回复 — 工单号/预计响应时间/三语文案

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
  ticketId: string
  name: string
  subject: string
  locale: Locale
}

const i18n = {
  zh: {
    title: '消息已收到',
    greeting: (name: string) => `尊敬的 ${name}，`,
    body: '感谢您的来信。我们已收到您的消息，工作人员会尽快处理。',
    ticketLabel: '工单编号',
    responseTime: '预计响应时间：1-2 个工作日',
    footer: '此邮件为自动发送，请勿直接回复。',
  },
  ja: {
    title: 'メッセージを受信しました',
    greeting: (name: string) => `${name} 様、`,
    body: 'お問い合わせありがとうございます。メッセージを受信いたしました。担当者より順次対応させていただきます。',
    ticketLabel: 'チケット番号',
    responseTime: '回答まで1〜2営業日程度お時間をいただきます',
    footer: 'このメールは自動送信されています。直接のご返信はご遠慮ください。',
  },
  en: {
    title: 'Message Received',
    greeting: (name: string) => `Dear ${name},`,
    body: 'Thank you for reaching out. We have received your message and our team will get back to you shortly.',
    ticketLabel: 'Ticket ID',
    responseTime: 'Expected response time: 1-2 business days',
    footer: 'This is an automated message. Please do not reply directly.',
  },
} as const

export default function ContactAutoReplyEmail(props: Props) {
  const t = i18n[props.locale]

  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>{t.title}</Heading>
          <Text style={greetingStyle}>{t.greeting(props.name)}</Text>
          <Text style={bodyStyle2}>{t.body}</Text>

          <Hr style={hrStyle} />

          <Text style={ticketStyle}>
            {t.ticketLabel}: <strong>{props.ticketId}</strong>
          </Text>
          <Text style={responseStyle}>{t.responseTime}</Text>

          <Hr style={hrStyle} />

          <Text style={footerStyle}>{t.footer}</Text>
          <Text style={brandStyle}>Luckyhouse 福岛岳温泉</Text>
        </Container>
      </Body>
    </Html>
  )
}

const bodyStyle = { backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }
const containerStyle = { margin: '0 auto', padding: '40px 20px', maxWidth: '600px' }
const headingStyle = { fontSize: '24px', fontWeight: 'bold' as const, color: '#1a1a1a' }
const greetingStyle = { fontSize: '16px', color: '#333' }
const bodyStyle2 = { fontSize: '15px', color: '#555', lineHeight: '1.6' }
const hrStyle = { borderColor: '#e6ebf1', margin: '20px 0' }
const ticketStyle = { fontSize: '15px', color: '#333', textAlign: 'center' as const }
const responseStyle = { fontSize: '13px', color: '#999', textAlign: 'center' as const }
const footerStyle = { fontSize: '12px', color: '#bbb', textAlign: 'center' as const }
const brandStyle = { fontSize: '12px', color: '#ccc', textAlign: 'center' as const }
