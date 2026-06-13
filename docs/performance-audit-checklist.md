# 性能审计检查清单

**审计日期**：2025-01（代码审计，非 Lighthouse 实测）  
**审计范围**：LCP ≤ 2.5s / CLS ≤ 0.1 / INP ≤ 200ms 的最佳实践验证  
**相关需求**：Requirements 2.7, 16.1, 16.2, 16.3

---

## ✅ 已通过项

### 1. next/image 使用（WebP/AVIF 支持）
- [x] `next.config.ts` 已配置 `images.formats: ['image/avif', 'image/webp']`
- [x] 所有生产代码中的图片均使用 `next/image` 组件（无原生 `<img>` 标签）
- [x] 使用位置：HeroSection、ImageWithLabel、ImageCarousel、Card、Lightbox、pet-friendly 页面

### 2. Hero 首屏图片 LCP 优化
- [x] `HeroSection.tsx`：使用 `priority` 属性 + `fill` 布局 + `sizes="100vw"`
- [x] `ImageCarousel.tsx`：首张图片 `priority={index === 0}`
- [x] `pet-friendly/page.tsx`：Hero 图片使用 `priority`

### 3. CLS 防护（宽高比占位）
- [x] `ImageWithLabel`：通过 `width` + `height` 属性提供明确宽高，并使用 `aspectRatio` CSS 占位
- [x] `Card`：使用 `fill` + `aspect-[16/10]` 容器预留空间
- [x] `HeroSection`：使用 `fill` + 容器 `h-[100svh]` 预留空间
- [x] `ImageCarousel`：使用 `fill` + 容器 `aspect-[16/10]` 预留空间

### 4. 图片懒加载策略
- [x] `ImageWithLabel`：非 priority 图片自动设置 `loading="lazy"`
- [x] `ImageCarousel`：仅首张图片 priority，其余 lazy
- [x] Gallery、RoomCard 等组件的图片均通过 ImageWithLabel 走 lazy-load 路径

### 5. Tailwind CSS 生产优化
- [x] 使用 Tailwind CSS v4 + `@tailwindcss/postcss` 插件
- [x] v4 默认自动 tree-shake 未使用的 CSS，无需额外配置 `purge`/`content`

### 6. 无渲染阻塞资源
- [x] 无外部字体引入（使用系统字体栈：`system-ui, -apple-system, 'Segoe UI', 'Noto Sans SC', 'Noto Sans JP'`）
- [x] 无外部 CSS 文件引入
- [x] 所有 `<script>` 标签仅为 `type="application/ld+json"` 结构化数据（不阻塞渲染）
- [x] Google Maps iframe 使用 `loading="lazy"` 属性

### 7. React Server Components 优先
- [x] 所有页面（page.tsx）均为 Server Components，仅标记 `'use client'` 的为交互组件
- [x] 首页（`[locale]/page.tsx`）为纯 RSC，数据通过 `Promise.all` 并行获取
- [x] 仅 booking/success 页面为 `'use client'`（需要 `useSearchParams`）

### 8. 客户端组件性能优化
- [x] Header scroll 监听使用 `{ passive: true }` 选项
- [x] FAQ 搜索使用 300ms debounce 防止频繁重新过滤
- [x] GalleryGrid、RoomGrid、ActivitiesGrid 等使用 `useMemo` 缓存计算结果
- [x] 回调函数使用 `useCallback` 避免不必要的子组件重渲染

### 9. 代码分割
- [x] 客户端组件（BookingForm、Lightbox、GalleryGrid 等）通过 `'use client'` 边界自动代码分割
- [x] 大型交互组件（BookingForm 分步表单）按需渲染

### 10. 首屏图片体积策略
- [x] next/image 自动根据 `sizes` 属性和设备分辨率提供最优尺寸
- [x] AVIF 格式优先（比 WebP 再小 20-30%）
- [x] Hero 图片使用 `sizes="100vw"` 确保不会加载过大的图片

---

## ⚠️ 潜在优化建议（非阻断项）

### 1. Header 组件客户端化
**现状**：整个 Header 标记为 `'use client'`，因为需要 scroll 监听实现 sticky compact 模式。  
**影响**：Header 的 JS bundle 会包含在首屏加载中。  
**建议**：可考虑将静态导航部分保留为 Server Component，仅将 scroll 行为提取为轻量 client wrapper。但考虑到 Header 代码量小（~130 行），实际影响有限。  
**优先级**：低

### 2. 实际图片素材体积验证
**现状**：代码层面已配置 AVIF/WebP 格式和响应式 sizes，但 public/ 目录下暂无实际 Hero 图片文件。  
**建议**：上线前需确保 Hero 原始图片经过压缩处理，源文件建议 ≤ 1MB（next/image 会自动按需生成优化版本）。  
**优先级**：中（上线前必须完成）

### 3. 字体加载优化（可选）
**现状**：使用系统字体栈，零网络请求。  
**备注**：如未来需要品牌字体，建议使用 `next/font` 进行自托管加载，避免外部字体请求。

---

## 结论

项目在代码层面已充分实现性能最佳实践：
- **LCP ≤ 2.5s**：Hero 图片使用 `priority` 预加载 + AVIF 格式 + RSC 直出 HTML ✅
- **CLS ≤ 0.1**：所有图片有明确宽高/fill + 容器预留 aspect-ratio ✅
- **INP ≤ 200ms**：事件监听使用 passive、交互组件使用 useMemo/useCallback 优化 ✅
- **首屏图片 ≤ 300KB**：AVIF 格式 + 响应式 sizes 策略到位 ✅（需实际图片验证）

**整体评级**：代码层面性能优化措施完善，无需修复。上线前需使用 Lighthouse CI 进行真实环境验证。
