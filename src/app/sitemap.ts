import type { MetadataRoute } from 'next'
import { getRoomTypes } from '@/lib/cms'

const BASE_URL = 'https://luckyhouse.jp'
const locales = ['zh', 'ja', 'en'] as const

// 静态页面路径（不含 locale 前缀）
const staticPages = [
  '',           // 首页
  '/stay',
  '/pet-friendly',
  '/facilities',
  '/activities',
  '/explore',
  '/gallery',
  '/faq',
  '/booking',
  '/contact',
  '/privacy',
  '/terms',
  '/pet-rules',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rooms = await getRoomTypes()
  const roomSlugs = rooms.map((room) => room.slug)

  const entries: MetadataRoute.Sitemap = []

  // 为每个静态页面生成所有语言版本的 URL
  for (const page of staticPages) {
    for (const locale of locales) {
      const url = `${BASE_URL}/${locale}${page}`
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            zh: `${BASE_URL}/zh${page}`,
            ja: `${BASE_URL}/ja${page}`,
            en: `${BASE_URL}/en${page}`,
          },
        },
      })
    }
  }

  // 为每个房型详情页生成所有语言版本的 URL
  for (const slug of roomSlugs) {
    for (const locale of locales) {
      const url = `${BASE_URL}/${locale}/stay/${slug}`
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            zh: `${BASE_URL}/zh/stay/${slug}`,
            ja: `${BASE_URL}/ja/stay/${slug}`,
            en: `${BASE_URL}/en/stay/${slug}`,
          },
        },
      })
    }
  }

  return entries
}
