'use client'

import { BookingWidget } from './BookingWidget'
import { HeroTitle, HeroSubtitle, SlideUp } from '@/components/motion'
import { displayHeading, subtitle as subtitleStyle } from '@/lib/i18n/locale-typo'
import type { GalleryAsset, Locale } from '@/types'

export interface HeroSectionProps {
  /** Hero 背景图片（视频不可用时的 fallback） */
  image: GalleryAsset
  /** 品牌主标题（多语言） */
  title: Record<Locale, string>
  /** 副标题（多语言） */
  subtitle: Record<Locale, string>
  /** 当前语言 */
  locale: Locale
  /** 控制内嵌预订组件显示 */
  bookingVisible: boolean
}

/**
 * HeroSection 首页英雄区组件
 *
 * 全屏视频背景 + 渐变遮罩 + 主副标题 + 内嵌 BookingWidget。
 * 视频自动播放、静音、循环，不支持视频时 fallback 到静态图片。
 */
export function HeroSection({ image, title, subtitle, locale, bookingVisible }: HeroSectionProps) {
  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden -mt-16">
      {/* 全屏视频背景 */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={image.src}
        className="absolute inset-0 z-[1] w-full h-full object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* 渐变遮罩 */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

      {/* 内容容器 */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between">
        {/* 标题区域 */}
        <div className="pt-[30vh] px-4 text-center">
          <HeroTitle className={`mb-4 max-w-5xl mx-auto font-serif text-5xl font-light text-white drop-shadow-lg lg:text-7xl xl:text-8xl ${displayHeading(locale)}`}>
            {title[locale]}
          </HeroTitle>
          <HeroSubtitle className={`max-w-2xl mx-auto text-base text-white/80 lg:text-lg ${subtitleStyle(locale)}`}>
            {subtitle[locale]}
          </HeroSubtitle>
        </div>

        {/* 底部预订区域 */}
        <SlideUp delay={1} className="pb-8 px-4 max-w-5xl mx-auto w-full mt-6">
          <BookingWidget visible={bookingVisible} locale={locale} embedded={true} />
        </SlideUp>
      </div>
    </section>
  )
}
