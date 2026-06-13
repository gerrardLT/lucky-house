import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ContactForm } from '../ContactForm'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('ContactForm', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  describe('渲染', () => {
    it('应正确渲染中文标签', () => {
      render(<ContactForm locale="zh" />)

      expect(screen.getByLabelText(/咨询主题/)).toBeInTheDocument()
      expect(screen.getByLabelText(/姓名/)).toBeInTheDocument()
      expect(screen.getByLabelText(/邮箱/)).toBeInTheDocument()
      expect(screen.getByLabelText(/电话/)).toBeInTheDocument()
      expect(screen.getByLabelText(/留言内容/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /发送消息/ })).toBeInTheDocument()
    })

    it('应正确渲染日文标签', () => {
      render(<ContactForm locale="ja" />)

      expect(screen.getByLabelText(/お問い合わせ種別/)).toBeInTheDocument()
      expect(screen.getByLabelText(/お名前/)).toBeInTheDocument()
      expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument()
      expect(screen.getByLabelText(/電話番号/)).toBeInTheDocument()
      expect(screen.getByLabelText(/メッセージ/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /送信する/ })).toBeInTheDocument()
    })

    it('应正确渲染英文标签', () => {
      render(<ContactForm locale="en" />)

      expect(screen.getByLabelText(/Subject/)).toBeInTheDocument()
      expect(screen.getByLabelText(/^Name/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Email/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Phone/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Message/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Send Message/ })).toBeInTheDocument()
    })

    it('应渲染所有中文主题选项', () => {
      render(<ContactForm locale="zh" />)

      const select = screen.getByLabelText(/咨询主题/)
      expect(select).toBeInTheDocument()
      expect(screen.getByText('住宿咨询')).toBeInTheDocument()
      expect(screen.getByText('宠物相关')).toBeInTheDocument()
      expect(screen.getByText('活动咨询')).toBeInTheDocument()
      expect(screen.getByText('其他问题')).toBeInTheDocument()
    })

    it('应渲染所有日文主题选项', () => {
      render(<ContactForm locale="ja" />)

      expect(screen.getByText('ご宿泊について')).toBeInTheDocument()
      expect(screen.getByText('ペットについて')).toBeInTheDocument()
      expect(screen.getByText('アクティビティについて')).toBeInTheDocument()
      expect(screen.getByText('その他')).toBeInTheDocument()
    })

    it('应渲染所有英文主题选项', () => {
      render(<ContactForm locale="en" />)

      expect(screen.getByText('Accommodation')).toBeInTheDocument()
      expect(screen.getByText('Pet Related')).toBeInTheDocument()
      expect(screen.getByText('Activities')).toBeInTheDocument()
      expect(screen.getByText('General Inquiry')).toBeInTheDocument()
    })
  })

  describe('验证', () => {
    it('应在提交空表单时显示所有必填错误', async () => {
      render(<ContactForm locale="zh" />)

      fireEvent.click(screen.getByRole('button', { name: /发送消息/ }))

      await waitFor(() => {
        expect(screen.getByText('请选择咨询主题')).toBeInTheDocument()
        expect(screen.getByText('请输入姓名')).toBeInTheDocument()
        expect(screen.getByText('请输入邮箱')).toBeInTheDocument()
        expect(screen.getByText('请输入留言内容')).toBeInTheDocument()
      })
    })

    it('应在邮箱格式无效时显示错误', async () => {
      render(<ContactForm locale="zh" />)

      const emailInput = screen.getByLabelText(/邮箱/)
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.blur(emailInput)

      await waitFor(() => {
        expect(screen.getByText('请输入有效的邮箱地址')).toBeInTheDocument()
      })
    })

    it('应在留言少于10个字符时显示错误', async () => {
      render(<ContactForm locale="zh" />)

      const messageInput = screen.getByLabelText(/留言内容/)
      fireEvent.change(messageInput, { target: { value: '太短了' } })
      fireEvent.blur(messageInput)

      await waitFor(() => {
        expect(screen.getByText('留言内容至少需要10个字符')).toBeInTheDocument()
      })
    })

    it('应在修正字段后清除错误提示', async () => {
      render(<ContactForm locale="zh" />)

      const nameInput = screen.getByLabelText(/姓名/)
      fireEvent.change(nameInput, { target: { value: '' } })
      fireEvent.blur(nameInput)

      await waitFor(() => {
        expect(screen.getByText('请输入姓名')).toBeInTheDocument()
      })

      fireEvent.change(nameInput, { target: { value: '张三' } })

      await waitFor(() => {
        expect(screen.queryByText('请输入姓名')).not.toBeInTheDocument()
      })
    })
  })

  describe('提交', () => {
    it('应在提交成功时显示成功消息并清空表单', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })
      render(<ContactForm locale="zh" />)

      // 填写表单
      fireEvent.change(screen.getByLabelText(/咨询主题/), { target: { value: 'accommodation' } })
      fireEvent.change(screen.getByLabelText(/姓名/), { target: { value: '张三' } })
      fireEvent.change(screen.getByLabelText(/邮箱/), { target: { value: 'test@example.com' } })
      fireEvent.change(screen.getByLabelText(/留言内容/), { target: { value: '这是一条测试留言内容' } })

      fireEvent.click(screen.getByRole('button', { name: /发送消息/ }))

      await waitFor(() => {
        expect(screen.getByText('感谢您的留言，我们会尽快回复')).toBeInTheDocument()
      })

      // 验证表单被清空
      expect(screen.getByLabelText(/姓名/)).toHaveValue('')
      expect(screen.getByLabelText(/邮箱/)).toHaveValue('')
      expect(screen.getByLabelText(/留言内容/)).toHaveValue('')
    })

    it('应在提交时发送正确的数据到 /api/contact', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })
      render(<ContactForm locale="zh" />)

      fireEvent.change(screen.getByLabelText(/咨询主题/), { target: { value: 'pet' } })
      fireEvent.change(screen.getByLabelText(/姓名/), { target: { value: '李四' } })
      fireEvent.change(screen.getByLabelText(/邮箱/), { target: { value: 'li@test.com' } })
      fireEvent.change(screen.getByLabelText(/电话/), { target: { value: '13800138000' } })
      fireEvent.change(screen.getByLabelText(/留言内容/), { target: { value: '请问可以带两只狗入住吗？' } })

      fireEvent.click(screen.getByRole('button', { name: /发送消息/ }))

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: 'pet',
            name: '李四',
            email: 'li@test.com',
            phone: '13800138000',
            message: '请问可以带两只狗入住吗？',
            locale: 'zh',
          }),
        })
      })
    })

    it('应在提交失败时显示错误消息并保留表单数据', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })
      render(<ContactForm locale="zh" />)

      fireEvent.change(screen.getByLabelText(/咨询主题/), { target: { value: 'general' } })
      fireEvent.change(screen.getByLabelText(/姓名/), { target: { value: '王五' } })
      fireEvent.change(screen.getByLabelText(/邮箱/), { target: { value: 'wang@test.com' } })
      fireEvent.change(screen.getByLabelText(/留言内容/), { target: { value: '这是一条测试留言内容' } })

      fireEvent.click(screen.getByRole('button', { name: /发送消息/ }))

      await waitFor(() => {
        expect(screen.getByText('发送失败，请稍后重试或联系客服')).toBeInTheDocument()
      })

      // 验证表单数据保留
      expect(screen.getByLabelText(/姓名/)).toHaveValue('王五')
      expect(screen.getByLabelText(/邮箱/)).toHaveValue('wang@test.com')
      expect(screen.getByLabelText(/留言内容/)).toHaveValue('这是一条测试留言内容')
    })

    it('应在网络错误时显示错误消息', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      render(<ContactForm locale="zh" />)

      fireEvent.change(screen.getByLabelText(/咨询主题/), { target: { value: 'activity' } })
      fireEvent.change(screen.getByLabelText(/姓名/), { target: { value: '赵六' } })
      fireEvent.change(screen.getByLabelText(/邮箱/), { target: { value: 'zhao@test.com' } })
      fireEvent.change(screen.getByLabelText(/留言内容/), { target: { value: '我想了解一下周末活动的安排' } })

      fireEvent.click(screen.getByRole('button', { name: /发送消息/ }))

      await waitFor(() => {
        expect(screen.getByText('发送失败，请稍后重试或联系客服')).toBeInTheDocument()
      })
    })

    it('应在提交过程中显示 loading 状态', async () => {
      // 使用一个不会 resolve 的 promise 来保持 loading 状态
      mockFetch.mockImplementation(() => new Promise(() => {}))
      render(<ContactForm locale="zh" />)

      fireEvent.change(screen.getByLabelText(/咨询主题/), { target: { value: 'accommodation' } })
      fireEvent.change(screen.getByLabelText(/姓名/), { target: { value: '测试' } })
      fireEvent.change(screen.getByLabelText(/邮箱/), { target: { value: 'test@test.com' } })
      fireEvent.change(screen.getByLabelText(/留言内容/), { target: { value: '这是一条足够长的测试留言' } })

      fireEvent.click(screen.getByRole('button', { name: /发送消息/ }))

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeDisabled()
        expect(screen.getByText('发送中...')).toBeInTheDocument()
      })
    })
  })
})
