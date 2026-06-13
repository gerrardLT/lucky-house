export interface StepIndicatorProps {
  steps: Array<{ label: string; key: string }>
  currentStep: number
  completedSteps: number[]
  className?: string
}

export function StepIndicator({
  steps,
  currentStep,
  completedSteps,
  className = '',
}: StepIndicatorProps) {
  return (
    <nav aria-label="预约步骤进度" className={className}>
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = completedSteps.includes(stepNumber)
          const isCurrent = stepNumber === currentStep
          const isUpcoming = !isCompleted && !isCurrent

          return (
            <li
              key={step.key}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0 ${
                    isCompleted
                      ? 'bg-amber-600 text-stone-900'
                      : isCurrent
                        ? 'bg-amber-900/30 text-amber-400 border-2 border-amber-600'
                        : 'bg-stone-800 text-stone-500 border border-stone-600'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={`mt-1.5 text-xs text-center whitespace-nowrap ${
                    isCompleted
                      ? 'text-amber-500 font-medium'
                      : isCurrent
                        ? 'text-amber-400 font-medium'
                        : 'text-stone-500'
                  } ${isUpcoming ? '' : ''}`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mt-[-1rem] ${
                    isCompleted ? 'bg-amber-600' : 'bg-stone-700'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
