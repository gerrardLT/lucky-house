'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { StepIndicator } from '@/components/ui/StepIndicator'
import { Button } from '@/components/ui/Button'
import { step1Schema, step2Schema, step3Schema, step4Schema, step5Schema } from '@/lib/schemas/booking'
import { Step1DateGuests, Step2RoomPreference, Step3PetInfo, Step4Contact, Step5Agreements } from './steps'
import type { Locale, FAQ } from '@/types'
import type { Step1Data, Step2Data, Step3Data, Step4Data, Step5Data } from '@/lib/schemas/booking'

export interface BookingFormProps {
  locale: Locale
  faqRules?: FAQ[]
}

// Step definitions (labels per locale)
const stepLabels: Record<Locale, string[]> = {
  zh: ['日期与人数', '房型偏好', '宠物信息', '联系方式', '规则确认'],
  ja: ['日程と人数', 'お部屋の希望', 'ペット情報', '連絡先', 'ルール確認'],
  en: ['Date & Guests', 'Room Preference', 'Pet Info', 'Contact', 'Agreements'],
}

const navLabels: Record<Locale, Record<string, string>> = {
  zh: { prev: '上一步', next: '下一步', submit: '提交预约' },
  ja: { prev: '戻る', next: '次へ', submit: '予約を送信' },
  en: { prev: 'Previous', next: 'Next', submit: 'Submit Booking' },
}

const errorMessages: Record<Locale, Record<string, string>> = {
  zh: { submitFailed: '提交失败，请重试或联系客服。', networkError: '网络错误，请检查网络连接后重试。', noPetStep: '您未选择携带宠物，此步骤将自动跳过。' },
  ja: { submitFailed: '送信に失敗しました。再度お試しいただくか、カスタマーサービスにご連絡ください。', networkError: 'ネットワークエラーです。接続を確認して再度お試しください。', noPetStep: 'ペット同伴なしのため、このステップはスキップされます。' },
  en: { submitFailed: 'Submission failed. Please try again or contact customer service.', networkError: 'Network error. Please check your connection and try again.', noPetStep: 'You are not traveling with a pet. This step will be skipped.' },
}

/**
 * Detect device type for attribution data
 */
function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  if (/tablet|ipad/i.test(ua)) return 'tablet'
  if (/mobile|android|iphone/i.test(ua)) return 'mobile'
  return 'desktop'
}

/**
 * Parse UTM parameters from current URL
 */
function getUtmParams() {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
  }
}

