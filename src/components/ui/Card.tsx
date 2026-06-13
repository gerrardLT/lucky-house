import Image from 'next/image'

export interface CardProps {
  children: React.ReactNode
  className?: string
  image?: {
    src: string
    alt: string
    width?: number
    height?: number
    priority?: boolean
  }
  padding?: 'none' | 'sm' | 'md' | 'lg'
  as?: 'div' | 'article' | 'section'
}

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
}

export function Card({
  children,
  className = '',
  image,
  padding = 'md',
  as: Component = 'div',
}: CardProps) {
  return (
    <Component
      className={`rounded-xl bg-stone-800 border border-stone-700 overflow-hidden ${className}`}
    >
      {image && (
        <div className="relative w-full aspect-[16/10]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            priority={image.priority}
          />
        </div>
      )}
      <div className={paddingStyles[padding]}>{children}</div>
    </Component>
  )
}
