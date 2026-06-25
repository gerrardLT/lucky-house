// src/types/index.ts
// 福岛岳温泉零碳宠物营地 C端官网 — 核心类型定义

// === 基础枚举 ===

/** 支持的语言区域 */
export type Locale = 'zh' | 'ja' | 'en'

/** 价格状态枚举：永远不硬编码真实价格数字 */
export type PriceStatus = 'available' | 'coming_soon' | 'inquiry'

/** 设施状态枚举 */
export type FacilityStatus = 'open' | 'opening_soon' | 'maintenance'

/** 房型类别 */
export type RoomCategory = 'standard' | 'pet-friendly' | 'villa'

/** 画廊分类 */
export type GalleryCategory =
  | 'all'
  | 'room'
  | 'onsen'
  | 'pet'
  | 'dog-run'
  | 'bbq-cafe'
  | 'activity'
  | 'nearby'
  | 'eco'

/** FAQ 分类 */
export type FAQCategory =
  | 'pet'
  | 'room-price'
  | 'onsen'
  | 'facility'
  | 'transport'
  | 'activity'
  | 'cancel'

/** 宠物类型（表单中宠物类型选择） */
export type PetType = 'dog' | 'cat' | 'other'

/** 疫苗证明状态 */
export type VaccineStatus = 'ready' | 'can_provide' | 'unsure'

/** 首选联系渠道 */
export type ContactChannel = 'email' | 'phone' | 'line' | 'wechat' | 'whatsapp'

/** 活动状态 */
export type ActivityStatus = 'open' | 'upcoming' | 'full' | 'ended'

// === 房型数据模型 ===

/** 房型信息 */
export interface RoomType {
  slug: string
  category: RoomCategory
  name: Record<Locale, string>
  description: Record<Locale, string>
  area: number // 平方米
  maxGuests: number
  maxChildren: number
  bedType: Record<Locale, string>
  isPetFriendly: boolean
  maxPets: number
  maxPetWeight?: number // kg
  priceStatus: PriceStatus
  price?: number // 仅 priceStatus === 'available' 时有值
  amenities: string[] // 设施 key 列表
  images: GalleryAsset[]
  tags: Record<Locale, string[]> // 适合人群标签
  status: 'active' | 'coming_soon'
  sortOrder: number
}


// === 画廊资源模型 ===

/** 画廊资源（图片）—— isRendering 为 true 时前端自动渲染"示意图"标签 */
export interface GalleryAsset {
  id: string
  src: string
  alt: Record<Locale, string>
  category: GalleryCategory
  isRendering: boolean // true = 概念图，需程序化标注"示意图"标签
  linkedPage?: string // 可跳转的关联页面路径
  sortOrder: number
  width: number
  height: number
}

// === 设施模型 ===

/** 设施信息 */
export interface Facility {
  slug: string
  category: 'onsen' | 'pet-service' | 'dining' | 'leisure' | 'eco'
  name: Record<Locale, string>
  description: Record<Locale, string>
  status: FacilityStatus
  icon: string
  image?: GalleryAsset
  linkedFAQ?: string
  linkedBooking?: boolean
  sortOrder: number
}

// === 活动模型 ===

/** 活动信息 */
export interface Activity {
  slug: string
  name: Record<Locale, string>
  description: Record<Locale, string>
  date?: string // ISO date，undefined 表示时间待定
  category: string
  targetAudience: Record<Locale, string[]>
  status: ActivityStatus
  image: GalleryAsset
  priceStatus: PriceStatus
  capacity?: number
  sortOrder: number
}

// === FAQ 模型 ===

/** FAQ 问答条目 */
export interface FAQ {
  id: string
  category: FAQCategory
  question: Record<Locale, string>
  answer: Record<Locale, string>
  sortOrder: number
}

// === 预约相关模型 ===

/** 宠物信息（hasPet === true 时条件渲染） */
export interface PetInfo {
  petType: PetType
  breed: string
  count: number
  weight: number // kg
  age: number
  vaccineStatus: VaccineStatus
  rabiesStatus: VaccineStatus
  needOnsen: boolean
  needGrooming: boolean
  specialNotes?: string
}

/** 联系信息 */
export interface ContactInfo {
  name: string
  email: string
  phone: string
  country: string
  preferredChannel: ContactChannel
}

/** 规则确认标记 */
export interface AgreementFlags {
  privacyPolicy: boolean
  petRules?: boolean // 仅携宠用户需确认
  cancelPolicy: boolean
  marketingSubscribe: boolean // 必须默认 false（GDPR 合规）
}

/** 归因数据（预约成功时记录） */
export interface AttributionData {
  sourceUrl: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  locale: Locale
  deviceType: 'desktop' | 'mobile' | 'tablet'
  timestamp: string // ISO datetime
}