export function BookingForm({ locale, faqRules }: BookingFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 从 URL 参数中读取 BookingWidget 传入的预填数据
  const initCheckIn = searchParams.get('checkIn') ?? undefined
  const initCheckOut = searchParams.get('checkOut') ?? undefined
  const initAdults = searchParams.get('adults') ? Number(searchParams.get('adults')) : 1
  const initChildren = searchParams.get('children') ? Number(searchParams.get('children')) : 0
  const hasPetParam = searchParams.get('hasPet')
  const initHasPet: boolean | undefined =
    hasPetParam === 'true' ? true : hasPetParam === 'false' ? false : undefined

  // Form data state for each step
  const [step1Data, setStep1Data] = useState<Partial<Step1Data>>({
    checkIn: initCheckIn,
    checkOut: initCheckOut,
    adults: initAdults,
    children: initChildren,
    rooms: 1,
    hasPet: initHasPet,
  })
  const [step2Data, setStep2Data] = useState<Partial<Step2Data>>({
    acceptAlternative: true,
  })
  const [step3Data, setStep3Data] = useState<Partial<Step3Data>>({
    needOnsen: false,
    needGrooming: false,
  })
  const [step4Data, setStep4Data] = useState<Partial<Step4Data>>({
    preferredChannel: 'email',
  })
  const [step5Data, setStep5Data] = useState<Partial<Step5Data>>({
    marketingSubscribe: false,
  })

  // Current step index (1-based)
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Idempotency key: generated once per form session
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID())

  // Determine if Step 3 should be shown
  const hasPet = step1Data.hasPet === true

  // Always show all 5 steps — Step 3 shows simplified UI when no pet
  const stepSequence = useMemo(() => {
    return [1, 2, 3, 4, 5]
  }, [])

  // Current position in the step sequence
  const currentPositionIndex = stepSequence.indexOf(currentStep)

  // Steps for StepIndicator display
  const displaySteps = useMemo(() => {
    const allLabels = stepLabels[locale]
    return stepSequence.map((stepNum) => ({
      label: allLabels[stepNum - 1],
      key: `step-${stepNum}`,
    }))
  }, [stepSequence, locale])

  // Completed steps tracking
  const completedSteps = useMemo(() => {
    const completed: number[] = []
    for (let i = 0; i < currentPositionIndex; i++) {
      completed.push(i + 1) // Position-based (1-indexed for StepIndicator)
    }
    return completed
  }, [currentPositionIndex])

  // Navigate to next step
  const goToNextStep = useCallback(() => {
    const nextIndex = currentPositionIndex + 1
    if (nextIndex < stepSequence.length) {
      setCurrentStep(stepSequence[nextIndex])
      setErrors({})
      setSubmitError(null)
    }
  }, [currentPositionIndex, stepSequence])

  // Navigate to previous step
  const goToPrevStep = useCallback(() => {
    const prevIndex = currentPositionIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(stepSequence[prevIndex])
      setErrors({})
      setSubmitError(null)
    }
  }, [currentPositionIndex, stepSequence])

  // Validate current step using Zod
  const validateCurrentStep = useCallback((): boolean => {
    let result: { success: boolean; error?: { issues: Array<{ path: (string | number)[]; message: string }> } }

    switch (currentStep) {
      case 1:
        result = step1Schema.safeParse({
          ...step1Data,
          hasPet: step1Data.hasPet ?? false,
        }) as typeof result
        break
      case 2:
        result = step2Schema.safeParse(step2Data) as typeof result
        break
      case 3:
        // Skip validation when no pet — Step 3 is a pass-through
        if (!hasPet) {
          setErrors({})
          return true
        }
        result = step3Schema.safeParse(step3Data) as typeof result
        break
      case 4:
        result = step4Schema.safeParse(step4Data) as typeof result
        break
      case 5: {
        const step5Validated = {
          ...step5Data,
          petRules: hasPet ? step5Data.petRules : undefined,
        }
        result = step5Schema.safeParse(step5Validated) as typeof result
        break
      }
      default:
        return true
    }

    if (result.success) {
      setErrors({})
      return true
    }

    const fieldErrors: Record<string, string> = {}
    if (result.error) {
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
    }
    setErrors(fieldErrors)
    return false
  }, [currentStep, step1Data, step2Data, step3Data, step4Data, step5Data, hasPet])

  // Handle next button
  const handleNext = useCallback(() => {
    if (validateCurrentStep()) {
      goToNextStep()
    }
  }, [validateCurrentStep, goToNextStep])

  // Handle field changes for each step
  const handleStep1Change = useCallback((field: string, value: unknown) => {
    setStep1Data((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const handleStep2Change = useCallback((field: string, value: unknown) => {
    setStep2Data((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const handleStep3Change = useCallback((field: string, value: unknown) => {
    setStep3Data((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const handleStep4Change = useCallback((field: string, value: unknown) => {
    setStep4Data((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const handleStep5Change = useCallback((field: string, value: unknown) => {
    setStep5Data((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateCurrentStep()) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const utmParams = getUtmParams()
      const payload = {
        // Step 1
        checkIn: step1Data.checkIn,
        checkOut: step1Data.checkOut,
        adults: step1Data.adults,
        children: step1Data.children,
        rooms: step1Data.rooms,
        hasPet,
        petCount: hasPet ? step1Data.petCount : undefined,
        // Step 2
        roomPreference: step2Data.roomPreference,
        acceptAlternative: step2Data.acceptAlternative ?? true,
        // Step 3 (conditional)
        petInfo: hasPet ? step3Data : undefined,
        // Step 4
        contact: step4Data,
        // Step 5
        agreements: {
          privacyPolicy: step5Data.privacyPolicy ?? false,
          petRules: hasPet ? (step5Data.petRules ?? false) : undefined,
          cancelPolicy: step5Data.cancelPolicy ?? false,
          marketingSubscribe: step5Data.marketingSubscribe ?? false,
        },
        // Meta
        idempotencyKey: idempotencyKeyRef.current,
        source: {
          sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
          ...utmParams,
          locale,
          deviceType: getDeviceType(),
          timestamp: new Date().toISOString(),
        },
      }

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success && data.confirmationId) {
        // Success: redirect to success page (replace to prevent back navigation)
        router.replace(`/${locale}/booking/success?id=${data.confirmationId}`)
      } else {
        // Server returned error
        setSubmitError(data.error?.message || errorMessages[locale].submitFailed)
      }
    } catch {
      // Network or unexpected error - keep form data intact
      setSubmitError(errorMessages[locale].networkError)
    } finally {
      setIsSubmitting(false)
    }
  }, [validateCurrentStep, step1Data, step2Data, step3Data, step4Data, step5Data, hasPet, locale, router])

  // Check if we're on the last step
  const isLastStep = currentPositionIndex === stepSequence.length - 1

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step Indicator */}
      <StepIndicator
        steps={displaySteps}
        currentStep={currentPositionIndex + 1}
        completedSteps={completedSteps}
        className="mb-8"
      />

      {/* Form content */}
      <div className="bg-[#141414] rounded-xl border border-stone-700 p-6 sm:p-8">
        {/* Step 1 */}
        {currentStep === 1 && (
          <Step1DateGuests
            data={step1Data}
            errors={errors}
            locale={locale}
            onChange={handleStep1Change}
          />
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <Step2RoomPreference
            data={step2Data}
            errors={errors}
            locale={locale}
            onChange={handleStep2Change}
          />
        )}

        {/* Step 3 — Full form when hasPet, simplified skip-view when no pet */}
        {currentStep === 3 && (
          hasPet ? (
            <Step3PetInfo
              data={step3Data}
              errors={errors}
              locale={locale}
              onChange={handleStep3Change}
            />
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">{stepLabels[locale][2]}</h2>
              <div className="flex items-center gap-4 p-5 rounded-lg bg-[#1a1a1a] border border-stone-700/50">
                <span className="text-2xl flex-shrink-0" aria-hidden="true">🐾</span>
                <p className="text-sm text-stone-400">{errorMessages[locale].noPetStep}</p>
              </div>
            </div>
          )
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <Step4Contact
            data={step4Data}
            errors={errors}
            locale={locale}
            onChange={handleStep4Change}
          />
        )}

        {/* Step 5 */}
        {currentStep === 5 && (
          <Step5Agreements
            data={step5Data}
            errors={errors}
            locale={locale}
            hasPet={hasPet}
            faqRules={faqRules}
            onChange={handleStep5Change}
          />
        )}

        {/* Submit error message */}
        {submitError && (
          <div className="mt-4 p-3 rounded-lg bg-red-900/20 border border-red-700/30" role="alert">
            <p className="text-sm text-red-400">{submitError}</p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-stone-700">
          {currentPositionIndex > 0 ? (
            <Button
              variant="outline"
              onClick={goToPrevStep}
              disabled={isSubmitting}
            >
              {navLabels[locale].prev}
            </Button>
          ) : (
            <div />
          )}

          {isLastStep ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {navLabels[locale].submit}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
            >
              {navLabels[locale].next}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
