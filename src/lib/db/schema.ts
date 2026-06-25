// src/lib/db/schema.ts
// Drizzle ORM Schema — 4 张业务表 + PostgreSQL 枚举

import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core'

// === 枚举类型 ===

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'cancelled',
])

export const contactStatusEnum = pgEnum('contact_status', [
  'pending',
  'resolved',
])

export const interestTypeEnum = pgEnum('interest_type', [
  'interest',
  'register',
])

// === bookings 预约表 ===

export const bookings = pgTable('bookings', {
  // 主键 & 标识
  id: text('id').primaryKey(), // confirmationId (LH-xxx)
  idempotencyKey: text('idempotency_key').notNull().unique(),

  // Step 1: 日期与人数
  checkIn: text('check_in').notNull(),
  checkOut: text('check_out').notNull(),
  adults: integer('adults').notNull(),
  children: integer('children').notNull().default(0),
  rooms: integer('rooms').notNull().default(1),
  hasPet: boolean('has_pet').notNull().default(false),
  petCount: integer('pet_count'),

  // Step 2: 房型偏好
  roomPreference: text('room_preference').notNull(),
  acceptAlternative: boolean('accept_alternative').notNull().default(true),

  // Step 3: 宠物信息 (JSON)
  petInfo: jsonb('pet_info'),

  // Step 4: 联系信息 (JSON)
  contact: jsonb('contact').notNull(),

  // Step 5: 协议确认 (JSON)
  agreements: jsonb('agreements').notNull(),

  // 归因数据 (JSON)
  source: jsonb('source').notNull(),

  // 状态管理
  status: bookingStatusEnum('status').notNull().default('pending'),

  // 时间戳
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// === contacts 联系表 ===

export const contacts = pgTable('contacts', {
  id: text('id').primaryKey(), // ticketId (CT-xxx)
  subject: text('subject').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message').notNull(),
  locale: text('locale').notNull(),
  routedTo: text('routed_to').notNull(),
  status: contactStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// === subscribers 订阅表 ===

export const subscribers = pgTable('subscribers', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  interests: text('interests').array().notNull().default([]),
  locale: text('locale').notNull(),
  subscribedAt: timestamp('subscribed_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// === activity_interests 活动兴趣表 ===

export const activityInterests = pgTable('activity_interests', {
  id: text('id').primaryKey(), // registrationId (AR-xxx)
  activitySlug: text('activity_slug').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  type: interestTypeEnum('type').notNull(),
  locale: text('locale').notNull(),
  message: text('message'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
