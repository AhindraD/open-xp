import { Check } from 'lucide-react'

export type SubmissionStep = 'locked' | 'answering' | 'submitting-api' | 'signing-tx' | 'complete'

interface ExamStepIndicatorProps {
  currentStep: SubmissionStep
}

const STEPS = [
  { label: 'KMS Decrypt', key: 'locked' as const },
  { label: 'Write Answers', key: 'answering' as const },
  { label: 'Submit to API', key: 'submitting-api' as const },
  { label: 'Sign on Solana', key: 'signing-tx' as const },
  { label: 'AI Evaluation', key: 'complete' as const },
]

export function ExamStepIndicator({ currentStep }: ExamStepIndicatorProps) {
  const stepOrder = ['locked', 'answering', 'submitting-api', 'signing-tx', 'complete']
  const currentIndex = stepOrder.indexOf(currentStep)

  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((s, i) => {
        const thisIndex = stepOrder.indexOf(s.key)
        const isActive = thisIndex === currentIndex
        const isDone = thisIndex < currentIndex

        return (
          <div key={s.key} className="flex items-center gap-2 flex-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                isDone
                  ? 'bg-primary text-primary-foreground'
                  : isActive
                    ? 'bg-primary/20 text-primary border-2 border-primary'
                    : 'bg-secondary text-muted-foreground'
              }`}
            >
              {isDone ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`text-xs font-medium hidden sm:inline ${
                isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
              }`}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 rounded transition-colors ${
                  isDone ? 'bg-primary' : 'bg-border/60'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
