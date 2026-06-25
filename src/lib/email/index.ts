// src/lib/email/index.ts
// Resend SDK 封装 — fire-and-forget 模式，不阻塞 API 响应

import { Resend } from 'resend'
import { render } from '@react-email/render'
import type { ReactElement } from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_ADDRESS = process.env.EMAIL_FROM || 'noreply@luckyhouse.jp'

/**
 * 渲染 React Email 模板并发送
 * 错误仅记录日志，不抛出异常（fire-and-forget）
 */
export async function sendEmail(
  to: string,
  subject: string,
  template: ReactElement
): Promise<void> {
  try {
    const html = await render(template)
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    })
    console.log(`[Email] Sent to ${to}: ${subject}`)
  } catch (error) {
    console.error(`[Email] Failed to send to ${to}: ${subject}`, error)
  }
}