// === 首页数据聚合 ===

/** 首页聚合数据 */
export interface HomepageData {
  hero: {
    image: GalleryAsset
    title: Record<Locale, string>
    subtitle: Record<Locale, string>
  }
  bookingWidgetVisible: boolean // CMS 可配置隐藏
  valueCards: Array<{
    icon: string
    title: Record<Locale, string>
    description: Record<Locale, string>
    link: string
  }>
  featuredRooms: RoomType[]
  featuredGallery: GalleryAsset[]
  topFAQs: FAQ[]
}

// === 周边探索模型 ===

/** 周边探索数据 */
export interface ExploreData {
  mapCenter: { lat: number; lng: number }
  spots: Array<{
    name: Record<Locale, string>
    description: Record<Locale, string>
    category: string
    distance?: string
    image?: GalleryAsset
  }>
  itineraries: Array<{
    title: Record<Locale, string>
    duration: string
    tags: Record<Locale, string[]>
    steps: Array<{
      name: Record<Locale, string>
      description: Record<Locale, string>
    }>
  }>
  seasonalContent: Record<
    'spring' | 'summer' | 'autumn' | 'winter',
    {
      title: Record<Locale, string>
      highlights: Record<Locale, string[]>
    }
  >
}

// === 站点配置 ===

/** 站点全局配置 */
export interface SiteConfig {
  siteName: Record<Locale, string>
  siteDescription: Record<Locale, string>
  contact: {
    address: Record<Locale, string>
    phone: string
    email: string
    serviceHours: Record<Locale, string>
  }
  social: Array<{
    platform: string
    url: string
    icon: string
  }>
}

// === API 请求/响应类型 ===

/** 预约请求 */
export interface BookingRequest {
  // Step 1
  checkIn: string // ISO date
  checkOut: string // ISO date
  adults: number
  children: number
  rooms: number
  hasPet: boolean
  petCount?: number
  // Step 2
  roomPreference: 'standard' | 'pet-friendly' | 'villa' | 'no-preference'
  acceptAlternative: boolean
  // Step 3 (conditional: hasPet === true)
  petInfo?: PetInfo
  // Step 4
  contact: ContactInfo
  // Step 5
  agreements: AgreementFlags
  // Meta
  idempotencyKey: string
  source: AttributionData
}

/** 预约响应 */
export interface BookingResponse {
  success: boolean
  confirmationId?: string
  error?: string
}

/** 联系表单请求 */
export interface ContactRequest {
  subject: 'accommodation' | 'pet' | 'activity' | 'general'
  name: string
  email: string
  phone?: string
  message: string
  locale: Locale
}

/** 邮件订阅请求 */
export interface SubscribeRequest {
  email: string
  interests?: string[]
  locale: Locale
}

/** API 错误响应格式 */
export interface ApiErrorResponse {
  success: false
  error: {
    code: 'VALIDATION_ERROR' | 'DUPLICATE_SUBMISSION' | 'RATE_LIMIT' | 'INTERNAL_ERROR'
    message: string
    fields?: Record<string, string> // 字段级错误
  }
}

// === 后台管理类型 ===

/** 预约状态 */
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

/** 联系工单状态 */
export type ContactStatus = 'pending' | 'resolved'

/** 活动兴趣登记类型 */
export type InterestType = 'interest' | 'register'

/** 预约记录（DB 行类型） */
export interface BookingRecord {
  id: string
  idempotencyKey: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  rooms: number
  hasPet: boolean
  petCount: number | null
  roomPreference: string
  acceptAlternative: boolean
  petInfo: PetInfo | null
  contact: ContactInfo
  agreements: AgreementFlags
  source: AttributionData
  status: BookingStatus
  createdAt: string
  updatedAt: string
}

/** 联系工单记录 */
export interface ContactRecord {
  id: string
  subject: string
  name: string
  email: string
  phone: string | null
  message: string
  locale: string
  routedTo: string
  status: ContactStatus
  createdAt: string
}

/** 订阅者记录 */
export interface SubscriberRecord {
  id: string
  email: string
  interests: string[]
  locale: string
  subscribedAt: string
}

/** 活动兴趣记录 */
export interface ActivityInterestRecord {
  id: string
  activitySlug: string
  name: string
  email: string
  phone: string | null
  type: InterestType
  locale: string
  message: string | null
  createdAt: string
}

/** Dashboard 统计数据 */
export interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  cancelledBookings: number
  totalContacts: number
  pendingContacts: number
  totalSubscribers: number
  totalActivityInterests: number
  recentBookings: BookingRecord[]
}

/** 分页结果 */
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
