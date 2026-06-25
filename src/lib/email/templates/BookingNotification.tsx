// src/lib/email/templates/BookingNotification.tsx
// 运营通知邮件 — 完整预约信息/宠物/UTM 归因

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

interface Props {
  confirmationId: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  rooms: number
  roomPreference: string
  hasPet: boolean
  petInfo?: {
    petType: string
    breed: string
    count: number
    weight: number
    age: number
  } | null
  contactName: string
  contactEmail: string
  contactPhone: string
  country: string
  preferredChannel: string
  source?: {
    sourceUrl?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    locale?: string
    deviceType?: string
  }
}

export default function BookingNotificationEmail(props: Props) {
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>New Booking Received</Heading>
          <Text style={subtitleStyle}>
            Confirmation: <strong>{props.confirmationId}</strong>
          </Text>

          <Hr style={hrStyle} />

          <Heading as="h3" style={sectionTitleStyle}>Booking Details</Heading>
          <InfoRow label="Check-in" value={props.checkIn} />
          <InfoRow label="Check-out" value={props.checkOut} />
          <InfoRow label="Guests" value={`${props.adults} adults, ${props.children} children`} />
          <InfoRow label="Rooms" value={String(props.rooms)} />
          <InfoRow label="Room Preference" value={props.roomPreference} />

          <Hr style={hrStyle} />

          <Heading as="h3" style={sectionTitleStyle}>Contact Info</Heading>
          <InfoRow label="Name" value={props.contactName} />
          <InfoRow label="Email" value={props.contactEmail} />
          <InfoRow label="Phone" value={props.contactPhone} />
          <InfoRow label="Country" value={props.country} />
          <InfoRow label="Preferred Channel" value={props.preferredChannel} />

          {props.hasPet && props.petInfo && (
            <>
              <Hr style={hrStyle} />
              <Heading as="h3" style={sectionTitleStyle}>Pet Info</Heading>
              <InfoRow label="Type" value={props.petInfo.petType} />
              <InfoRow label="Breed" value={props.petInfo.breed} />
              <InfoRow label="Count" value={String(props.petInfo.count)} />
              <InfoRow label="Weight" value={`${props.petInfo.weight} kg`} />
              <InfoRow label="Age" value={`${props.petInfo.age} years`} />
            </>
          )}

          {props.source && (
            <>
              <Hr style={hrStyle} />
              <Heading as="h3" style={sectionTitleStyle}>Attribution (UTM)</Heading>
              {props.source.sourceUrl && <InfoRow label="Source URL" value={props.source.sourceUrl} />}
              {props.source.utmSource && <InfoRow label="UTM Source" value={props.source.utmSource} />}
              {props.source.utmMedium && <InfoRow label="UTM Medium" value={props.source.utmMedium} />}
              {props.source.utmCampaign && <InfoRow label="UTM Campaign" value={props.source.utmCampaign} />}
              {props.source.locale && <InfoRow label="Locale" value={props.source.locale} />}
              {props.source.deviceType && <InfoRow label="Device" value={props.source.deviceType} />}
            </>
          )}
        </Container>
      </Body>
    </Html>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Section style={detailStyle}>
      <Text style={labelStyle}>{label}</Text>
      <Text style={valueStyle}>{value}</Text>
    </Section>
  )
}

const bodyStyle = { backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }
const containerStyle = { margin: '0 auto', padding: '40px 20px', maxWidth: '600px' }
const headingStyle = { fontSize: '24px', fontWeight: 'bold' as const, color: '#1a1a1a' }
const subtitleStyle = { fontSize: '16px', color: '#666' }
const sectionTitleStyle = { fontSize: '18px', fontWeight: 'bold' as const, color: '#333', margin: '10px 0' }
const hrStyle = { borderColor: '#e6ebf1', margin: '20px 0' }
const detailStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }
const labelStyle = { fontSize: '14px', color: '#666', width: '35%' }
const valueStyle = { fontSize: '14px', color: '#1a1a1a', width: '65%', textAlign: 'right' as const }
