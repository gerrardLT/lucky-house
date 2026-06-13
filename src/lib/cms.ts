// src/lib/cms.ts
// CMS 数据抽象层 — MVP 阶段从本地 JSON 读取，函数签名按未来 CMS 接口设计
// 未来可直接替换为 Headless CMS API 调用，无需修改消费端代码

import type {
  Locale,
  RoomType,
  Facility,
  Activity,
  GalleryAsset,
  GalleryCategory,
  FAQ,
  FAQCategory,
  HomepageData,
  ExploreData,
  SiteConfig,
} from '@/types'

import roomsData from '@/data/rooms.json'
import facilitiesData from '@/data/facilities.json'
import activitiesData from '@/data/activities.json'
import galleryData from '@/data/gallery.json'
import faqData from '@/data/faq.json'
import exploreData from '@/data/explore.json'
import homepageData from '@/data/homepage.json'
import siteConfigData from '@/data/site-config.json'

/**
 * 获取所有房型列表，按 sortOrder 排序
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getRoomTypes(locale?: Locale): Promise<RoomType[]> {
  const rooms = roomsData as unknown as RoomType[]
  return [...rooms].sort((a, b) => a.sortOrder - b.sortOrder)
}

/**
 * 根据 slug 获取单个房型详情
 */
export async function getRoomBySlug(slug: string): Promise<RoomType | null> {
  const rooms = roomsData as unknown as RoomType[]
  return rooms.find((room) => room.slug === slug) ?? null
}

/**
 * 获取所有设施列表，按 sortOrder 排序
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getFacilities(locale?: Locale): Promise<Facility[]> {
  const facilities = facilitiesData as unknown as Facility[]
  return [...facilities].sort((a, b) => a.sortOrder - b.sortOrder)
}

/**
 * 获取所有活动列表，按 sortOrder 排序
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getActivities(locale?: Locale): Promise<Activity[]> {
  const activities = activitiesData as unknown as Activity[]
  return [...activities].sort((a, b) => a.sortOrder - b.sortOrder)
}

/**
 * 获取画廊资源，可选按分类筛选，按 sortOrder 排序
 */
export async function getGalleryAssets(
  category?: GalleryCategory
): Promise<GalleryAsset[]> {
  const assets = galleryData as unknown as GalleryAsset[]
  const filtered =
    category && category !== 'all'
      ? assets.filter((asset) => asset.category === category)
      : assets
  return [...filtered].sort((a, b) => a.sortOrder - b.sortOrder)
}

/**
 * 获取 FAQ 列表，可选按分类筛选，按 sortOrder 排序
 */
export async function getFAQs(category?: FAQCategory): Promise<FAQ[]> {
  const faqs = faqData as unknown as FAQ[]
  const filtered = category
    ? faqs.filter((faq) => faq.category === category)
    : faqs
  return [...filtered].sort((a, b) => a.sortOrder - b.sortOrder)
}

/**
 * 获取首页聚合数据
 */
export async function getHomepageData(): Promise<HomepageData> {
  return homepageData as unknown as HomepageData
}

/**
 * 获取周边探索数据
 */
export async function getExploreData(): Promise<ExploreData> {
  return exploreData as unknown as ExploreData
}

/**
 * 获取站点全局配置
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  return siteConfigData as unknown as SiteConfig
}
