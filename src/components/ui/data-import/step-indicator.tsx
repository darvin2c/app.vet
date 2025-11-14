import { Check } from 'lucide-react'
import { DataImportStep } from '@/types/data-import.types'

interface StepIndicatorProps {
  currentStep: DataImportStep
  steps: Array<{
    key: DataImportStep
    label: string
    number: number
  }>
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.key === currentStep)
  }

  const currentIndex = getCurrentStepIndex()

  return (
    <div className="flex items-center justify-center space-x-4 mb-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        // const isUpcoming = index > currentIndex

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                  ${
                    isCompleted
                      ? 'bg-green-600 border-green-600 text-white'
                      : isCurrent
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-muted border-muted-foreground/25 text-muted-foreground'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium text-center
                  ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-muted-foreground'}
                `}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`
                  w-16 h-0.5 mx-4 transition-colors
                  ${index < currentIndex ? 'bg-green-600' : 'bg-muted-foreground/25'}
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
