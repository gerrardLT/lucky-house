// src/lib/email/templates/BookingConfirmation.tsx
// 用户预约确认邮件 — 确认编号/日期/房型/三语文案

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from '@react-email/components'
import type { Locale } from '@/types'

interface Props {
  confirmationId: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  rooms: number
  roomPreference: string
  hasPet: boolean
  contactName: string
  locale: Locale
}

const i18n = {
  zh: {
    title: '预约确认',
    subtitle: '您的预约已成功提交',
    confirmationId: '确认编号',
    checkIn: '入住日期',
    checkOut: '退房日期',
    guests: '入住人数',
    rooms: '房间数',
    roomType: '房型偏好',
    pet: '携带宠物',
    yes: '是',
    no: '否',
    footer: '如有疑问，请随时联系我们。',
  },
  ja: {
    title: '予約確認',
    subtitle: 'ご予約が正常に送信されました',
    confirmationId: '確認番号',
    checkIn: 'チェックイン',
    checkOut: 'チェックアウト',
    guests: '宿泊人数',
    rooms: '部屋数',
    roomType: '部屋タイプ',
    pet: 'ペット同伴',
    yes: 'はい',
    no: 'いいえ',
    footer: 'ご不明な点がございましたら、お気軽にお問い合わせください。',
  },
  en: {
    title: 'Booking Confirmation',
    subtitle: 'Your booking has been submitted successfully',
    confirmationId: 'Confirmation ID',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    guests: 'Guests',
    rooms: 'Rooms',
    roomType: 'Room Preference',
    pet: 'Pet',
    yes: 'Yes',
    no: 'No',
    footer: 'If you have any questions, please feel free to contact us.',
  },
} as const

export default function BookingConfirmationEmail(props: Props) {
  const t = i18n[props.locale]
  const adultsChildren = `${props.adults} adults, ${props.children} children`

  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>{t.title}</Heading>
          <Text style={subtitleStyle}>{t.subtitle}</Text>

          <Hr style={hrStyle} />

          <Section style={detailStyle}>
            <Text style={labelStyle}>{t.confirmationId}</Text>
            <Text style={valueStyle}>{props.confirmationId}</Text>
          </Section>

          <Section style={detailStyle}>
            <Text style={labelStyle}>{t.checkIn}</Text>
            <Text style={valueStyle}>{props.checkIn}</Text>
          </Section>

          <Section style={detailStyle}>
            <Text style={labelStyle}>{t.checkOut}</Text>
            <Text style={valueStyle}>{props.checkOut}</Text>
          </Section>

          <Section style={detailStyle}>
            <Text style={labelStyle}>{t.guests}</Text>
            <Text style={valueStyle}>{adultsChildren}</Text>
          </Section>

          <Section style={detailStyle}>
            <Text style={labelStyle}>{t.rooms}</Text>
            <Text style={valueStyle}>{String(props.rooms)}</Text>
          </Section>

          <Section style={detailStyle}>
            <Text style={labelStyle}>{t.roomType}</Text>
            <Text style={valueStyle}>{props.roomPreference}</Text>
          </Section>

          <Section style={detailStyle}>
            <Text style={labelStyle}>{t.pet}</Text>
            <Text style={valueStyle}>{props.hasPet ? t.yes : t.no}</Text>
          </Section>

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
const subtitleStyle = { fontSize: '16px', color: '#666' }
const hrStyle = { borderColor: '#e6ebf1', margin: '20px 0' }
const detailStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }
const labelStyle = { fontSize: '14px', color: '#666', width: '40%' }
const valueStyle = { fontSize: '14px', color: '#1a1a1a', fontWeight: 'bold' as const, width: '60%', textAlign: 'right' as const }
const footerStyle = { fontSize: '13px', color: '#999', textAlign: 'center' as const }
const brandStyle = { fontSize: '12px', color: '#ccc', textAlign: 'center' as const }
