import Image from 'next/image'

export interface ImageWithLabelProps {
  /** 图片路径 */
  src: string
  /** 图片描述性文本（accessibility） */
  alt: string
  /** 图片原始宽度 */
  width: number
  /** 图片原始高度 */
  height: number
  /** 当 true 时自动渲染"示意图"标签覆盖层 */
  isRendering?: boolean
  /** 首屏可见图片使用 priority 预加载 */
  priority?: boolean
  /** 附加样式类 */
  className?: string
  /** 响应式 sizes 属性 */
  sizes?: string
  /** 点击事件 */
  onClick?: () => void
}

/**
 * ImageWithLabel 组件
 *
 * 使用 next/image 渲染优化图片，当 isRendering === true 时自动在角落显示"示意图"标签。
 * 支持 priority/lazy-load 策略和宽高比占位（CLS 优化）。
 */
export function ImageWithLabel({
  src,
  alt,
  width,
  height,
  isRendering = false,
  priority = false,
  className = '',
  sizes,
  onClick,
}: ImageWithLabelProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        sizes={sizes}
        className="h-full w-full object-cover"
      />
      {isRendering && (
        <span
          className="absolute bottom-2 left-2 rounded px-2 py-0.5 text-xs font-medium text-white bg-black/60"
          aria-label="示意图"
        >
          示意图
        </span>
      )}
    </div>
  )
}
